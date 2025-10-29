import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

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

interface Category {
    id: number;
    user_id: number;
    name: string;
    image: string;
    is_active: number;
    is_bulk_upload: number;
    run_id: string | null;
    created_at: string;
    updated_at: string;
    sub_categories: SubCategory[];
}

interface CategoryResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Category[];
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
    selector: 'app-categories',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './categories.component.html',
    styleUrl: './categories.component.scss'
})
export class CategoriesComponent implements OnInit, OnDestroy {
    categories: Category[] = [];
    loading = true;
    error: string | null = null;

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
    categoryName: string = '';
    categoryId: number | null = null;
    selectedImage: File | null = null;
    imagePreview: string | null = null;

    // Expose Math to template
    readonly Math = Math;
    readonly placeholderUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.jpg`;

    constructor(
        private http: HttpClient,
        private auth: AuthService,
        private router: Router
    ) { }

    ngOnInit() {
        this.loadCategories();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadCategories(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<CategoryResponse>(`${environment.apiBase}/categories/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Categories API Response:', response);

                    if (response.success && response.data) {
                        this.categories = response.data.data;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;
                    } else {
                        this.error = response.message || 'Failed to load categories';
                        this.categories = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading categories:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view categories.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load categories. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    openCreateModal() {
        this.isEditMode = false;
        this.modalTitle = 'Create Category';
        this.categoryName = '';
        this.categoryId = null;
        this.selectedImage = null;
        this.imagePreview = null;
        this.showModal = true;
    }

    openEditModal(category: Category) {
        this.isEditMode = true;
        this.modalTitle = 'Edit Category';
        this.categoryName = category.name;
        this.categoryId = category.id;
        this.selectedImage = null;
        this.imagePreview = category.image || null;
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.categoryName = '';
        this.categoryId = null;
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
        if (!this.categoryName.trim()) {
            this.error = 'Category name is required';
            return;
        }

        if (this.isEditMode) {
            this.updateCategory();
        } else {
            this.createCategory();
        }
    }

    createCategory() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('category', this.categoryName.trim());

        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/categories/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Create Category Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadCategories(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create category';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating category:', err);
                    this.error = err?.error?.message || 'Failed to create category. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateCategory() {
        if (!this.categoryId) {
            this.error = 'Category ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();
        formData.append('category_name', this.categoryName.trim());
        formData.append('category_id', this.categoryId.toString());

        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/categories/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Update Category Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadCategories(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update category';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating category:', err);
                    this.error = err?.error?.message || 'Failed to update category. Please try again.';
                    this.loading = false;
                }
            });
    }

    refreshCategories() {
        this.loadCategories(this.currentPage);
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.loadCategories(page);
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
        if (!image || image === 'https://test.slingbillings.com/no-image-icon.jpg') {
            return this.placeholderUrl;
        }
        // If it's already a full URL, return as is
        if (/^https?:\/\//i.test(image)) {
            return image;
        }
        // Otherwise, construct the full URL
        return `${environment.assetsBase.replace(/\/$/, '')}/${image.replace(/^\//, '')}`;
    }
}
