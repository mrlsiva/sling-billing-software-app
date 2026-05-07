import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { VendorService } from '../../services/vendor.service';
import { ToastService } from '../../services/toast.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-vendor-ledger',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './vendor-ledger.component.html',
    styleUrls: ['./vendor-ledger.component.scss']
})
export class VendorLedgerComponent implements OnInit {
    vendorId!: number;
    loading = true;
    data: any = null;
    orders: any[] = [];
    payments: any[] = [];
    paymentMethods: any[] = [];
    showPaymentPanel = false;
    showPayments = false;
    showUpdateModal = false;
    showRefundModal = false;
    savingPayment = false;
    savingUpdate = false;
    savingRefund = false;
    expandedRow: number | null = null;

    filters = { from_date: '', to_date: '', search: '' };

    paymentForm = { vendor_id: 0, payment_id: '', amount: '', comment: '' };
    updateForm = { purchase_order_id: 0, old_amount: '', new_amount: '', reason: '' };
    refundForm = { purchase_order_id: 0, refund_qty: '', refund_amount: '', comment: '' };

    constructor(
        private route: ActivatedRoute,
        private vendorSvc: VendorService,
        private toast: ToastService
    ) {}

    ngOnInit() {
        this.vendorId = +this.route.snapshot.params['id'];
        this.paymentForm.vendor_id = this.vendorId;
        this.load();
        this.loadPaymentMethods();
    }

    load() {
        this.loading = true;
        this.vendorSvc.getLedger(this.vendorId, this.filters).subscribe({
            next: (res: any) => {
                this.data = res?.data ?? res;
                this.orders = this.data?.purchase_orders?.data ?? this.data?.purchase_orders ?? [];
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    loadPaymentMethods() {
        this.vendorSvc.getPaymentList().subscribe({
            next: (res: any) => { this.paymentMethods = res?.data ?? res ?? []; }
        });
    }

    loadPayments() {
        this.showPayments = !this.showPayments;
        if (this.showPayments && this.payments.length === 0) {
            this.vendorSvc.getPayments(this.vendorId).subscribe({
                next: (res: any) => { this.payments = res?.data ?? res ?? []; }
            });
        }
    }

    toggleRow(id: number) { this.expandedRow = this.expandedRow === id ? null : id; }

    openUpdate(order: any) {
        this.updateForm = { purchase_order_id: order.id, old_amount: order.gross ?? order.bill_amount, new_amount: '', reason: '' };
        this.showUpdateModal = true;
    }

    openRefund(order: any) {
        this.refundForm = { purchase_order_id: order.id, refund_qty: '', refund_amount: '', comment: '' };
        this.showRefundModal = true;
    }

    savePayment() {
        this.savingPayment = true;
        this.vendorSvc.storePayment(this.paymentForm).subscribe({
            next: () => {
                this.savingPayment = false; this.showPaymentPanel = false;
                this.toast.show('Payment recorded', 'success');
                this.load(); this.payments = []; this.showPayments = false;
            },
            error: () => { this.savingPayment = false; this.toast.show('Payment failed', 'error'); }
        });
    }

    saveUpdate() {
        this.savingUpdate = true;
        this.vendorSvc.updatePurchaseOrder(this.updateForm).subscribe({
            next: () => { this.savingUpdate = false; this.showUpdateModal = false; this.toast.show('Updated', 'success'); this.load(); },
            error: () => { this.savingUpdate = false; this.toast.show('Update failed', 'error'); }
        });
    }

    saveRefund() {
        this.savingRefund = true;
        this.vendorSvc.refundPurchaseOrder(this.refundForm).subscribe({
            next: () => { this.savingRefund = false; this.showRefundModal = false; this.toast.show('Refund processed', 'success'); this.load(); },
            error: () => { this.savingRefund = false; this.toast.show('Refund failed', 'error'); }
        });
    }

    get vendor() { return this.data?.vendor ?? {}; }
    get stats() { return this.data?.stats ?? this.data ?? {}; }
}
