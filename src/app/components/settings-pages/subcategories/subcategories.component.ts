import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

interface Category {
    id: number;
    name: string;
}

interface SubCategory {
    id: number;
    user_id: number;
    category_id: number;
    name: string;
    image: string | null;
    is_active: number;
    is_bulk_upload: number;
    run_id: string | null;
    created_at: string;
    updated_at: string;
}

interface SubCategoryDetailResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        id: number;
        user_id: number;
        category_id: number;
        name: string;
        image: string;
        is_active: number;
        is_bulk_upload: number;
        run_id: string | null;
        created_at: string;
        updated_at: string;
    };
}

interface StatusToggleResponse {
    code: number;
    message: string;
    success: boolean;
    data: string;
}

interface SubCategoryResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: SubCategory[];
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

interface CategoryListResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        data: Category[];
    };
}

@Component({
    selector: 'app-subcategories',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './subcategories.component.html',
    styleUrl: './subcategories.component.scss'
})
export class SubcategoriesComponent implements OnInit, OnDestroy {
    subcategories: SubCategory[] = [];
    filteredSubcategories: SubCategory[] = [];
    categories: Category[] = [];
    loading = true;
    error: string | null = null;

    // Search properties
    searchTerm: string = '';
    isSearching: boolean = false;

    // Pagination properties
    currentPage: number = 1;
    totalPages: number = 1;
    itemsPerPage: number = 10;
    totalItems: number = 0;

    // Modal properties
    showModal: boolean = false;
    showDetailsModal: boolean = false;
    isEditMode: boolean = false;
    modalTitle: string = '';

    // Form properties
    subcategoryName: string = '';
    subcategoryId: number | null = null;
    selectedCategoryId: number | null = null;
    selectedImage: File | null = null;
    imagePreview: string | null = null;

    // Subcategory details for popup
    selectedSubcategoryDetails: any = null;
    detailsLoading: boolean = false;

    // Expose Math to template
    readonly Math = Math;
    readonly placeholderUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.svg`;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadCategories();
        this.loadSubcategories();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadCategories() {
        const headers = this.auth.authHeaders();

        this.http.get<CategoryListResponse>(`${environment.apiBase}/categories/list`, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Categories API Response:', response);
                    if (response.success && response.data) {
                        this.categories = response.data.data;
                    }
                },
                error: (err) => {
                    console.error('Error loading categories:', err);
                }
            });
    }

    loadSubcategories(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<SubCategoryResponse>(`${environment.apiBase}/sub_categories/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Subcategories API Response:', response);

