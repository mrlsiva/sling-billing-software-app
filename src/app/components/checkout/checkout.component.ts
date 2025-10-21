import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { PdfGeneratorComponent, InvoiceData } from '../pdf-generator/pdf-generator.component';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-checkout',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
    items: any[] = [];
    staffList: any[] = [];
    customerList: any[] = [];
    searchedCustomers: any[] = [];
    selectedStaff: any = null;
    selectedCustomer: any = null;
    loading = false;
    user: any = null;

    // Customer search properties
    customerSearchTerm: string = '';
    customerSearchLoading: boolean = false;
    showCustomerDropdown: boolean = false;
    searchTimeout: any;

    // Staff search properties
    staffSearchTerm: string = '';
    staffSearchLoading: boolean = false;
    showStaffDropdown: boolean = false;
    searchedStaff: any[] = [];
    staffSearchTimeout: any;

    // Payment methods properties
    paymentMethods: any[] = [];
    selectedPayments: any[] = [];
    paymentSearchTerm: string = '';
    paymentSearchLoading: boolean = false;
    showPaymentDropdown: boolean = false;
    searchedPaymentMethods: any[] = [];
    paymentSearchTimeout: any;

    // Finance options properties
    financeOptions: any[] = [];
    financeLoading: boolean = false;

    constructor(
        public cart: CartService,
        private auth: AuthService,
        private router: Router,
        private http: HttpClient,
        private toast: ToastService,
        private pdfGenerator: PdfGeneratorComponent
    ) {
        this.cart.cart$.subscribe(i => this.items = i || []);

        // Subscribe to user data for shop information
        this.auth.user$.subscribe(u => this.user = u);

        // No default customer or staff selected
        this.selectedCustomer = null;
        this.selectedStaff = null;

        // Close dropdowns when clicking outside
        document.addEventListener('click', (e) => {
            if (!(e.target as Element)?.closest('.customer-search-container')) {
                this.showCustomerDropdown = false;
            }
            if (!(e.target as Element)?.closest('.staff-search-container')) {
                this.showStaffDropdown = false;
            }
            if (!(e.target as Element)?.closest('.payment-methods-container')) {
                this.showPaymentDropdown = false;
            }
        });
    }

    ngOnInit() {
        this.loadStaff();
        this.loadDefaultCustomers();
        this.loadPaymentMethods();
        this.loadFinanceOptions();
    }

    loadDefaultCustomers() {
        // Load customers from API for immediate selection
        const headers = this.auth.authHeaders();
        const url = `${environment.apiBase}/pos/customer`;

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                // Handle the API response structure properly
                let customers = [];
                if (response.data) {
                    customers = Array.isArray(response.data) ? response.data : [response.data];
                } else {
                    customers = Array.isArray(response) ? response : [];
                }

                // Show only real customers from API
                this.searchedCustomers = customers.slice(0, 5); // Show first 5 customers
            },
            error: (error) => {
                console.error('Failed to load default customers:', error);
                // No fallback customers if API fails
                this.searchedCustomers = [];
            }
        });
    }

    loadStaff() {
        this.loading = true;
        const url = `${environment.apiBase.replace(/\/$/, '')}/staff`;
        const headers = this.auth.authHeaders();

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                this.staffList = response?.data ?? response ?? [];
                // Show first 5 staff members for initial display
                this.searchedStaff = this.staffList.slice(0, 5);
                this.loading = false;
            },
            error: (error) => {
                console.error('Failed to load staff:', error);
                // Fallback to static data if API fails
                this.staffList = [
                    { id: 1, name: 'Default Staff', email: 'staff@example.com' }
                ];
                this.searchedStaff = this.staffList.slice(0, 5);
                this.loading = false;
            }
        });
    }

    back() { this.router.navigate(['/pos']); }

    clearCart() { this.cart.clear(); }

    // Customer search methods
    onCustomerSearch() {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search for 300ms
        this.searchTimeout = setTimeout(() => {
            if (this.customerSearchTerm.trim()) {
                this.searchCustomers();
            } else {
                this.loadDefaultCustomers();
            }
        }, 300);
    }

    searchCustomers() {
        const searchTerm = this.customerSearchTerm.trim();
        if (!searchTerm) return;

        this.customerSearchLoading = true;
        const headers = this.auth.authHeaders();

        // Use the correct API endpoint
        const url = `${environment.apiBase}/pos/customer`;

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                // Handle the API response structure properly
                let customers = [];
                if (response.data) {
                    customers = Array.isArray(response.data) ? response.data : [response.data];
                } else {
                    customers = Array.isArray(response) ? response : [];
                }

                // Filter customers by search term (name or phone)
                this.searchedCustomers = customers.filter((customer: any) => {
                    const searchLower = searchTerm.toLowerCase();
                    return customer.name?.toLowerCase().includes(searchLower) ||
                        customer.phone?.includes(searchTerm);
                });

                this.customerSearchLoading = false;
            },
            error: (error) => {
                console.error('Failed to search customers:', error);
                this.searchedCustomers = [];
                this.customerSearchLoading = false;
            }
        });
    }

    selectCustomer(customer: any) {
        this.selectedCustomer = customer;
        this.customerSearchTerm = '';
        this.showCustomerDropdown = false;
    }

    clearSelectedCustomer() {
        this.selectedCustomer = null;
        this.customerSearchTerm = '';
    }

    clearCustomerSearch() {
        this.customerSearchTerm = '';
        this.loadDefaultCustomers();
    }

    // Staff search methods
    onStaffSearch() {
        // Clear previous timeout
        if (this.staffSearchTimeout) {
            clearTimeout(this.staffSearchTimeout);
        }

        // Debounce search for 300ms
        this.staffSearchTimeout = setTimeout(() => {
            if (this.staffSearchTerm.trim()) {
                this.searchStaff();
            } else {
                this.searchedStaff = this.staffList.slice(0, 5);
            }
        }, 300);
    }

    searchStaff() {
        const searchTerm = this.staffSearchTerm.trim();
        if (!searchTerm) return;

        this.staffSearchLoading = true;

        // Filter staff by search term (name or email)
        this.searchedStaff = this.staffList.filter((staff: any) => {
            const searchLower = searchTerm.toLowerCase();
            return staff.name?.toLowerCase().includes(searchLower) ||
                staff.full_name?.toLowerCase().includes(searchLower) ||
                staff.email?.toLowerCase().includes(searchLower);
        });

        this.staffSearchLoading = false;
    }

    selectStaff(staff: any) {
        this.selectedStaff = staff;
        this.staffSearchTerm = '';
        this.showStaffDropdown = false;
    }

    clearSelectedStaff() {
        this.selectedStaff = null;
        this.staffSearchTerm = '';
    }

    clearStaffSearch() {
        this.staffSearchTerm = '';
        this.searchedStaff = this.staffList.slice(0, 5);
    }

    // Payment methods methods
    loadPaymentMethods() {
        this.paymentSearchLoading = true;
        const headers = this.auth.authHeaders();
        const url = `${environment.apiBase}/payment_list`;

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                // Handle the API response structure properly
                let methods = [];
                if (response.data) {
                    methods = Array.isArray(response.data) ? response.data : [response.data];
                } else {
                    methods = Array.isArray(response) ? response : [];
                }

                this.paymentMethods = methods;
                // Show first 5 payment methods for initial display
                this.searchedPaymentMethods = this.paymentMethods.slice(0, 5);
                this.paymentSearchLoading = false;
            },
            error: (error) => {
                console.error('Failed to load payment methods:', error);
                // Fallback to static data if API fails
                this.paymentMethods = [
                    { id: 1, name: 'Cash', description: 'Cash payment' },
                    { id: 2, name: 'Finance', description: 'Card/Finance payment' },
                    { id: 3, name: 'Card', description: 'Credit/Debit card payment' },
                    { id: 4, name: 'Cheque', description: 'Cheque payment' }
                ];
                this.searchedPaymentMethods = this.paymentMethods.slice(0, 5);
                this.paymentSearchLoading = false;
            }
        });
    }

    loadFinanceOptions() {
        this.financeLoading = true;
        const headers = this.auth.authHeaders();
        const url = `${environment.apiBase}/finance`;

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                // Handle the API response structure properly
                let options = [];
                if (response.data) {
                    options = Array.isArray(response.data) ? response.data : [response.data];
                } else {
                    options = Array.isArray(response) ? response : [];
                }

                this.financeOptions = options;
                this.financeLoading = false;
            },
            error: (error) => {
                console.error('Failed to load finance options:', error);
                // Fallback to static data if API fails
                this.financeOptions = [
                    { id: 1, name: 'Bank Transfer', description: 'Bank transfer finance' },
                    { id: 2, name: 'Credit Line', description: 'Credit line finance' },
                    { id: 3, name: 'Installment', description: 'Installment finance' }
                ];
                this.financeLoading = false;
            }
        });
    }

    onPaymentSearch() {
        // Clear previous timeout
        if (this.paymentSearchTimeout) {
            clearTimeout(this.paymentSearchTimeout);
        }

        // Debounce search for 300ms
        this.paymentSearchTimeout = setTimeout(() => {
            if (this.paymentSearchTerm.trim()) {
                this.searchPaymentMethods();
            } else {
                this.searchedPaymentMethods = this.paymentMethods.slice(0, 5);
            }
        }, 300);
    }

    searchPaymentMethods() {
        const searchTerm = this.paymentSearchTerm.trim();
        if (!searchTerm) return;

        this.paymentSearchLoading = true;

        // Filter payment methods by search term (name or description)
        this.searchedPaymentMethods = this.paymentMethods.filter((method: any) => {
            const searchLower = searchTerm.toLowerCase();
            return method.name?.toLowerCase().includes(searchLower) ||
                method.description?.toLowerCase().includes(searchLower);
        });

        this.paymentSearchLoading = false;
    }

    addPaymentMethod(method: any) {
        // Check if method already exists
        const exists = this.selectedPayments.find(p => p.method.id === method.id);
        if (exists) {
            this.toast.show('Payment method already added', 'error');
            return;
        }

        // Add new payment method
        const newPayment = {
            method: method,
            amount: null,
            cardNo: '',
            cardName: '',
            chequeNo: '',
            financeRefNo: '',
            selectedFinance: null,
            useRemainingAmount: false
        };

        this.selectedPayments.push(newPayment);
        this.paymentSearchTerm = '';
        this.showPaymentDropdown = false;
    }

    removePaymentMethod(index: number) {
        this.selectedPayments.splice(index, 1);
    }

    updatePaymentAmount(index: number) {
        // Ensure amount is valid
        if (this.selectedPayments[index].amount == null || this.selectedPayments[index].amount < 0) {
            this.selectedPayments[index].amount = 0;
        }

        // Check if total paid amount exceeds bill amount
        const totalBill = this.cart.totalPrice();
        const totalPaid = this.getTotalPaidAmount();

        if (totalPaid > totalBill) {
            this.toast.show('you enter exceed amount', 'error');
            // Reset the current payment amount to prevent exceeding
            const excessAmount = totalPaid - totalBill;
            this.selectedPayments[index].amount = Math.max(0, (this.selectedPayments[index].amount || 0) - excessAmount);
        }
    }

    clearPaymentSearch() {
        this.paymentSearchTerm = '';
        this.searchedPaymentMethods = this.paymentMethods.slice(0, 5);
    }

    getRemainingAmount(): number {
        const totalBill = this.cart.totalPrice();
        const paidAmount = this.selectedPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
        return Math.max(0, totalBill - paidAmount);
    }

    getTotalPaidAmount(): number {
        return this.selectedPayments.reduce((sum, payment) => sum + (Number(payment.amount) || 0), 0);
    }

    toggleRemainingAmount(index: number) {
        const payment = this.selectedPayments[index];

        if (payment.useRemainingAmount) {
            // Calculate remaining amount before this payment
            const remainingAmount = this.getRemainingAmount() + (Number(payment.amount) || 0);

            if (remainingAmount <= 0) {
                // Remove payment method if remaining amount is 0 or less
                this.removePaymentMethod(index);
                this.toast.show('Payment method removed - no remaining amount', 'info');
                return;
            }

            payment.amount = remainingAmount;
            this.updatePaymentAmount(index);
        } else {
            // Clear the amount when unchecked
            payment.amount = null;
        }
    }

    generatePdf() {
        console.log('Generate PDF clicked. Selected customer:', this.selectedCustomer);
        // Validate that both customer and staff are selected
        if (!this.selectedCustomer) {
            console.log('No customer selected, showing toast');
            this.toast.show('u didnot select customer', 'error');
            return;
        }

        if (!this.selectedStaff) {
            console.log('No staff selected, showing toast');
            this.toast.show('u didnot select staff', 'error');
            return;
        }

        // Validate payment methods
        if (!this.selectedPayments || this.selectedPayments.length === 0) {
            this.toast.show('u didnot select payment method', 'error');
            return;
        }

        // Validate payment amounts
        const totalBill = this.cart.totalPrice();
        const totalPaid = this.getTotalPaidAmount();

        if (totalPaid < totalBill) {
            this.toast.show(`Payment incomplete. Remaining amount: ${(totalBill - totalPaid).toFixed(2)}`, 'error');
            return;
        }

        // Validate payment method specific fields
        for (let payment of this.selectedPayments) {
            if (!payment.amount || payment.amount <= 0) {
                this.toast.show(`Please enter valid amount for ${payment.method.name}`, 'error');
                return;
            }

            // Validate payment method specific fields
            const methodName = payment.method.name.toLowerCase();

            if (methodName === 'finance') {
                if (!payment.financeRefNo || !payment.selectedFinance) {
                    this.toast.show('Please enter finance reference number and select finance option', 'error');
                    return;
                }
            }

            if (methodName === 'card') {
                if (!payment.cardNo || !payment.cardName) {
                    this.toast.show('Please enter card number and card name for card payment', 'error');
                    return;
                }
            }

            if (methodName === 'cheque') {
                if (!payment.chequeNo) {
                    this.toast.show('Please enter cheque number for cheque payment', 'error');
                    return;
                }
            }
        }

        // Validate that cart has items
        if (!this.items || this.items.length === 0) {
            this.toast.show('Cannot generate PDF for empty cart', 'error');
            return;
        }

        // Prepare invoice data
        const invoiceData: InvoiceData = {
            customer: this.selectedCustomer,
            staff: this.selectedStaff,
            items: this.items,
            payments: this.selectedPayments,
            total: totalBill
        };

        // Generate PDF using the PDF generator service
        this.pdfGenerator.generateInvoicePdf(invoiceData);
    }
}
