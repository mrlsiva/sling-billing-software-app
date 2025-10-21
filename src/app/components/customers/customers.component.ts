import { Component, OnInit } from '@angular/core';
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
    data: Customer | Customer[];
}

@Component({
    selector: 'app-customers',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './customers.component.html',
    styleUrl: './customers.component.scss'
})
export class CustomersComponent implements OnInit {
    customers: Customer[] = [];
    filteredCustomers: Customer[] = [];
    paginatedCustomers: Customer[] = [];
    searchTerm: string = '';
    loading = true;
    error: string | null = null;

    // Pagination properties
    currentPage: number = 1;
    itemsPerPage: number = 10;
    totalPages: number = 0;

    constructor(private http: HttpClient, private auth: AuthService, private router: Router) { }

    ngOnInit() {
        this.loadCustomers();
    }

    loadCustomers() {
        this.loading = true;
        this.error = null;

        const headers = this.auth.authHeaders();

        this.http.get<CustomerResponse>(`${environment.apiBase}/pos/customer`, { headers })
            .subscribe({
                next: (response) => {
                    // Handle different response structures
                    if (response.data) {
                        // If data is an array, use it directly
                        this.customers = Array.isArray(response.data) ? response.data : [response.data];
                    } else {
                        // Fallback for different API responses
                        this.customers = Array.isArray(response) ? response : [];
                    }
                    this.filterCustomers();
                    this.loading = false;
                },
                error: (err) => {
                    this.error = 'Failed to load customers';
                    this.loading = false;
                    console.error('Error loading customers:', err);
                }
            });
    }

    refreshCustomers() {
        this.loadCustomers();
    }

    goBack() {
        this.router.navigate(['/pos']);
    }

    filterCustomers() {
        if (!this.searchTerm.trim()) {
            this.filteredCustomers = [...this.customers];
        } else {
            const searchLower = this.searchTerm.toLowerCase().trim();
            this.filteredCustomers = this.customers.filter(customer =>
                customer.name?.toLowerCase().includes(searchLower) ||
                customer.phone?.toLowerCase().includes(searchLower)
            );
        }
        this.currentPage = 1; // Reset to first page when filtering
        this.updatePagination();
    }

    onSearchChange() {
        this.filterCustomers();
    }

    clearSearch() {
        this.searchTerm = '';
        this.filterCustomers();
    }

    // Pagination methods
    updatePagination() {
        this.totalPages = Math.ceil(this.filteredCustomers.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        this.paginatedCustomers = this.filteredCustomers.slice(startIndex, endIndex);
    }

    nextPage() {
        if (this.currentPage < this.totalPages) {
            this.currentPage++;
            this.updatePagination();
        }
    }

    previousPage() {
        if (this.currentPage > 1) {
            this.currentPage--;
            this.updatePagination();
        }
    }

    goToFirstPage() {
        this.currentPage = 1;
        this.updatePagination();
    }

    goToLastPage() {
        this.currentPage = this.totalPages;
        this.updatePagination();
    }

    getStartIndex(): number {
        return (this.currentPage - 1) * this.itemsPerPage;
    }

    getEndIndex(): number {
        const endIndex = this.currentPage * this.itemsPerPage;
        return Math.min(endIndex, this.filteredCustomers.length);
    }
}