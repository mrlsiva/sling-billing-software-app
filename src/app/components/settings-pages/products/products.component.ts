import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { AuthService } from '../../../services/auth.service';

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
}

interface SubCategory {
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
}

interface Tax {
    id: number;
    shop_id: number;
    name: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface Metric {
    id: number;
    shop_id: number;
    name: string;
    is_active: number;
    created_at: string;
    updated_at: string;
}

interface Product {
    id: number;
    user_id: number;
    name: string;
    sub_category_id: number;
    category_id: number;
    code: string;
    description: string | null;
    hsn_code: string | null;
    price: string;
    tax_amount: string;
    quantity: number;
    tax_id: number;
    metric_id: number;
    discount_type: string | null;
    discount: string | null;
    image: string | null;
    is_active: number;
    is_bulk_upload: number;
    run_id: string | null;
    created_at: string;
    updated_at: string;
    category: Category;
    sub_category: SubCategory;
    tax: Tax;
    metric: Metric;
}

interface ProductDetailResponse {
    code: number;
    message: string;
    success: boolean;
    data: Product;
}

interface StatusToggleResponse {
    code: number;
    message: string;
    success: boolean;
    data: string;
}

interface ProductResponse {
    code: number;
    message: string;
    success: boolean;
    data: {
        current_page: number;
        data: Product[];
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
    selector: 'app-products',
    standalone: true,
    imports: [CommonModule, FormsModule, HttpClientModule],
    templateUrl: './products.component.html',
    styleUrl: './products.component.scss'
})
export class ProductsComponent implements OnInit, OnDestroy {
    products: Product[] = [];
    filteredProducts: Product[] = [];
    categories: Category[] = [];
    subcategories: SubCategory[] = [];
    taxes: Tax[] = [];
    metrics: Metric[] = [];
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
    productName: string = '';
    productCode: string = '';
    productDescription: string = '';
    hsnCode: string = '';
    price: string = '';
    selectedCategoryId: number | null = null;
    selectedSubcategoryId: number | null = null;
    selectedTaxId: number | null = null;
    selectedMetricId: number | null = null;
    discountType: string = '';
    discount: string = '';
    selectedImage: File | null = null;
    imagePreview: string | null = null;
    productId: number | null = null;

    // Product details for popup
    selectedProductDetails: Product | null = null;
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
        this.loadTaxes();
        this.loadMetrics();
        this.loadProducts();
    }

    ngOnDestroy() {
        // Cleanup if needed
    }

    loadProducts(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        const headers = this.auth.authHeaders();
        const params: any = { page };

        this.http.get<ProductResponse>(`${environment.apiBase}/products/list`, { headers, params })
            .subscribe({
                next: (response) => {
                    console.log('Products API Response:', response);

                    if (response.success && response.data) {
                        this.products = response.data.data;
                        this.filteredProducts = this.products;
                        this.currentPage = response.data.current_page;
                        this.totalPages = response.data.last_page;
                        this.itemsPerPage = response.data.per_page;
                        this.totalItems = response.data.total;

                        // Apply search filter if search term exists
                        if (this.searchTerm.trim()) {
                            this.filterProducts();
                        }
                    } else {
                        this.error = response.message || 'Failed to load products';
                        this.products = [];
                        this.filteredProducts = [];
                    }

                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error loading products:', err);
                    if (err.status === 401) {
                        this.error = 'Unauthenticated. Please log in again.';
                        this.auth.clearSession();
                    } else if (err.status === 403) {
                        this.error = 'Access denied. You do not have permission to view products.';
                    } else {
                        this.error = err?.error?.message || 'Failed to load products. Please try again.';
                    }
                    this.loading = false;
                }
            });
    }

    refreshProducts() {
        this.loadProducts(this.currentPage);
    }

