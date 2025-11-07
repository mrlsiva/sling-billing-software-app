import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

interface Payment {
    id: number;
    shop_id: number;
    payment_id: number;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface PaymentResponse {
    code: number;
    message: string;
    success: boolean;
    data: Payment[];
}

@Component({
    selector: 'app-payment-list',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './payment-list.component.html',
    styleUrl: './payment-list.component.scss'
})
export class PaymentListComponent implements OnInit, OnDestroy {
    payments: Payment[] = [];
    filteredPayments: Payment[] = [];
    loading = true;
    error: string | null = null;

    // Search properties
    searchTerm: string = '';

    // Modal properties
    showModal: boolean = false;
    isEditMode: boolean = false;
    modalTitle: string = '';

    // Form properties
    paymentId: number | null = null;
    selectedPaymentId: number | null = null;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router,
        private toast: ToastService
    ) { }

    ngOnInit() {
        this.loadPayments();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadPayments() {
        this.loading = true;
        this.error = null;

        const headers = this.auth.authHeaders();

        this.http.get<PaymentResponse>(`${environment.apiBase}/payments/list`, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Payments API Response:', response);

                    if (response.success && response.data) {
                        this.payments = response.data;
                        this.filteredPayments = this.payments;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterPayments();
                        }
                    } else {
                        this.error = response.message || 'Failed to load payments';
                        this.payments = [];
                        this.filteredPayments = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading payments:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view payments.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load payments. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    // Status toggle - local for now since API might not be implemented
    togglePaymentStatus(paymentId: number, currentStatus: number) {
        try {
            // Update the payment status in the local array
            const paymentIndex = this.payments.findIndex(payment => payment.id === paymentId);
            if (paymentIndex !== -1) {
                this.payments[paymentIndex].is_active = this.payments[paymentIndex].is_active === 1 ? 0 : 1;
                this.filterPayments(); // Refresh filtered payments

                const newStatus = this.payments[paymentIndex].is_active === 1 ? 'Active' : 'Inactive';
                console.log(`Payment method ${this.payments[paymentIndex].payment_id} status changed to: ${newStatus}`);

                // Show success message
                this.toast.show(`Payment method set to ${newStatus}`, 'info');
            }
        } catch (err: any) {
            console.error('Error updating payment status:', err);
            this.error = 'Failed to update payment status';
        }
    }

    refreshPayments() {
        this.loadPayments();
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Search functionality
    onSearchChange() {
        this.filterPayments();
    }

    filterPayments() {
        if (!this.searchTerm.trim()) {
            this.filteredPayments = this.payments;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredPayments = this.payments.filter(payment =>
                payment.payment_id.toString().includes(searchLower) ||
                payment.id.toString().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredPayments = this.payments;
    }

    getStatusText(isActive: number): string {
        return isActive === 1 ? 'Active' : 'Inactive';
    }

    getStatusClass(isActive: number): string {
        return isActive === 1 ? 'status-active' : 'status-inactive';
    }

    getPaymentMethodName(paymentId: number): string {
        // Map payment IDs to readable names
        const paymentMethods: { [key: number]: string } = {
            1: 'Cash',
            2: 'Credit Card',
            3: 'Debit Card',
            4: 'Bank Transfer',
            5: 'UPI',
            6: 'Digital Wallet',
            7: 'Cheque'
        };
        return paymentMethods[paymentId] || `Payment Method ${paymentId}`;
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    trackByPaymentId(index: number, payment: Payment): number {
        return payment.id;
    }
}
