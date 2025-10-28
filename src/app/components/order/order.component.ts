import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService, Order, OrderDetail, OrderPaymentDetail, OrderDetailResponse } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-order',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit, OnDestroy {
    orders: Order[] = [];
    loading = false;
    error: string | null = null;

    // Pagination properties
    currentPage: number = 1;
    totalPages: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;

    // Search and filter
    searchTerm: string = '';
    searchTimeout: any;

    // Order detail view
    showOrderDetail = false;
    selectedOrder: Order | null = null;
    orderDetails: OrderDetail[] = [];
    orderPaymentDetails: OrderPaymentDetail[] = [];
    loadingOrderDetail = false;

    // Expose Math and parseFloat to template
    readonly Math = Math;
    readonly parseFloat = parseFloat;

    private subs: Subscription = new Subscription();

    constructor(
        private orderService: OrderService,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.fetchOrders();
    }

    ngOnDestroy(): void {
        this.subs.unsubscribe();
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    fetchOrders(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        // Check if user is authenticated
        if (!this.auth.isLoggedIn()) {
            this.error = 'You are not authenticated. Please log in.';
            this.loading = false;
            return;
        }

        // Build filters
        const filters: any = { page };

        // Add search filter if exists
        if (this.searchTerm.trim()) {
            filters.search = this.searchTerm.trim();
        }

        const sub = this.orderService.list(filters).subscribe({
            next: (response) => {
                console.log('Orders API Response:', response);

                if (response.success && response.data) {
                    this.orders = response.data.data;
                    this.currentPage = response.data.current_page;
                    this.totalPages = response.data.last_page;
                    this.itemsPerPage = response.data.per_page;
                    this.totalItems = response.data.total;
                } else {
                    this.error = response.message || 'Failed to load orders';
                    this.orders = [];
                }

                this.loading = false;
            },
            error: (err) => {
                console.error('Order fetch error:', err);
                if (err.status === 401) {
                    this.error = 'Unauthenticated. Please log in again.';
                    this.auth.clearSession();
                } else if (err.status === 403) {
                    this.error = 'Access denied. You do not have permission to view orders.';
                } else if (err.status === 404) {
                    this.error = 'Orders endpoint not found. Please check your configuration.';
                } else {
                    this.error = err?.error?.message || 'Failed to load orders. Please try again.';
                }
                this.loading = false;
            }
        });

        this.subs.add(sub);
    }

    onSearch() {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search for 300ms
        this.searchTimeout = setTimeout(() => {
            this.fetchOrders(1); // Reset to first page when searching
        }, 300);
    }

    clearSearch() {
        this.searchTerm = '';
        this.fetchOrders(1);
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.fetchOrders(page);
        }
    }

    goToFirstPage() {
        this.goToPage(1);
    }

    goToLastPage() {
        this.goToPage(this.totalPages);
    }

    goToNextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    goToPreviousPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    }

    getPageNumbers(): number[] {
        const pages: number[] = [];
        const maxPagesToShow = 5;
        const halfRange = Math.floor(maxPagesToShow / 2);

        let startPage = Math.max(1, this.currentPage - halfRange);
        let endPage = Math.min(this.totalPages, this.currentPage + halfRange);

        // Adjust range if we're near the beginning or end
        if (endPage - startPage + 1 < maxPagesToShow) {
            if (startPage === 1) {
                endPage = Math.min(this.totalPages, startPage + maxPagesToShow - 1);
            } else if (endPage === this.totalPages) {
                startPage = Math.max(1, endPage - maxPagesToShow + 1);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        return pages;
    }

    // Order detail methods
    viewOrderDetail(order: Order) {
        this.selectedOrder = order;
        this.loadingOrderDetail = true;
        this.showOrderDetail = true;
        this.orderDetails = [];
        this.orderPaymentDetails = [];

        const sub = this.orderService.getOrderDetail(order.id).subscribe({
            next: (response: OrderDetailResponse) => {
                console.log('Order Detail Response:', response);

                if (response.success && response.data) {
                    this.orderDetails = response.data.order_details;
                    this.orderPaymentDetails = response.data.order_payment_details;
                } else {
                    this.error = response.message || 'Failed to load order details';
                }

                this.loadingOrderDetail = false;
            },
            error: (err) => {
                console.error('Order detail fetch error:', err);
                this.error = err?.error?.message || 'Failed to load order details. Please try again.';
                this.loadingOrderDetail = false;
            }
        });

        this.subs.add(sub);
    }

    closeOrderDetail() {
        this.showOrderDetail = false;
        this.selectedOrder = null;
        this.orderDetails = [];
        this.orderPaymentDetails = [];
    }

    goBack() {
        this.closeOrderDetail();
    }

    // Utility methods for template
    formatCurrency(amount: string | number): string {
        return this.orderService.formatCurrency(amount);
    }

    formatDate(dateString: string): string {
        return this.orderService.formatDate(dateString);
    }

    getOrderStatus(isRefunded: number): string {
        return this.orderService.getOrderStatus(isRefunded);
    }

    getOrderStatusClass(isRefunded: number): string {
        return this.orderService.getOrderStatusClass(isRefunded);
    }

    calculateOrderTotal(): number {
        return this.orderDetails.reduce((total, detail) => {
            return total + (parseFloat(detail.selling_price) * parseFloat(detail.quantity));
        }, 0);
    }

    calculateTotalTax(): number {
        return this.orderDetails.reduce((total, detail) => {
            return total + parseFloat(detail.tax_amount);
        }, 0);
    }
}
