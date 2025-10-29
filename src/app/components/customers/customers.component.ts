import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

interface Customer {
    id: number;
    name: string;
    phone?: string;
    address?: string;
    email?: string;
    alt_phone?: string;
    created_at?: string;
    user_id?: number;
    branch_id?: number;
    gst?: string;
    dob?: string;
    gender?: string;
    gender_id?: number;
    is_bulk_upload?: number;
    pincode?: string;
    run_id?: string;
    updated_at?: string;
}

interface CustomerResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Customer[];
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

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit, OnDestroy {
    customers: Customer[] = [];
    filteredCustomers: Customer[] = [];
    searchTerm: string = '';
    loading = true;
    error: string | null = null;

    // Pagination properties
    currentPage: number = 1;
    totalPages: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;

    // Search timeout for debouncing
    searchTimeout: any;

    // Expose Math to template
    readonly Math = Math;

    constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.loadCustomers();
    }

    ngOnDestroy() {
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    loadCustomers(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();

        // Build filters
        const params: any = { page };

        // Add search filter if exists
        if (this.searchTerm.trim()) {
            params.search = this.searchTerm.trim();
        }

        this.http.get<CustomerResponse>(`${environment.apiBase}/customers`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Customers API Response:', response);

                    if (response.success && response.data) {
                        this.customers = response.data.data;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;
                    } else {
                        this.error = response.message || 'Failed to load customers';
                        this.customers = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading customers:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view customers.';
                    } else if (err.status === 404) {
                        this.error = 'Customers endpoint not found. Please check your configuration.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load customers. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    onSearch() {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search for 300ms
        this.searchTimeout = setTimeout(() => {
            this.loadCustomers(1); // Reset to first page when searching
        }, 300);
    }

    clearSearch() {
        this.searchTerm = '';
        this.loadCustomers(1);
    }

    refreshCustomers() {
        this.loadCustomers(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/pos']);
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.loadCustomers(page);
        }
    }

    goToFirstPage() {
        this.goToPage(1);
    }

    goToLastPage() {
        this.goToPage(this.totalPages);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    }

    previousPage() {
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

    getStartIndex(): number {
        return (this.currentPage - 1) * this.itemsPerPage + 1;
    }

    getEndIndex(): number {
        return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
    }
}