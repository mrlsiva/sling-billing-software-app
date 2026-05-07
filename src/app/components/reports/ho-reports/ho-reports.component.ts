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
    selector: 'app-ho-reports',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatCardComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './ho-reports.component.html',
    styleUrls: ['../../inventory/inventory-shared.scss']
})
export class HoReportsComponent implements OnInit {
    activeTab = 'daily';
    loading = false;
    branches: any[] = [];
    data: any = null;

    dailyFilters = { branch: '0', date: new Date().toISOString().split('T')[0] };
    ordersFilters = { branch: '0', from_date: '', to_date: '', search: '' };
    salesFilters = { branch: '0', from_date: '', to_date: '' };
    purchaseFilters = { from_date: '', to_date: '', vendor: '' };
    transferFilters = { branch: '0', from_date: '', to_date: '', product: '' };

    showTransferBill = false; transferBillItems: any[] = [];

    constructor(private svc: ReportsService) {}

    ngOnInit() { this.loadTab(); }

    loadTab() {
        this.loading = true; this.data = null;
        let obs$;
        switch (this.activeTab) {
            case 'daily':    obs$ = this.svc.getHoDaily(this.dailyFilters);       break;
            case 'orders':   obs$ = this.svc.getHoOrders(this.ordersFilters);     break;
            case 'sales':    obs$ = this.svc.getHoSales(this.salesFilters);       break;
            case 'purchase': obs$ = this.svc.getHoPurchase(this.purchaseFilters); break;
            case 'transfer': obs$ = this.svc.getHoTransfer(this.transferFilters); break;
            default:         obs$ = this.svc.getHoDaily(this.dailyFilters);
        }
        obs$.subscribe({
            next: (r: any) => { this.data = r?.data ?? r; this.branches = this.data?.branches ?? this.branches; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    setTab(tab: string) { this.activeTab = tab; this.loadTab(); }

    viewTransferBill(t: any) {
        this.transferBillItems = t.products ?? t.items ?? [];
        this.showTransferBill = true;
    }

    // Helpers
    orders()    { return this.data?.orders   ?? []; }
    payments()  { return this.data?.paymentSummary ?? this.data?.payment_summary ?? []; }
    transfers() { return this.data?.transfers ?? []; }
    purchases() { return this.data?.purchases ?? []; }
    vendorPayments() { return this.data?.payments ?? []; }
}
