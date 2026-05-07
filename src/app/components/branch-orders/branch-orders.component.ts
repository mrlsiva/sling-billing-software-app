import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BranchOrdersService } from '../../services/branch-orders.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-branch-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    template: `
    <div class="page">
        <div class="page-header">
            <h2 class="page-title"><i class="fa fa-receipt"></i> Orders</h2>
        </div>
        <div class="filter-row">
            <div class="search-box">
                <i class="fa fa-search"></i>
                <input type="text" [(ngModel)]="search" placeholder="Search bill / customer / phone..." (keyup.enter)="load()" />
            </div>
            <button class="btn-apply" (click)="load()"><i class="fa fa-search"></i> Search</button>
        </div>
        <div class="section-card">
            <app-skeleton-loader *ngIf="loading" type="table" [count]="8"></app-skeleton-loader>
            <div class="table-responsive" *ngIf="!loading && orders.length > 0">
                <table class="dt">
                    <thead><tr><th>Bill ID</th><th>Customer</th><th class="tr">Amount</th><th>Date</th><th>Refunded</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr *ngFor="let o of orders">
                            <td><strong>{{ o.bill_id }}</strong></td>
                            <td>{{ o.customer?.name ?? o.customer_name ?? '-' }}</td>
                            <td class="tr">{{ (o.bill_amount ?? 0) | amount }}</td>
                            <td>{{ o.billed_on | dateFormat }}</td>
                            <td>
                                <app-status-badge *ngIf="o.is_refunded === 1" status="refunded"></app-status-badge>
                                <span *ngIf="!o.is_refunded" class="text-muted">-</span>
                            </td>
                            <td>
                                <div class="action-btns">
                                    <button class="btn-icon" (click)="refund(o)" [disabled]="o.is_refunded === 1" title="Refund"><i class="fa fa-undo"></i></button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <app-empty-state *ngIf="!loading && orders.length === 0" title="No orders found" icon="fa fa-receipt"></app-empty-state>
        </div>
    </div>`,
    styleUrls: ['../inventory/inventory-shared.scss']
})
export class BranchOrdersComponent implements OnInit {
    orders: any[] = []; loading = true; search = '';

    constructor(private svc: BranchOrdersService, private router: Router) {}
    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.svc.getOrders(this.search).subscribe({
            next: (r: any) => { this.orders = r?.data?.data ?? r?.data ?? r ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    refund(order: any) { this.router.navigate(['/branch/orders', order.id, 'refund']); }
}