    loadCategories() {
        const headers = this.auth.authHeaders();
        this.http.get<any>(`${environment.apiBase}/categories/list`, { headers })
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

    loadTaxes() {
        const headers = this.auth.authHeaders();
        this.http.get<any>(`${environment.apiBase}/taxes/list`, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Taxes API Response:', response);
                    if (response.success && response.data) {
                        this.taxes = response.data.data;
                    }
                },
                error: (err) => {
                    console.error('Error loading taxes:', err);
                }
            });
    }

    loadMetrics() {
        const headers = this.auth.authHeaders();
        this.http.get<any>(`${environment.apiBase}/metrics/list`, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Metrics API Response:', response);
                    if (response.success && response.data) {
                        this.metrics = response.data.data;
                    }
                },
                error: (err) => {
                    console.error('Error loading metrics:', err);
                }
            });
    }

    onCategoryChange() {
        console.log('Category changed:', this.selectedCategoryId);

        if (this.selectedCategoryId) {
            // Convert selectedCategoryId to number for comparison
            const categoryId = Number(this.selectedCategoryId);

            // Filter subcategories based on selected category
            const selectedCategory = this.categories.find(cat => cat.id === categoryId);
            console.log('Selected category:', selectedCategory);

            if (selectedCategory && (selectedCategory as any).sub_categories) {
                this.subcategories = (selectedCategory as any).sub_categories;
                console.log('Using embedded subcategories:', this.subcategories);
            } else {
                // If no subcategories in category object, load them separately
                console.log('Loading subcategories from API...');
                this.loadSubcategories();
            }
            this.selectedSubcategoryId = null; // Reset subcategory selection
        } else {
            this.subcategories = [];
            this.selectedSubcategoryId = null;
            console.log('Category cleared, subcategories reset');
        }
    }

    loadSubcategories() {
        if (!this.selectedCategoryId) {
            console.log('No category selected, cannot load subcategories');
            return;
        }

        const categoryId = Number(this.selectedCategoryId);
        console.log('Loading subcategories for category ID:', categoryId);

        const headers = this.auth.authHeaders();
        this.http.get<any>(`${environment.apiBase}/sub_categories/list?category_id=${categoryId}`, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Subcategories API Response:', response);
                    if (response.success && response.data) {
                        // Handle both paginated and non-paginated responses
                        if (response.data.data && Array.isArray(response.data.data)) {
                            this.subcategories = response.data.data;
                        } else if (Array.isArray(response.data)) {
                            this.subcategories = response.data;
                        } else {
                            this.subcategories = [];
                        }
                        console.log('Loaded subcategories:', this.subcategories);
                    } else {
                        console.warn('No subcategories found for category:', categoryId);
                        this.subcategories = [];
                    }
                },
                error: (err) => {
                    console.error('Error loading subcategories:', err);
                    this.subcategories = [];
                }
            });
    }

    goBack() {
        this.router.navigate(['/dashboard']);
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.loadProducts(page);
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

    // Modal methods
    openCreateModal() {
        this.isEditMode = false;
        this.modalTitle = 'Create Product';
        this.resetFormFields();
        this.showModal = true;
    }

    openEditModal(product: Product) {
        this.isEditMode = true;
        this.modalTitle = 'Edit Product';
        this.fillFormFields(product);
        this.showModal = true;
    }

    closeModal() {
        this.showModal = false;
        this.resetFormFields();
        this.error = null;
    }

    resetFormFields() {
        this.productName = '';
        this.productCode = '';
        this.productDescription = '';
        this.hsnCode = '';
        this.price = '';
        this.selectedCategoryId = null;
        this.selectedSubcategoryId = null;
        this.selectedTaxId = null;
        this.selectedMetricId = null;
        this.discountType = '';
        this.discount = '';
        this.selectedImage = null;
        this.imagePreview = null;
        this.productId = null;
        this.subcategories = [];
    }

    fillFormFields(product: Product) {
        this.productName = product.name;
        this.productCode = product.code;
        this.productDescription = product.description || '';
        this.hsnCode = product.hsn_code || '';
        this.price = product.price;
        this.selectedCategoryId = product.category_id;
        this.selectedSubcategoryId = product.sub_category_id;
        this.selectedTaxId = product.tax_id;
        this.selectedMetricId = product.metric_id;
        this.discountType = product.discount_type || '';
        this.discount = product.discount || '';
        this.selectedImage = null;
        this.imagePreview = product.image || null;
        this.productId = product.id;

        // Load subcategories for the selected category
        this.onCategoryChange();
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
        if (!this.validateForm()) {
            return;
        }

        if (this.isEditMode) {
            this.updateProduct();
        } else {
            this.createProduct();
        }
    }

    validateForm(): boolean {
        if (!this.productName.trim()) {
            this.error = 'Product name is required';
            return false;
        }
        if (!this.productCode.trim()) {
            this.error = 'Product code is required';
            return false;
        }
        if (!this.selectedCategoryId) {
            this.error = 'Category is required';
            return false;
        }
        if (!this.selectedSubcategoryId) {
            this.error = 'Subcategory is required';
            return false;
        }
        if (!this.price || parseFloat(this.price) <= 0) {
            this.error = 'Valid price is required';
            return false;
        }
        if (!this.selectedTaxId) {
            this.error = 'Tax is required';
            return false;
        }
        if (!this.selectedMetricId) {
            this.error = 'Metric/Unit is required';
            return false;
        }
        return true;
    }

    createProduct() {
        const headers = this.auth.authHeaders();
        const formData = new FormData();

        // Add required fields
        formData.append('category', this.selectedCategoryId!.toString());
        formData.append('sub_category', this.selectedSubcategoryId!.toString());
        formData.append('name', this.productName.trim());
        formData.append('code', this.productCode.trim());
        formData.append('price', this.price);
        formData.append('tax', this.selectedTaxId!.toString());
        formData.append('metric', this.selectedMetricId!.toString());
        formData.append('quantity', '0'); // Fixed quantity as requested

        // Add optional fields
        if (this.productDescription.trim()) {
            formData.append('description', this.productDescription.trim());
        }
        if (this.hsnCode.trim()) {
            formData.append('hsn_code', this.hsnCode.trim());
        }
        if (this.discountType) {
            formData.append('discount_type', this.discountType);
        }
        if (this.discount) {
            formData.append('discount', this.discount);
        }
        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/products/store`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Create Product Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadProducts(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to create product';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error creating product:', err);
                    this.error = err?.error?.message || 'Failed to create product. Please try again.';
                    this.loading = false;
                }
            });
    }

    updateProduct() {
        if (!this.productId) {
            this.error = 'Product ID is missing';
            return;
        }

        const headers = this.auth.authHeaders();
        const formData = new FormData();

        // Add required fields
        formData.append('product_id', this.productId.toString());
        formData.append('category', this.selectedCategoryId!.toString());
        formData.append('sub_category', this.selectedSubcategoryId!.toString());
        formData.append('name', this.productName.trim());
        formData.append('code', this.productCode.trim());
        formData.append('price', this.price);
        formData.append('tax', this.selectedTaxId!.toString());
        formData.append('metric', this.selectedMetricId!.toString());

        // Add optional fields
        if (this.productDescription.trim()) {
            formData.append('description', this.productDescription.trim());
        }
        if (this.hsnCode.trim()) {
            formData.append('hsn_code', this.hsnCode.trim());
        }
        if (this.discountType) {
            formData.append('discount_type', this.discountType);
        }
        if (this.discount) {
            formData.append('discount', this.discount);
        }
        if (this.selectedImage) {
            formData.append('image', this.selectedImage);
        }

        this.loading = true;
        this.error = null;

        this.http.post<any>(`${environment.apiBase}/products/update`, formData, { headers })
            .subscribe({
                next: (response) => {
                    console.log('Update Product Response:', response);
                    if (response.success) {
                        this.closeModal();
                        this.loadProducts(this.currentPage);
                    } else {
                        this.error = response.message || 'Failed to update product';
                    }
                    this.loading = false;
                },
                error: (err) => {
                    console.error('Error updating product:', err);
                    this.error = err?.error?.message || 'Failed to update product. Please try again.';
                    this.loading = false;
                }
            });
    }

    // Search functionality
    onSearchChange() {
        this.filterProducts();
    }

    filterProducts() {
        if (!this.searchTerm.trim()) {
            this.filteredProducts = this.products;
        } else {
            const searchLower = this.searchTerm.toLowerCase();
            this.filteredProducts = this.products.filter(product =>
                product.name.toLowerCase().includes(searchLower) ||
                product.code.toLowerCase().includes(searchLower) ||
                product.category.name.toLowerCase().includes(searchLower) ||
                product.sub_category.name.toLowerCase().includes(searchLower)
            );
        }
    }

    clearSearch() {
        this.searchTerm = '';
        this.filteredProducts = this.products;
    }

    // Product details popup
    openProductDetails(product: Product) {
        this.selectedProductDetails = product;
        this.showDetailsModal = true;
    }

    closeDetailsModal() {
        this.showDetailsModal = false;
        this.selectedProductDetails = null;
        this.error = null;
    }

    // Status toggle functionality
    async toggleProductStatus(productId: number, currentStatus: number) {
        try {
            const headers = this.auth.authHeaders();
            const response = await this.http.get<StatusToggleResponse>(
                `${environment.apiBase}/products/${productId}/status`,
                { headers }
            ).toPromise();

            if (response?.success) {
                // Update the product status in the local array
                const productIndex = this.products.findIndex(prod => prod.id === productId);
                if (productIndex !== -1) {
                    this.products[productIndex].is_active = this.products[productIndex].is_active === 1 ? 0 : 1;
                    this.filterProducts(); // Refresh filtered products
                }

                // Update details modal if open for this product
                if (this.selectedProductDetails && this.selectedProductDetails.id === productId) {
                    this.selectedProductDetails.is_active = this.selectedProductDetails.is_active === 1 ? 0 : 1;
                }

                console.log('Status updated:', response.message);
            } else {
                this.error = response?.message || 'Failed to update product status';
            }
        } catch (err: any) {
            console.error('Error updating product status:', err);
            this.error = err?.error?.message || 'Failed to update product status';
        }
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

    formatPrice(price: string): string {
        const numPrice = parseFloat(price);
        return numPrice.toLocaleString('en-IN', { style: 'currency', currency: 'INR' });
    }

    getQuantityStatusClass(quantity: number): string {
        if (quantity === 0) return 'quantity-out-of-stock';
        if (quantity < 10) return 'quantity-low-stock';
        return 'quantity-in-stock';
    }

    getQuantityStatusText(quantity: number): string {
        if (quantity === 0) return 'Out of Stock';
        if (quantity < 10) return 'Low Stock';
        return 'In Stock';
    }
}