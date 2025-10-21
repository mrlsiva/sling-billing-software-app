import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
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

    constructor(
        public cart: CartService,
        private auth: AuthService,
        private router: Router,
        private http: HttpClient,
        private toast: ToastService
    ) {
        this.cart.cart$.subscribe(i => this.items = i || []);

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
        });
    }

    ngOnInit() {
        this.loadStaff();
        this.loadDefaultCustomers();
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

        // Validate that cart has items
        if (!this.items || this.items.length === 0) {
            this.toast.show('Cannot generate PDF for empty cart', 'error');
            return;
        }

        // All validations passed, generate PDF
        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            this.toast.show('Unable to open print window. Please check popup settings.', 'error');
            return;
        }

        const html = this.buildInvoiceHtml();
        printWindow.document.write(html);
        printWindow.document.close();
        // wait for content to load then print
        printWindow.onload = function () { printWindow.focus(); printWindow.print(); };

        // Show success message
        this.toast.show('PDF generated successfully', 'success');
    }

    private buildInvoiceHtml(): string {
        const itemsHtml = this.items.map(i => `<tr><td>${i.product?.name || i.product?.title || i.id}</td><td>${i.qty}</td><td>${Number(i.product?.price || 0).toFixed(2)}</td><td>${(Number(i.product?.price || 0) * i.qty).toFixed(2)}</td></tr>`).join('');
        const total = this.cart.totalPrice().toFixed(2);
        const staffName = this.selectedStaff?.name || '-';
        const customerName = this.selectedCustomer?.name || '-';
        return `
            <html>
            <head>
              <title>Invoice</title>
              <style>
                body{font-family: Arial, Helvetica, sans-serif;padding:20px}
                table{width:100%;border-collapse:collapse}
                th,td{padding:8px;border:1px solid #ddd}
                .right{text-align:right}
              </style>
            </head>
            <body>
              <h2>Invoice</h2>
              <p><strong>Staff:</strong> ${staffName} &nbsp; <strong>Customer:</strong> ${customerName}</p>
              <table>
                <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Total</th></tr></thead>
                <tbody>${itemsHtml}</tbody>
                <tfoot><tr><td colspan="3" class="right">Total</td><td>${total}</td></tr></tfoot>
              </table>
            </body>
            </html>
        `;
    }
}
