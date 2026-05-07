import { Component, Input, Output, EventEmitter, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmountPipe } from '../../pipes/amount.pipe';
import { DateFormatPipe } from '../../pipes/date-format.pipe';
import { StatusBadgeComponent } from '../status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../empty-state/empty-state.component';

export interface TableColumn {
    key: string;
    label: string;
    type?: 'text' | 'amount' | 'date' | 'badge' | 'number' | 'template';
    align?: 'left' | 'center' | 'right';
    template?: TemplateRef<any>;
}

@Component({
    selector: 'app-data-table',
    standalone: true,
    imports: [CommonModule, AmountPipe, DateFormatPipe, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    template: `
        <div class="dt-wrap">
            <app-skeleton-loader *ngIf="loading" type="table" [count]="5"></app-skeleton-loader>

            <ng-container *ngIf="!loading">
                <div class="table-responsive">
                    <table class="dt" *ngIf="data.length > 0">
                        <thead>
                            <tr>
                                <th *ngFor="let col of columns" [style.text-align]="col.align || 'left'">
                                    {{ col.label }}
                                </th>
                                <th *ngIf="actionsTemplate" style="text-align:center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr *ngFor="let row of data; let i = index">
                                <td *ngFor="let col of columns" [style.text-align]="col.align || 'left'">
                                    <ng-container [ngSwitch]="col.type">
                                        <ng-container *ngSwitchCase="'amount'">{{ getCellValue(row, col.key) | amount }}</ng-container>
                                        <ng-container *ngSwitchCase="'date'">{{ getCellValue(row, col.key) | dateFormat }}</ng-container>
                                        <ng-container *ngSwitchCase="'badge'">
                                            <app-status-badge [status]="getCellValue(row, col.key)"></app-status-badge>
                                        </ng-container>
                                        <ng-container *ngSwitchCase="'template'">
                                            <ng-container *ngTemplateOutlet="col.template!; context: { $implicit: row, index: i }"></ng-container>
                                        </ng-container>
                                        <ng-container *ngSwitchDefault>{{ getCellValue(row, col.key) }}</ng-container>
                                    </ng-container>
                                </td>
                                <td *ngIf="actionsTemplate" style="text-align:center">
                                    <ng-container *ngTemplateOutlet="actionsTemplate; context: { $implicit: row, index: i }"></ng-container>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <app-empty-state *ngIf="data.length === 0" [title]="emptyTitle"></app-empty-state>

                <div class="dt-pagination" *ngIf="total > perPage">
                    <span class="pg-info">Showing {{ (page - 1) * perPage + 1 }}–{{ min(page * perPage, total) }} of {{ total }}</span>
                    <div class="pg-btns">
                        <button (click)="changePage(page - 1)" [disabled]="page === 1">‹</button>
                        <button *ngFor="let p of pageNumbers"
                            [class.active]="p === page"
                            (click)="changePage(p)">{{ p }}</button>
                        <button (click)="changePage(page + 1)" [disabled]="page === lastPage">›</button>
                    </div>
                </div>
            </ng-container>
        </div>
    `,
    styles: [`
        .dt-wrap { width: 100%; }
        .table-responsive { overflow-x: auto; }
        .dt { width: 100%; border-collapse: collapse; font-size: 12px; }
        .dt thead th {
            background: var(--color-primary-bg); color: #fff;
            padding: 10px 12px; font-weight: 600; white-space: nowrap;
        }
        .dt tbody td { padding: 9px 12px; border-bottom: 1px solid #f0f0f0; color: #444; }
        .dt tbody tr:hover { background: #fafafa; }
        .dt-pagination {
            display: flex; align-items: center; justify-content: space-between;
            padding: 10px 4px; margin-top: 4px;
        }
        .pg-info { font-size: 11px; color: #888; }
        .pg-btns { display: flex; gap: 4px; }
        .pg-btns button {
            min-width: 30px; height: 30px; border: 1px solid #ddd;
            border-radius: 6px; background: #fff; font-size: 12px;
            cursor: pointer; color: #555;
        }
        .pg-btns button.active { background: var(--color-primary-bg); color: #fff; border-color: var(--color-primary-bg); }
        .pg-btns button:disabled { opacity: .4; cursor: default; }
    `]
})
export class DataTableComponent {
    @Input() columns: TableColumn[] = [];
    @Input() data: any[] = [];
    @Input() loading: boolean = false;
    @Input() total: number = 0;
    @Input() page: number = 1;
    @Input() perPage: number = 10;
    @Input() actionsTemplate: TemplateRef<any> | null = null;
    @Input() emptyTitle: string = 'No records found';
    @Output() pageChange = new EventEmitter<number>();

    get lastPage(): number { return Math.ceil(this.total / this.perPage) || 1; }

    get pageNumbers(): number[] {
        const last = this.lastPage;
        const cur = this.page;
        const delta = 2;
        const range: number[] = [];
        for (let i = Math.max(1, cur - delta); i <= Math.min(last, cur + delta); i++) range.push(i);
        return range;
    }

    getCellValue(row: any, key: string): any {
        return key.split('.').reduce((o, k) => o?.[k], row);
    }

    min(a: number, b: number): number { return Math.min(a, b); }

    changePage(p: number) {
        if (p < 1 || p > this.lastPage) return;
        this.pageChange.emit(p);
    }
}
