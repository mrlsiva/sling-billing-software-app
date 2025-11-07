import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';
import { ToastService } from '../../../services/toast.service';

interface Finance {
    id: number;
    shop_id: number;
    name: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface FinanceResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Finance[];
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
    selector: 'app-finance',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './finance.component.html',
    styleUrl: './finance.component.scss'
})
export class FinanceComponent implements OnInit, OnDestroy {
    finances: Finance[] = [];
    filteredFinances: Finance[] = [];
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
    financeName: string = '';
    financeId: number | null = null;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router,
        private toast: ToastService
    ) { }

    // Math reference for template
    Math = Math;

    ngOnInit() {
        this.loadFinances();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadFinances(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<FinanceResponse>(`${environment.apiBase}/finances/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    // console.log('Finances API Response:', response);

                    if (response.success && response.data) {
                        this.finances = response.data.data;
                        this.filteredFinances = this.finances;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterFinances();
                        }
                    } else {
                        this.error = response.message || 'Failed to load finances';
                        this.finances = [];
                        this.filteredFinances = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    // console.error('Error loading finances:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view finances.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load finances. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    // Modal methods
    openCreateModal() {
        // console.log('Opening create modal');
        this.isEditMode = false;
        this.modalTitle = 'Create Finance';
        this.financeName = '';
        this.financeId = null;
        this.error = null;
        this.showModal = true;
        // console.log('Create modal opened, showModal:', this.showModal);
    }

    openEditModal(finance: Finance) {
        // console.log('Opening edit modal for finance:', finance);
        this.isEditMode = true;
        this.modalTitle = 'Edit Finance';
        this.financeName = finance.name;
        this.financeId = finance.id;
        this.error = null;
        this.showModal = true;
        // console.log('Edit modal opened, showModal:', this.showModal);
    }

    closeModal() {
        // console.log('Closing modal');
        this.showModal = false;
        this.financeName = '';
        this.financeId = null;
        this.error = null;
        // console.log('Modal closed');
    }

    submitForm() {
        const financeNameStr = String(this.financeName || '').trim();
        if (!financeNameStr) {
            this.error = 'Finance name is required';
            return;
        }

        if (this.isEditMode) {
            this.updateFinance();
        } else {
            this.createFinance();
        }
    }

    createFinance() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('name', String(this.financeName || '').trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/finances/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    // console.log('Create Finance Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadFinances(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create finance';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    // console.error('Error creating finance:', err);
                    this.error = err?.error?.message || 'Failed to create finance. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateFinance() {
        if (!this.financeId) {
            this.error = 'Finance ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('finance_id', this.financeId.toString());
        formData.append('name', String(this.financeName || '').trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/finances/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    // console.log('Update Finance Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadFinances(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update finance';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    // console.error('Error updating finance:', err);
                    this.error = err?.error?.message || 'Failed to update finance. Please try again.';
                    this.loading = false;
                }
            });
    }

    async toggleFinanceStatus(financeId: number, currentStatus: number) {
        // TODO: Backend endpoint /finances/{id}/status not implemented yet
        // Temporarily using local toggle until API is available

        try {
            // Update the finance status in the local array
            const financeIndex = this.finances.findIndex(finance => finance.id === financeId);
            if (financeIndex !== -1) {
                this.finances[financeIndex].is_active = this.finances[financeIndex].is_active === 1 ? 0 : 1;
                this.filterFinances(); // Refresh filtered finances

                const newStatus = this.finances[financeIndex].is_active === 1 ? 'Active' : 'Inactive';
                // console.log(`Finance ${this.finances[financeIndex].name} status changed to: ${newStatus}`);

                // Show success message
                this.toast.show(`${this.finances[financeIndex].name} set to ${newStatus}`, 'info');
            }
        } catch (err: any) {
            // console.error('Error updating finance status:', err);
            this.error = 'Failed to update finance status';
        }

        /* 
        // When backend implements /finances/{id}/status endpoint, use this code:
        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<any>(
                `${environment.apiBase}/finances/${financeId}/status`,
                { headers }
            ).toPromise();

            if (response?.success) {
                // Update the finance status in the local array
                const financeIndex = this.finances.findIndex(finance => finance.id === financeId);
                if (financeIndex !== -1) {
                    this.finances[financeIndex].is_active = this.finances[financeIndex].is_active === 1 ? 0 : 1;
                    this.filterFinances(); // Refresh filtered finances
                }

                console.log('Status updated:', response.message);
            } else {
                this.error = response?.message || 'Failed to update finance status';
            }
        } catch (err: any) {
            console.error('Error updating finance status:', err);
            this.error = err?.error?.message || 'Failed to update finance status';
        }
        */
    }

    refreshFinances() {
        this.loadFinances(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Search functionality
    onSearchChange() {
        this.filterFinances();
    }

    filterFinances() {
        if (!this.searchTerm.trim()) {
            this.filteredFinances = this.finances;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredFinances = this.finances.filter(finance =>
                finance.name.toLowerCase().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredFinances = this.finances;
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

    trackByFinanceId(index: number, finance: Finance): number {
        return finance.id;
    }
}
