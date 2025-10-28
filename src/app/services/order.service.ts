import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Order {
    id: number;
    shop_id: number;
    branch_id: number;
    bill_id: string;
    customer_id: number;
    total_product_discount: string;
    bill_amount: string;
    billed_on: string;
    billed_by: number;
    is_refunded: number;
    created_at: string;
    updated_at: string;
}

export interface OrderDetail {
    id: number;
    order_id: number;
    product_id: number;
    name: string;
    quantity: string;
    price: string;
    selling_price: string;
    tax_amount: string;
    tax_percent: string;
    discount_type: string | null;
    discount: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderPaymentDetail {
    id: number;
    order_id: number;
    payment_id: number;
    amount: string;
    number: string | null;
    card: string | null;
    finance_id: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderListResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Order[];
        first_page_url: string;
        from: number;
        last_page: number;
        last_page_url: string;
        links: Array<{
            url: string | null;
            label: string;
            active: boolean;
        }>;
        next_page_url: string | null;
        path: string;
        per_page: number;
        prev_page_url: string | null;
        to: number;
        total: number;
    };
}

export interface OrderDetailResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        order: Order;
        order_details: OrderDetail[];
        order_payment_details: OrderPaymentDetail[];
    };
}

@Injectable({
    providedIn: 'root'
})
export class OrderService {

    constructor(private http: HttpClient) { }

    /**
     * Get paginated list of orders
     * @param filters Optional filters for pagination and search
     * @returns Observable of OrderListResponse
     */
    list(filters?: any): Observable<OrderListResponse> {
        let params = new HttpParams();

        if (filters) {
            Object.keys(filters).forEach(key => {
                if (filters[key] !== null && filters[key] !== undefined && filters[key] !== '') {
                    params = params.set(key, String(filters[key]));
                }
            });
        }

        return this.http.get<OrderListResponse>(`${environment.apiBase}/orders`, { params });
    }

    /**
     * Get detailed information about a specific order
     * @param orderId The ID of the order to retrieve
     * @returns Observable of OrderDetailResponse
     */
    getOrderDetail(orderId: number): Observable<OrderDetailResponse> {
        return this.http.get<OrderDetailResponse>(`${environment.apiBase}/orders/${orderId}/view`);
    }

    /**
     * Format currency amount for display
     * @param amount Amount as string
     * @returns Formatted currency string
     */
    formatCurrency(amount: string | number): string {
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(num);
    }

    /**
     * Format date for display
     * @param dateString Date string from API
     * @returns Formatted date string
     */
    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }

    /**
     * Get order status text
     * @param isRefunded Whether order is refunded
     * @returns Status text
     */
    getOrderStatus(isRefunded: number): string {
        return isRefunded === 1 ? 'Refunded' : 'Completed';
    }

    /**
     * Get order status CSS class
     * @param isRefunded Whether order is refunded
     * @returns CSS class name
     */
    getOrderStatusClass(isRefunded: number): string {
        return isRefunded === 1 ? 'status-refunded' : 'status-completed';
    }
}