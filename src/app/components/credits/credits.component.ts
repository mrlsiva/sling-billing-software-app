import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CreditsService } from '../../services/credits.service';
import { ToastService } from '../../services/toast.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-credits',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, StatusBadgeComponent, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './credits.component.html',
    styleUrls: ['../inventory/inventory-shared.scss']
})
export class CreditsComponent implements OnInit {
    isHo: boolean = false;
    credits: any[] = []; loading = true;
    paymentMethods: any[] = [];
    filters = { date: new Date().toISOString().split('T')[0], customer: '' };

    showPaymentsModal = false; creditPayments: any[] = []; selectedCredit: any = null;
    showPayModal = false; savingPayment = false;
    payForm = { credit_id: 0, payment_id: '', amount: '', remaining: 0 };

    constructor(private svc: CreditsService, private toast: ToastService, private auth: AuthService) {}

    ngOnInit() {
        this.isHo = this.auth.isHO();
        this.load();
        this.svc.getPaymentList().subscribe({
            next: (r: any) => { this.paymentMethods = (r?.data ?? r ?? []).filter((p: any) => p.id != 6); }
        });
    }

    load() {
        this.loading = true;
        const obs = this.isHo ? this.svc.getHoCredits(this.filters) : this.svc.getBranchCredits(this.filters);
        obs.subscribe({
            next: (r: any) => { this.credits = r?.data?.data ?? r?.data ?? r ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewPayments(credit: any) {
        this.selectedCredit = credit; this.creditPayments = []; this.showPaymentsModal = true;
        const obs = this.isHo ? this.svc.getHoCreditPayments(credit.id) : this.svc.getBranchCreditPayments(credit.id);
        obs.subscribe({ next: (r: any) => { this.creditPayments = r?.data ?? r ?? []; } });
    }

    openPayModal(credit: any) {
        this.selectedCredit = credit;
        this.payForm = { credit_id: credit.id, payment_id: '', amount: '', remaining: credit.remaining_amount ?? 0 };
        this.showPayModal = true;
    }

    savePayment() {
        if (+this.payForm.amount > this.payForm.remaining) { this.toast.show('Amount exceeds remaining', 'error'); return; }
        this.savingPayment = true;
        const obs = this.isHo ? this.svc.storeHoPayment(this.payForm) : this.svc.storeBranchPayment(this.payForm);
        obs.subscribe({
            next: () => { this.savingPayment = false; this.showPayModal = false; this.toast.show('Payment recorded', 'success'); this.load(); },
            error: () => { this.savingPayment = false; this.toast.show('Failed', 'error'); }
        });
    }

    statusLabel(s: number | string): string {
        const map: any = { '0': 'Unpaid', '1': 'Paid', '2': 'Partial' };
        return map[String(s)] ?? String(s);
    }
}
