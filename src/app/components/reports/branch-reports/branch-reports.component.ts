import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReportsService } from '../../../services/reports.service';
import { AmountPipe } from '../../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { StatCardComponent } from '../../../shared/components/stat-card/stat-card.component';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-branch-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatCardComponent, SkeletonLoaderComponent, EmptyStateComponent],
    template: `
    <div class="page">
        <div class="page-header">
            <h2 class="page-title"><i class="fa fa-chart-bar"></i> Reports</h2>
        </div>
        <div class="tabs">
            <button *ngFor="let t of ['daily','orders','sales','transfer']" [class.active]="activeTab === t" (click)="setTab(t)">{{ t | titlecase }}</button>
        </div>

        <!-- Daily -->
        <ng-container *ngIf="activeTab === 'daily'">
            <div class="filter-row">
                <input type="date" [(ngModel)]="dailyDate" />
                <button class="btn-apply" (click)="loadTab()"><i class="fa fa-search"></i> Apply</button>
            </div>
            <app-skeleton-loader *ngIf="loading" type="cards" [count]="4"></app-skeleton-loader>
            <ng-container *ngIf="!loading && data">
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:14px;margin-bottom:16px">
                    <app-stat-card label="Total Sales"    [value]="(data.total_sales    ?? 0) | amount" icon="fa fa-rupee-sign" color="success"></app-stat-card>
                    <app-stat-card label="Credit Amount"  [value]="(data.credit_amount  ?? 0) | amount" icon="fa fa-credit-card" color="danger"></app-stat-card>
                </div>
                <div class="section-card"><h3 class="section-title">Orders</h3>
                    <div class="table-responsive" *ngIf="(data?.orders ?? []).length > 0">
                        <table class="dt"><thead><tr><th>Bill ID</th><th>Customer</th><th class="tr">Amount</th><th>Payment Mode</th><th>Date</th></tr></thead>
                            <tbody><tr *ngFor="let o of (data?.orders ?? [])"><td>{{ o.bill_id }}</td><td>{{ o.customer_name }}</td><td class="tr">{{ (o.bill_amount ?? 0) | amount }}</td><td>{{ o.payment_mode }}</td><td>{{ o.billed_on | dateFormat }}</td></tr></tbody>
                        </table>
                    </div>
                    <app-empty-state *ngIf="(data?.orders ?? []).length === 0" title="No orders"></app-empty-state>
                </div>
                <div class="section-card"><h3 class="section-title">Payment Summary</h3>
                    <div class="table-responsive" *ngIf="(data?.paymentSummary ?? []).length > 0">
                        <table class="dt"><thead><tr><th>Mode</th><th class="tr">Amount</th></tr></thead>
                            <tbody><tr *ngFor="let p of (data?.paymentSummary ?? [])"><td>{{ p.payment_mode ?? p.method }}</td><td class="tr">{{ (p.total_amount ?? p.amount ?? 0) | amount }}</td></tr></tbody>
                        </table>
                    </div>
                </div>
            </ng-container>
        </ng-container>

        <!-- Orders -->
        <ng-container *ngIf="activeTab === 'orders'">
            <div class="filter-row">
                <input type="date" [(ngModel)]="ordersFilters.from_date" /><input type="date" [(ngModel)]="ordersFilters.to_date" />
                <input type="text" [(ngModel)]="ordersFilters.search" placeholder="Search..." />
                <button class="btn-apply" (click)="loadTab()"><i class="fa fa-search"></i> Apply</button>
            </div>
            <app-skeleton-loader *ngIf="loading" type="table" [count]="6"></app-skeleton-loader>
            <div class="section-card" *ngIf="!loading">
                <div class="table-responsive" *ngIf="(data?.orders ?? []).length > 0">
                    <table class="dt"><thead><tr><th>Bill ID</th><th>Customer</th><th>Phone</th><th class="tr">Amount</th><th class="tr">Discount</th><th>Date</th><th>Staff</th></tr></thead>
                        <tbody><tr *ngFor="let o of (data?.orders ?? [])"><td>{{ o.bill_id }}</td><td>{{ o.customer_name }}</td><td>{{ o.phone }}</td><td class="tr">{{ (o.bill_amount ?? 0) | amount }}</td><td class="tr">{{ (o.discount ?? 0) | amount }}</td><td>{{ o.billed_on | dateFormat }}</td><td>{{ o.staff }}</td></tr></tbody>
                    </table>
                </div>
                <app-empty-state *ngIf="(data?.orders ?? []).length === 0" title="No orders"></app-empty-state>
            </div>
        </ng-container>

        <!-- Sales -->
        <ng-container *ngIf="activeTab === 'sales'">
            <div class="filter-row">
                <input type="date" [(ngModel)]="salesFilters.from_date" /><input type="date" [(ngModel)]="salesFilters.to_date" />
                <button class="btn-apply" (click)="loadTab()"><i class="fa fa-search"></i> Apply</button>
            </div>
            <app-skeleton-loader *ngIf="loading" type="cards" [count]="1"></app-skeleton-loader>
            <ng-container *ngIf="!loading && data">
                <app-stat-card label="Total Sales" [value]="(data.total_sales ?? 0) | amount" icon="fa fa-rupee-sign" color="success" style="display:block;margin-bottom:14px;max-width:220px"></app-stat-card>
                <div class="section-card">
                    <div class="table-responsive" *ngIf="(data?.sales ?? []).length > 0">
                        <table class="dt"><thead><tr><th>Bill ID</th><th>Customer</th><th class="tr">Amount</th><th>Mode</th><th>Date</th></tr></thead>
                            <tbody><tr *ngFor="let s of (data?.sales ?? [])"><td>{{ s.bill_id }}</td><td>{{ s.customer_name }}</td><td class="tr">{{ (s.bill_amount ?? 0) | amount }}</td><td>{{ s.payment_mode }}</td><td>{{ s.billed_on | dateFormat }}</td></tr></tbody>
                        </table>
                    </div>
                    <app-empty-state *ngIf="(data?.sales ?? []).length === 0" title="No sales"></app-empty-state>
                </div>
            </ng-container>
        </ng-container>

        <!-- Transfer -->
        <ng-container *ngIf="activeTab === 'transfer'">
            <div class="filter-row">
                <input type="date" [(ngModel)]="transferFilters.from_date" /><input type="date" [(ngModel)]="transferFilters.to_date" />
                <input type="text" [(ngModel)]="transferFilters.product" placeholder="Product..." />
                <button class="btn-apply" (click)="loadTab()"><i class="fa fa-search"></i> Apply</button>
            </div>
            <app-skeleton-loader *ngIf="loading" type="table" [count]="5"></app-skeleton-loader>
            <div class="section-card" *ngIf="!loading">
                <div class="table-responsive" *ngIf="(data?.transfers ?? []).length > 0">
                    <table class="dt"><thead><tr><th>Invoice</th><th>From</th><th>To</th><th>Date</th></tr></thead>
                        <tbody><tr *ngFor="let t of (data?.transfers ?? [])"><td>{{ t.invoice_no }}</td><td>{{ t.from }}</td><td>{{ t.to }}</td><td>{{ t.date | dateFormat }}</td></tr></tbody>
                    </table>
                </div>
                <app-empty-state *ngIf="(data?.transfers ?? []).length === 0" title="No transfers"></app-empty-state>
            </div>
        </ng-container>
    </div>`,
    styles: [`
        @use '../../inventory/inventory-shared.scss';
        .tabs { display: flex; gap: 2px; margin-bottom: 14px; border-bottom: 2px solid #e8e8e8; }
        .tabs button { padding: 8px 18px; border: none; background: none; font-size: 13px; font-weight: 600; color: #888; cursor: pointer; border-bottom: 2px solid transparent; margin-bottom: -2px; text-transform: capitalize; }
        .tabs button.active { color: var(--color-primary-bg); border-bottom-color: var(--color-primary-bg); }
    `]
})
export class BranchReportsComponent implements OnInit {
    activeTab = 'daily'; loading = false; data: any = null;
    dailyDate = new Date().toISOString().split('T')[0];
    ordersFilters = { from_date: '', to_date: '', search: '' };
    salesFilters = { from_date: '', to_date: '' };
    transferFilters = { from_date: '', to_date: '', product: '' };

    constructor(private svc: ReportsService) {}
    ngOnInit() { this.loadTab(); }

    setTab(tab: string) { this.activeTab = tab; this.loadTab(); }

    loadTab() {
        this.loading = true; this.data = null;
        let obs$;
        switch (this.activeTab) {
            case 'daily':    obs$ = this.svc.getBranchDaily({ date: this.dailyDate }); break;
            case 'orders':   obs$ = this.svc.getBranchOrders(this.ordersFilters); break;
            case 'sales':    obs$ = this.svc.getBranchSales(this.salesFilters); break;
            case 'transfer': obs$ = this.svc.getBranchTransfer(this.transferFilters); break;
            default:         obs$ = this.svc.getBranchDaily({ date: this.dailyDate });
        }
        obs$.subscribe({
            next: (r: any) => { this.data = r?.data ?? r; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }
}
