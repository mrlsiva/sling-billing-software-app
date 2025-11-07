import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

interface Tax {
    id: number;
    shop_id: number;
    name: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface TaxResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Tax[];
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
    selector: 'app-tax',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './tax.component.html',
    styleUrl: './tax.component.scss'
})
export class TaxComponent implements OnInit, OnDestroy {
    taxes: Tax[] = [];
    filteredTaxes: Tax[] = [];
    loading = true;
    error: string | null = null;

    // Search properties
    searchTerm: string = '';

    // Pagination properties
    currentPage: number = 1;
    totalPages: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;

    // Modal properties
    showModal: boolean = false;
    isEditMode: boolean = false;
    modalTitle: string = '';

    // Form properties
    taxName: string | number = '';
    taxId: number | null = null;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadTaxes();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadTaxes(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<TaxResponse>(`${environment.apiBase}/taxes/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Taxes API Response:', response);

                    if (response.success && response.data) {
                        this.taxes = response.data.data;
                        this.filteredTaxes = this.taxes;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterTaxes();
                        }
                    } else {
                        this.error = response.message || 'Failed to load taxes';
                        this.taxes = [];
                        this.filteredTaxes = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading taxes:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view taxes.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load taxes. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    // Modal methods
    openCreateModal() {
        console.log('Opening create modal');
        this.isEditMode = false;
        this.modalTitle = 'Create Tax';
        this.taxName = '';
        this.taxId = null;
        this.error = null;
        this.showModal = true;
        console.log('Create modal opened, showModal:', this.showModal);
    }

    openEditModal(tax: Tax) {
        console.log('Opening edit modal for tax:', tax);
        this.isEditMode = true;
        this.modalTitle = 'Edit Tax';
        this.taxName = tax.name;
        this.taxId = tax.id;
        this.error = null;
        this.showModal = true;
        console.log('Edit modal opened, showModal:', this.showModal);
    }

    closeModal() {
        console.log('Closing modal');
        this.showModal = false;
        this.taxName = '';
        this.taxId = null;
        this.error = null;
        console.log('Modal closed');
    }

    submitForm() {
        const taxNameStr = String(this.taxName || '').trim();
        if (!taxNameStr) {
            this.error = 'Tax percentage is required';
            return;
        }

        const taxValue = parseFloat(taxNameStr);
        if (isNaN(taxValue) || taxValue < 0 || taxValue > 100) {
            this.error = 'Tax percentage must be between 0 and 100';
            return;
        }

        if (this.isEditMode) {
            this.updateTax();
        } else {
            this.createTax();
        }
    }

    createTax() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('name', String(this.taxName || '').trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/taxes/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Create Tax Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadTaxes(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create tax';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating tax:', err);
                    this.error = err?.error?.message || 'Failed to create tax. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateTax() {
        if (!this.taxId) {
            this.error = 'Tax ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('tax_id', this.taxId.toString());
        formData.append('name', String(this.taxName || '').trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/taxes/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Update Tax Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadTaxes(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update tax';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating tax:', err);
                    this.error = err?.error?.message || 'Failed to update tax. Please try again.';
                    this.loading = false;
                }
            });
    }

    async toggleTaxStatus(taxId: number, currentStatus: number) {
        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<any>(
                `${environment.apiBase}/taxes/${taxId}/status`,
                { headers }
            ).toPromise();

            if (response?.success) {
                // Update the tax status in the local array
                const taxIndex = this.taxes.findIndex(tax => tax.id === taxId);
                if (taxIndex !== -1) {
                    this.taxes[taxIndex].is_active = this.taxes[taxIndex].is_active === 1 ? 0 : 1;
                    this.filterTaxes(); // Refresh filtered taxes
                }

                console.log('Status updated:', response.message);
            } else {
                this.error = response?.message || 'Failed to update tax status';
            }
        } catch (err: any) {
            console.error('Error updating tax status:', err);
            this.error = err?.error?.message || 'Failed to update tax status';
        }
    }

    refreshTaxes() {
        this.loadTaxes(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Search functionality
    onSearchChange() {
        this.filterTaxes();
    }

    filterTaxes() {
        if (!this.searchTerm.trim()) {
            this.filteredTaxes = this.taxes;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredTaxes = this.taxes.filter(tax =>
                tax.name.toLowerCase().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredTaxes = this.taxes;
    }

    getStatusText(isActive: number): string {
        return isActive === 1 ? 'Active' : 'Inactive';
    }

    getStatusClass(isActive: number): string {
        return isActive === 1 ? 'status-active' : 'status-inactive';
    }

    formatDate(dateString: string): string {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }
}