                    if (response.success && response.data) {
                        this.subcategories = response.data.data;
                        this.filteredSubcategories = this.subcategories;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterSubcategories();
                        }
                    } else {
                        this.error = response.message || 'Failed to load subcategories';
                        this.subcategories = [];
                        this.filteredSubcategories = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading subcategories:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view subcategories.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load subcategories. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    openCreateModal() {
        this.isEditMode = false;
        this.modalTitle = 'Create Subcategory';
        this.subcategoryName = '';
        this.subcategoryId = null;
        this.selectedCategoryId = null;
        this.selectedImage = null;
        this.imagePreview = null;
        this.showModal = true;
    }

    openEditModal(subcategory: SubCategory) {
        this.isEditMode = true;
        this.modalTitle = 'Edit Subcategory';
        this.subcategoryName = subcategory.name;
        this.subcategoryId = subcategory.id;
        this.selectedCategoryId = subcategory.category_id;
        this.selectedImage = null;
        this.imagePreview = subcategory.image || null;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.subcategoryName = '';
        this.subcategoryId = null;
        this.selectedCategoryId = null;
        this.selectedImage = null;
        this.imagePreview = null;
        this.error = null;
    }

    onImageSelect(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files[0]) {
            this.selectedImage = input.files[0];

            // Create image preview
            const reader = new FileReader();
            reader.onload = (e: ProgressEvent<FileReader>) => {
                this.imagePreview = e.target?.result as string;
            };
            reader.readAsDataURL(this.selectedImage);
        }
    }

    removeImage() {
        this.selectedImage = null;
        this.imagePreview = null;
    }

    submitForm() {
        if (!this.subcategoryName.trim()) {
            this.error = 'Subcategory name is required';
            return;
        }

        if (!this.selectedCategoryId) {
            this.error = 'Category is required';
            return;
        }

        if (this.isEditMode) {
            this.updateSubcategory();
        } else {
            this.createSubcategory();
        }
    }

    createSubcategory() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('value', this.subcategoryName.trim());
        formData.append('category', this.selectedCategoryId!.toString());

        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/sub_categories/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Create Subcategory Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadSubcategories(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create subcategory';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating subcategory:', err);
                    this.error = err?.error?.message || 'Failed to create subcategory. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateSubcategory() {
        if (!this.subcategoryId) {
            this.error = 'Subcategory ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('value', this.subcategoryName.trim());
        formData.append('category', this.selectedCategoryId!.toString());
        formData.append('subcategory_id', this.subcategoryId.toString());

        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/sub_categories/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Update Subcategory Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadSubcategories(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update subcategory';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating subcategory:', err);
                    this.error = err?.error?.message || 'Failed to update subcategory. Please try again.';
                    this.loading = false;
                }
            });
    }

    refreshSubcategories() {
        this.loadSubcategories(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.loadSubcategories(page);
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

    getImageUrl(image: string | null): string {
        // Return placeholder if no image or if it's the default no-image icon
        if (!image || image === 'https://test.slingbillings.com/no-image-icon.svg' || image.includes('no-image-icon')) {
            return this.placeholderUrl;
        }
        // If it's already a full URL, return as is
        if (/^https?:\/\//i.test(image)) {
            return image;
        }
        // Otherwise, construct the full URL
        return `${environment.assetsBase.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
    }

    // Search functionality
    onSearchChange() {
        this.filterSubcategories();
    }

    filterSubcategories() {
        if (!this.searchTerm.trim()) {
            this.filteredSubcategories = this.subcategories;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredSubcategories = this.subcategories.filter(subcategory =>
                subcategory.name.toLowerCase().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredSubcategories = this.subcategories;
    }

    // Subcategory details popup
    async openSubcategoryDetails(subcategoryId: number) {
        this.detailsLoading = true;
        this.showDetailsModal = true;
        this.selectedSubcategoryDetails = null;

        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<SubCategoryDetailResponse>(
                `${environment.apiBase}/sub_categories/${subcategoryId}/view`,
                { headers }
            ).toPromise();

            if (response?.success && response.data) {
                this.selectedSubcategoryDetails = response.data;
            } else {
                this.error = response?.message || 'Failed to load subcategory details';
                this.closeDetailsModal();
            }
        } catch (err: any) {
            console.error('Error loading subcategory details:', err);
            this.error = err?.error?.message || 'Failed to load subcategory details';
            this.closeDetailsModal();
        } finally {
            this.detailsLoading = false;
        }
    }

    closeDetailsModal() {
        this.showDetailsModal = false;
        this.selectedSubcategoryDetails = null;
        this.detailsLoading = false;
        this.error = null;
    }

    // Status toggle functionality
    async toggleSubcategoryStatus(subcategoryId: number, currentStatus: number) {
        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<StatusToggleResponse>(
                `${environment.apiBase}/sub_categories/${subcategoryId}/status`,
                { headers }
            ).toPromise();

            if (response?.success) {
                // Update the subcategory status in the local array
                const subcategoryIndex = this.subcategories.findIndex(sub => sub.id === subcategoryId);
                if (subcategoryIndex !== -1) {
                    this.subcategories[subcategoryIndex].is_active = this.subcategories[subcategoryIndex].is_active === 1 ? 0 : 1;
                    this.filterSubcategories(); // Refresh filtered subcategories
                }

                // Update details modal if open for this subcategory
                if (this.selectedSubcategoryDetails && this.selectedSubcategoryDetails.id === subcategoryId) {
                    this.selectedSubcategoryDetails.is_active = this.selectedSubcategoryDetails.is_active === 1 ? 0 : 1;
                }

                console.log('Status updated:', response.message);
            } else {
                this.error = response?.message || 'Failed to update subcategory status';
            }
        } catch (err: any) {
            console.error('Error updating subcategory status:', err);
            this.error = err?.error?.message || 'Failed to update subcategory status';
        }
    }

    getCategoryName(categoryId: number): string {
        const category = this.categories.find(cat => cat.id === categoryId);
        return category ? category.name : 'Unknown Category';
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