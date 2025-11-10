// (Removed duplicate class and misplaced imports. The correct CheckoutComponent class with placeOrder() is below.)
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
        const url = `${environment.apiBase}/staffs`;
        const headers = this.auth.authHeaders();

        this.http.get<any>(url, { headers }).subscribe({
            next: (response) => {
                this.staffList = response?.data ?? response ?? [];
                // Show first 5 staff members for initial display
                this.searchedStaff = this.staffList.slice(0, 5);
                this.loading = false;
            },
            error: (error) => {
                // API endpoint not available, use fallback data
                this.staffList = [
                    { id: 1, name: 'Default Staff', email: 'staff@example.com' },
                    { id: 2, name: 'Store Manager', email: 'manager@example.com' },
                    { id: 3, name: 'Sales Associate', email: 'sales@example.com' }
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
        const url = `${environment.apiBase}/finances`;

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
                // API endpoint not available, use fallback data
                this.financeOptions = [
                    { id: 1, name: 'Bank Transfer', description: 'Bank transfer finance' },
                    { id: 2, name: 'Credit Line', description: 'Credit line finance' },
                    { id: 3, name: 'Installment', description: 'Installment finance' },
                    { id: 4, name: 'EMI', description: 'Monthly installment' }
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

    /**
     * Combined method to place order and generate PDF
     */
    placeOrderAndGeneratePdf(): void {
        // Validate all required fields first
        if (!this.validateOrderData()) {
            return;
        }

        // Generate PDF first
        this.generatePdfSilently();

        // Then place the order
        this.placeOrder();
    }

    /**
     * Validate all order data before placing order or generating PDF
     */
    private validateOrderData(): boolean {
        // Validate staff selection
        if (!this.selectedStaff) {
            this.toast.show('Please select staff', 'error');
            return false;
        }

        // Validate customer selection
        if (!this.selectedCustomer) {
            this.toast.show('Please select customer', 'error');
            return false;
        }

        // Validate cart items
        if (!this.items || this.items.length === 0) {
            this.toast.show('Cart is empty', 'error');
            return false;
        }

        // Validate payment methods
        if (!this.selectedPayments || this.selectedPayments.length === 0) {
            this.toast.show('Please select payment methods', 'error');
            return false;
        }

        // Validate payment amounts
        const totalBill = this.cart.totalPrice();
        const totalPaid = this.getTotalPaidAmount();

        if (totalPaid < totalBill) {
            this.toast.show(`Payment incomplete. Remaining amount: ${(totalBill - totalPaid).toFixed(2)}`, 'error');
            return false;
        }

        // Validate payment method specific fields
        for (let payment of this.selectedPayments) {
            if (!payment.amount || payment.amount <= 0) {
                this.toast.show(`Please enter valid amount for ${payment.method.name}`, 'error');
                return false;
            }

            // Validate payment method specific fields
            const methodName = payment.method.name.toLowerCase();

            if (methodName === 'finance') {
                if (!payment.financeRefNo || !payment.selectedFinance) {
                    this.toast.show('Please enter finance reference number and select finance option', 'error');
                    return false;
                }
            }

            if (methodName === 'card') {
                if (!payment.cardNo || !payment.cardName) {
                    this.toast.show('Please enter card number and card name for card payment', 'error');
                    return false;
                }
            }

            if (methodName === 'cheque') {
                if (!payment.chequeNo) {
                    this.toast.show('Please enter cheque number for cheque payment', 'error');
                    return false;
                }
            }
        }

        return true;
    }

    /**
     * Generate PDF without showing validation toasts (internal use)
     */
    private generatePdfSilently(): void {
        try {
            // Prepare invoice data
            const invoiceData: InvoiceData = {
                customer: this.selectedCustomer,
                staff: this.selectedStaff,
                items: this.items,
                payments: this.selectedPayments,
                total: this.cart.totalPrice()
            };

            // Generate PDF using the PDF generator service
            this.pdfGenerator.generateInvoicePdf(invoiceData);
        } catch (error) {
            console.error('PDF generation failed:', error);
            // Don't show error toast for PDF generation failure
        }
    }

    /**
     * Build and send the order payload to /api/pos/store
     */
    placeOrder(): void {
        // Validate data if called separately
        if (!this.validateOrderData()) {
            return;
        }

        // Build cart array (robust extraction to match API expectations)
        const cart = this.items.map((it: any) => {
            // product may exist in multiple shapes: it.product, it.product.product, or top-level fields
            const prod = it.product || {};
            const nested = prod.product || {};

            const productId = prod.product_id || nested.product_id || nested.id || prod.id || it.product_id || it.id || '';
            const qty = Number(it.qty) || Number(it.quantity) || 0;

            // Price may be at several places; ensure a numeric value is sent
            const priceVal = prod.price ?? nested.price ?? prod.selling_price ?? nested.selling_price ?? it.price ?? 0;
            const price = Number(priceVal) || 0;

            // Tax amount may be present on product or item
            const taxVal = prod.tax_amount ?? nested.tax_amount ?? prod.tax_amount ?? it.tax_amount ?? 0;
            const tax_amount = Number(taxVal) || 0;

            return {
                product_id: Number(productId) || productId,
                qty,
                price,
                tax_amount
            };
        });

        // Build payments array
        const payments = this.selectedPayments.map((p: any) => {
            let extra: any = {};
            const method = p.method.name;
            if (method.toLowerCase() === 'card') {
                extra = { card_name: p.cardName, card_number: p.cardNo };
            } else if (method.toLowerCase() === 'cheque') {
                extra = { cheque_number: p.chequeNo };
            } else if (method.toLowerCase() === 'finance') {
                extra = { finance_ref_no: p.financeRefNo, finance: p.selectedFinance };
            }
            return {
                method,
                amount: Number(p.amount) || 0,
                extra
            };
        });

        // Build customer object (copy only required fields)
        const c: any = this.selectedCustomer;
        const customer = {
            phone: c.phone || '',
            alt_phone: c.alt_phone || '',
            name: c.name || '',
            address: c.address || '',
            pincode: c.pincode || '',
            gender: c.gender || '',
            dob: c.dob || '',
            gst: c.gst || ''
        };

        // Build payload
        const payload = {
            billed_by: this.selectedStaff.id,
            customer,
            cart,
            payments
        };

        // Debug: log the payload so we can compare with the working Postman request
        console.log('Order payload prepared for POST /pos/store:', payload);

        const headers = this.auth.authHeaders();
        const url = `${environment.apiBase}/pos/store`;
        this.loading = true;
        this.http.post<any>(url, payload, { headers }).subscribe({
            next: (response: any) => {
                console.log('Order placement response:', response);
                this.loading = false;
                this.toast.show('Order placed successfully!', 'success');

                // Extract order ID from response
                if (response?.success && response?.data) {
                    const orderId = response.data;
                    console.log('Order ID received:', orderId);

                    // Fetch order details and generate PDF
                    this.fetchOrderDetailsAndGeneratePDF(orderId);
                } else {
                    console.warn('Order ID not found in response:', response);
                }

                // Clear cart and navigate back
                this.cart.clear();
                setTimeout(() => this.router.navigate(['/pos']), 3000); // Increased delay to allow PDF generation
            },
            error: (err: any) => {
                this.loading = false;
                this.toast.show('Order failed: ' + (err?.error?.message || err.statusText || 'Unknown error'), 'error');
            }
        });
    }

    /**
     * Fetch order details and generate PDF based on actual order data
     */
    private fetchOrderDetailsAndGeneratePDF(orderId: number): void {
        console.log('Fetching order details for ID:', orderId);

        const headers = this.auth.authHeaders();
        const url = `${environment.apiBase}/orders/${orderId}/view`;

        this.http.get<any>(url, { headers }).subscribe({
            next: (response: any) => {
                console.log('Order details response:', response);

                if (response?.success && response?.data) {
                    this.generatePDFFromOrderData(response.data);
                } else {
                    console.warn('Invalid order details response:', response);
                    this.toast.show('Order placed but PDF generation failed', 'error');
                }
            },
            error: (err: any) => {
                console.error('Failed to fetch order details:', err);
                this.toast.show('Order placed but failed to fetch details for PDF', 'error');
            }
        });
    }

    /**
     * Generate PDF from actual order data received from API
     */
    private generatePDFFromOrderData(orderData: any): void {
        console.log('Generating PDF from order data:', orderData);

        try {
            // Extract order information
            const order = orderData.order;
            const orderDetails = orderData.order_details || [];
            const paymentDetails = orderData.order_payment_details || [];

            // Prepare invoice data using actual order data
            const invoiceData: InvoiceData = {
                // Order information
                orderId: order.id,
                billId: order.bill_id,
                billedOn: order.billed_on,
                billAmount: parseFloat(order.bill_amount),

                // Customer information
                customer: {
                    id: order.customer?.id,
                    name: order.customer?.name,
                    phone: order.customer?.phone,
                    alt_phone: order.customer?.alt_phone,
                    address: order.customer?.address,
                    pincode: order.customer?.pincode,
                    gst: order.customer?.gst
                },

                // Staff information (billed by)
                staff: {
                    id: order.billed_by?.id,
                    name: order.billed_by?.name,
                    phone: order.billed_by?.phone
                },

                // Shop/Branch information
                shop: {
                    name: order.shop?.name,
                    email: order.shop?.email,
                    phone: order.shop?.phone,
                    alt_phone: order.shop?.alt_phone,
                    logo: order.shop?.logo,
                    address: order.shop?.address || ''
                },

                branch: order.branch ? {
                    name: order.branch?.name,
                    email: order.branch?.email,
                    phone: order.branch?.phone,
                    alt_phone: order.branch?.alt_phone,
                    logo: order.branch?.logo,
                    address: order.branch?.address || ''
                } : null,

                // Items from order details
                items: orderDetails.map((item: any) => ({
                    id: item.product_id,
                    name: item.name,
                    quantity: parseFloat(item.quantity),
                    price: parseFloat(item.price),
                    selling_price: parseFloat(item.selling_price),
                    tax_amount: parseFloat(item.tax_amount),
                    tax_percent: parseFloat(item.tax_percent),
                    discount: item.discount ? parseFloat(item.discount) : 0,
                    discount_type: item.discount_type,
                    total: parseFloat(item.selling_price) * parseFloat(item.quantity)
                })),

                // Payments from order payment details
                payments: paymentDetails.map((payment: any) => ({
                    method: {
                        id: payment.payment?.id,
                        name: payment.payment?.name
                    },
                    amount: parseFloat(payment.amount),
                    cardNo: payment.card || '',
                    chequeNo: payment.number || '',
                    financeRefNo: payment.finance_id || '',
                    selectedFinance: payment.finance
                })),

                // Total amount
                total: parseFloat(order.bill_amount),

                // Additional order information
                totalProductDiscount: parseFloat(order.total_product_discount || '0'),
                isRefunded: order.is_refunded === 1
            };

            console.log('Prepared invoice data:', invoiceData);

            // Generate PDF using the PDF generator service
            this.pdfGenerator.generateInvoicePdf(invoiceData);

            this.toast.show('PDF generated successfully!', 'success');

        } catch (error) {
            console.error('PDF generation from order data failed:', error);
            this.toast.show('Failed to generate PDF from order data', 'error');
        }
    }

    /**
     * Helper method to get product name from cart item
     */
    getProductName(item: any): string {
        // Handle nested product structures similar to addToCart logic
        const product = item.product ?? item;
        const nested = product.product || {};

        // Try multiple possible locations for product name
        const productName = product?.name || nested?.name || product?.title || nested?.title ||
            product?.product_name || nested?.product_name || product?.code ||
            nested?.code || item.id || 'Unknown Product';

        return productName;
    }

    /**
     * Helper method to get product price from cart item
     */
    getProductPrice(item: any): number {
        // Handle nested product structures similar to cart service
        const product = item.product ?? item;
        const nested = product.product || {};

        // Try multiple possible locations for product price
        const priceVal = product.price ?? nested.price ?? product.selling_price ?? nested.selling_price ??
            product.amount ?? nested.amount ?? item.price ?? 0;
        return Number(priceVal) || 0;
    }
}
