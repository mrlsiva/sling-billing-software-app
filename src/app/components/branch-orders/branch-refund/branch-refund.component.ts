import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BranchOrdersService } from '../../../services/branch-orders.service';
import { ToastService } from '../../../services/toast.service';
import { AmountPipe } from '../../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';

@Component({
    selector: 'app-branch-refund',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, SkeletonLoaderComponent],
    templateUrl: './branch-refund.component.html',
    styleUrls: ['../../inventory/inventory-shared.scss']
})
export class BranchRefundComponent implements OnInit {
    orderId!: number;
    loading = true; saving = false;
    orderData: any = null;
    staffs: any[] = []; payments: any[] = []; products: any[] = [];

    form = { refunded_by: '', refund_amount: '', reason: '', payment_id: '', payment_detail: '' };
    productRows: { id: number; name: string; ordered_qty: number; refund_qty: number; price: number; imeis: string[]; selected_imeis: string[]; }[] = [];
    errors: any = {};

    constructor(private route: ActivatedRoute, private router: Router, private svc: BranchOrdersService, private toast: ToastService) {}

    ngOnInit() {
        this.orderId = +this.route.snapshot.params['id'];
        this.svc.getRefundData(this.orderId).subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                this.orderData = d;
                this.staffs = d?.staffs ?? [];
                this.payments = d?.payments ?? [];
                this.productRows = (d?.order_details ?? []).map((p: any) => ({
                    id: p.product_id ?? p.id, name: p.name ?? p.product_name,
                    ordered_qty: parseInt(p.quantity ?? p.qty), refund_qty: 0,
                    price: parseFloat(p.selling_price ?? p.price), imeis: p.imeis ?? [], selected_imeis: []
                }));
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    toggleImei(row: any, imei: string) {
        const idx = row.selected_imeis.indexOf(imei);
        if (idx >= 0) row.selected_imeis.splice(idx, 1); else row.selected_imeis.push(imei);
    }

    submit() {
        this.errors = {};
        if (!this.form.refunded_by) { this.errors.refunded_by = 'Required'; return; }
        if (!this.form.refund_amount || +this.form.refund_amount <= 0) { this.errors.refund_amount = 'Enter valid amount'; return; }
        if (!this.form.reason.trim()) { this.errors.reason = 'Required'; return; }

        this.saving = true;
        const body = {
            order_id: this.orderId,
            ...this.form,
            products: this.productRows.map(r => ({ product_id: r.id, refund_qty: r.refund_qty, imeis: r.selected_imeis }))
        };
        this.svc.processRefund(body).subscribe({
            next: () => {
                this.saving = false;
                this.toast.show('Refund processed successfully', 'success');
                this.router.navigate(['/branch/orders']);
            },
            error: (err: any) => {
                this.saving = false;
                this.errors = err?.error?.errors ?? {};
                this.toast.show('Refund failed', 'error');
            }
        });
    }
}
