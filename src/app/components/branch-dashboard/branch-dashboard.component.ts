import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DashboardService } from '../../services/dashboard.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { StatCardComponent } from '../../shared/components/stat-card/stat-card.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
    selector: 'app-branch-dashboard',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, StatCardComponent, SkeletonLoaderComponent],
    template: `
        <div class="dashboard-page">
            <div class="page-header">
                <h2 class="page-title"><i class="fa fa-tachometer-alt"></i> Dashboard</h2>
                <div class="date-filter">
                    <div class="filter-field">
                        <label>From</label>
                        <input type="date" [(ngModel)]="fromDate" />
                    </div>
                    <div class="filter-field">
                        <label>To</label>
                        <input type="date" [(ngModel)]="toDate" />
                    </div>
                    <button class="btn-apply" (click)="load()">
                        <i class="fa fa-search"></i> Apply
                    </button>
                </div>
            </div>

            <app-skeleton-loader *ngIf="loading" type="cards" [count]="4"></app-skeleton-loader>

            <div class="stat-cards" *ngIf="!loading && data">
                <app-stat-card label="Date Orders"   [value]="data.date_orders        ?? 0"                     icon="fa fa-shopping-bag" color="primary"></app-stat-card>
                <app-stat-card label="Date Amount"   [value]="(data.date_order_amount ?? 0) | amount"           icon="fa fa-rupee-sign"   color="success"></app-stat-card>
                <app-stat-card label="Total Orders"  [value]="data.total_orders       ?? 0"                     icon="fa fa-list"         color="secondary"></app-stat-card>
                <app-stat-card label="Total Amount"  [value]="(data.total_order_amount ?? 0) | amount"          icon="fa fa-chart-line"   color="warning"></app-stat-card>
            </div>
        </div>
    `,
    styles: [`
        .dashboard-page { padding: 14px; }
        .page-header {
            display: flex; align-items: center; justify-content: space-between;
            flex-wrap: wrap; gap: 10px; margin-bottom: 16px;
        }
        .page-title { font-size: 18px; font-weight: 700; color: #333; margin: 0; display: flex; align-items: center; gap: 8px; }
        .page-title i { color: var(--color-primary-bg); }
        .date-filter { display: flex; align-items: flex-end; gap: 8px; flex-wrap: wrap; }
        .filter-field { display: flex; flex-direction: column; gap: 3px; }
        .filter-field label { font-size: 11px; font-weight: 600; color: #666; }
        .filter-field input { height: 32px; padding: 0 10px; border: 1px solid #ddd; border-radius: 7px; font-size: 12px; outline: none; }
        .btn-apply { height: 32px; padding: 0 14px; background: var(--color-primary-bg); color: #fff; border: none; border-radius: 7px; font-size: 12px; font-weight: 600; cursor: pointer; display: flex; align-items: center; gap: 6px; }
        .stat-cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
    `]
})
export class BranchDashboardComponent implements OnInit {
    loading = true;
    data: any = null;
    fromDate: string = '';
    toDate: string = '';

    constructor(private dashboardService: DashboardService) {}

    ngOnInit() {
        const today = new Date().toISOString().split('T')[0];
        this.fromDate = today;
        this.toDate = today;
        this.load();
    }

    load() {
        this.loading = true;
        this.dashboardService.getBranchDashboard(this.fromDate, this.toDate).subscribe({
            next: (res: any) => { this.data = res?.data ?? res; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
}
