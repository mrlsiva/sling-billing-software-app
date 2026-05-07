import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../services/purchase-order.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-purchase-orders',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './purchase-orders.component.html',
    styleUrls: ['./purchase-orders.component.scss']
})
export class PurchaseOrdersComponent implements OnInit {
    orders: any[] = [];
    loading = true;
    search = '';
    detailOrder: any = null;
    detailItems: any[] = [];
    showDetail = false;
    loadingDetail = false;

    constructor(private svc: PurchaseOrderService, private router: Router) {}

    ngOnInit() { this.load(); }

    load() {
        this.loading = true;
        this.svc.list(this.search).subscribe({
            next: (res: any) => { this.orders = res?.data?.data ?? res?.data ?? res ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewDetail(order: any) {
        this.detailOrder = order;
        this.detailItems = [];
        this.showDetail = true;
        this.loadingDetail = true;
        this.svc.getDetail(order.id).subscribe({
            next: (res: any) => {
                this.detailItems = res?.data?.items ?? res?.data ?? [];
                this.loadingDetail = false;
            },
            error: () => { this.loadingDetail = false; }
        });
    }

    createNew() { this.router.navigate(['/purchase-orders/create']); }
}
