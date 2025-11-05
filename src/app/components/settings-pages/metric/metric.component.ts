import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

interface Metric {
    id: number;
    shop_id: number;
    name: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface MetricResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Metric[];
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
    selector: 'app-metric',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './metric.component.html',
    styleUrl: './metric.component.scss'
})
export class MetricComponent implements OnInit, OnDestroy {
    metrics: Metric[] = [];
    filteredMetrics: Metric[] = [];
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
    metricName: string = '';
    metricId: number | null = null;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadMetrics();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadMetrics(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<MetricResponse>(`${environment.apiBase}/metrics/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Metrics API Response:', response);

                    if (response.success && response.data) {
                        this.metrics = response.data.data;
                        this.filteredMetrics = this.metrics;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterMetrics();
                        }
                    } else {
                        this.error = response.message || 'Failed to load metrics';
                        this.metrics = [];
                        this.filteredMetrics = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading metrics:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view metrics.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load metrics. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    // Modal methods
    openCreateModal() {
        this.isEditMode = false;
        this.modalTitle = 'Create Metric';
        this.metricName = '';
        this.metricId = null;
        this.showModal = true;
    }

    openEditModal(metric: Metric) {
        this.isEditMode = true;
        this.modalTitle = 'Edit Metric';
        this.metricName = metric.name;
        this.metricId = metric.id;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.metricName = '';
        this.metricId = null;
        this.error = null;
    }

    submitForm() {
        if (!this.metricName.trim()) {
            this.error = 'Metric name is required';
            return;
        }

        if (this.isEditMode) {
            this.updateMetric();
        } else {
            this.createMetric();
        }
    }

    createMetric() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('name', this.metricName.trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/metrics/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Create Metric Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadMetrics(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create metric';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating metric:', err);
                    this.error = err?.error?.message || 'Failed to create metric. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateMetric() {
        if (!this.metricId) {
            this.error = 'Metric ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('metric_id', this.metricId.toString());
        formData.append('name', this.metricName.trim());

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/metrics/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Update Metric Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadMetrics(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update metric';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating metric:', err);
                    this.error = err?.error?.message || 'Failed to update metric. Please try again.';
                    this.loading = false;
                }
            });
    }

    async toggleMetricStatus(metricId: number, currentStatus: number) {
        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<any>(
                `${environment.apiBase}/metrics/${metricId}/status`,
                { headers }
            ).toPromise();

            if (response?.success) {
                // Update the metric status in the local array
                const metricIndex = this.metrics.findIndex(metric => metric.id === metricId);
                if (metricIndex !== -1) {
                    this.metrics[metricIndex].is_active = this.metrics[metricIndex].is_active === 1 ? 0 : 1;
                    this.filterMetrics(); // Refresh filtered metrics
                }

                console.log('Status updated:', response.message);
            } else {
                this.error = response?.message || 'Failed to update metric status';
            }
        } catch (err: any) {
            console.error('Error updating metric status:', err);
            this.error = err?.error?.message || 'Failed to update metric status';
        }
    }

    refreshMetrics() {
        this.loadMetrics(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Search functionality
    onSearchChange() {
        this.filterMetrics();
    }

    filterMetrics() {
        if (!this.searchTerm.trim()) {
            this.filteredMetrics = this.metrics;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredMetrics = this.metrics.filter(metric =>
                metric.name.toLowerCase().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredMetrics = this.metrics;
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