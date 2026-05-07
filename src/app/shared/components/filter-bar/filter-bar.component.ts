import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterField {
    key: string;
    label: string;
    type: 'text' | 'date' | 'select';
    placeholder?: string;
    options?: { value: any; label: string }[];
}

@Component({
    selector: 'app-filter-bar',
    standalone: true,
    imports: [CommonModule, FormsModule],
    template: `
        <div class="filter-bar">
            <ng-container *ngFor="let field of fields">
                <div class="filter-field">
                    <label>{{ field.label }}</label>
                    <input *ngIf="field.type === 'text'" type="text"
                        [(ngModel)]="values[field.key]"
                        [placeholder]="field.placeholder || 'Search...'"
                        (keyup.enter)="apply()" />
                    <input *ngIf="field.type === 'date'" type="date"
                        [(ngModel)]="values[field.key]" />
                    <select *ngIf="field.type === 'select'" [(ngModel)]="values[field.key]">
                        <option value="">All</option>
                        <option *ngFor="let opt of field.options" [value]="opt.value">{{ opt.label }}</option>
                    </select>
                </div>
            </ng-container>
            <button class="btn-apply" (click)="apply()">
                <i class="fa fa-search"></i> Apply
            </button>
            <button class="btn-reset" (click)="reset()">
                <i class="fa fa-times"></i> Reset
            </button>
        </div>
    `,
    styles: [`
        .filter-bar {
            display: flex; flex-wrap: wrap; gap: 10px;
            align-items: flex-end; background: #fff;
            padding: 12px 14px; border-radius: 10px;
            box-shadow: 0 1px 4px rgba(0,0,0,.06); margin-bottom: 14px;
        }
        .filter-field { display: flex; flex-direction: column; gap: 4px; }
        .filter-field label { font-size: 11px; font-weight: 600; color: #666; }
        .filter-field input,
        .filter-field select {
            height: 34px; padding: 0 10px; border: 1px solid #ddd;
            border-radius: 7px; font-size: 12px; color: #333; outline: none;
            min-width: 140px;
        }
        .filter-field input:focus,
        .filter-field select:focus { border-color: var(--color-primary-bg); }
        .btn-apply, .btn-reset {
            height: 34px; padding: 0 14px; border-radius: 7px;
            border: none; font-size: 12px; font-weight: 600;
            cursor: pointer; display: flex; align-items: center; gap: 6px;
        }
        .btn-apply { background: var(--color-primary-bg); color: #fff; }
        .btn-reset { background: #eee; color: #555; }
    `]
})
export class FilterBarComponent implements OnInit {
    @Input() fields: FilterField[] = [];
    @Input() initialValues: Record<string, any> = {};
    @Output() filterChange = new EventEmitter<Record<string, any>>();

    values: Record<string, any> = {};

    ngOnInit() {
        this.fields.forEach(f => this.values[f.key] = this.initialValues[f.key] ?? '');
    }

    apply() { this.filterChange.emit({ ...this.values }); }

    reset() {
        this.fields.forEach(f => this.values[f.key] = '');
        this.filterChange.emit({ ...this.values });
    }
}
