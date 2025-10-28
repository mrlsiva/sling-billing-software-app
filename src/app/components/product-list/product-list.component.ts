import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { RouterModule, Router } from '@angular/router';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    products: any[] = [];
    filteredProducts: any[] = [];
    loading = false;
    error: string | null = null;
    username: string | null = null;
    userEmail: string | null = null;
    logoUrl: string | null = null;

    // Pagination properties
    currentPage: number = 1;
    totalPages: number = 1;
    // Don't hardcode page size; prefer API's `per_page` when available.
    // `null` means "use API default". If a user or UI sets this value, we'll send it to the API.
    itemsPerPage: number | null = null;
    totalItems: number = 0;
    paginationData: any = null;

    // API Response Structure Configuration
    // Modify these mappings to match your API structure
    private apiConfig = {
        // Possible paths for the products array
        productPaths: ['data.data', 'data', 'items', 'results', 'products'],
        // Possible field names for pagination info
        currentPageFields: ['current_page', 'currentPage', 'page'],
        totalPagesFields: ['last_page', 'lastPage', 'totalPages', 'total_pages'],
        itemsPerPageFields: ['per_page', 'perPage', 'pageSize', 'page_size', 'limit'],
        totalItemsFields: ['total', 'totalItems', 'total_items', 'count']
    };

    // Search functionality
    searchTerm: string = '';
    searchTimeout: any;

    // Filter functionality
    showFilterModal: boolean = false;
    showCategoryDropdown: boolean = false;
    showSubCategoryDropdown: boolean = false;
    categories: any[] = [];
    subCategories: any[] = [];
    filteredCategories: any[] = [];
    filteredSubCategories: any[] = [];
    selectedCategory: any = null;
    selectedSubCategory: any = null;
    categorySearchTerm: string = '';
    subCategorySearchTerm: string = '';

    readonly placeholderUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.jpg`;
    readonly Math = Math; // Expose Math to template
    private subs: Subscription | null = null;
    // previously used for inline expansion; removed when details page was deprecated

    constructor(private productService: ProductService, private auth: AuthService, private cart: CartService, private router: Router) { }

    ngOnInit() {
        // subscribe to reactive user updates
        this.subs = this.auth.user$.subscribe(u => {
            this.username = u?.name || u?.full_name || u?.username || null;
            this.userEmail = u?.email || u?.email_address || null;

            // determine logo URL: prefer `logo`, then `fav_icon` or `logo_url`
            const logoVal = u?.logo || u?.fav_icon || u?.logo_url || null;
            if (logoVal) {
                if (/^https?:\/\//i.test(logoVal)) {
                    this.logoUrl = logoVal;
                } else {
                    this.logoUrl = `${environment.assetsBase.replace(/\/$/, '')}/${logoVal.replace(/^\//, '')}`;
                }
            } else {
                // default placeholder image from server
                this.logoUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.jpg`;
            }
        });
        this.fetchProducts();
    }

    ngOnDestroy(): void {
        this.subs?.unsubscribe();
        // Clear search timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }
    }

    fetchProducts(page: number = 1) {
        this.loading = true;
        this.error = null;
        this.currentPage = page;

        // Check if user is authenticated
        if (!this.auth.isLoggedIn()) {
            this.error = 'You are not authenticated. Please log in.';
            this.loading = false;
            return;
        }

        // Build filters with pagination. Only include per_page when component explicitly set it.
        const filters: any = { page };
        if (this.itemsPerPage && Number(this.itemsPerPage) > 0) {
            filters.per_page = this.itemsPerPage;
        }

        // Add search filters if they exist
        if (this.selectedCategory) {
            filters.category = this.selectedCategory.id;
        }
        if (this.selectedSubCategory) {
            filters.sub_category = this.selectedSubCategory.id;
        }
        if (this.searchTerm.trim()) {
            filters.filter = this.searchTerm.trim();
        }

        this.productService.list(filters).subscribe({
            next: (res: any) => {
                console.log('API Response:', res);
                console.log('Filters sent:', filters);

                // Handle paginated response with flexible API structure
                const paginationInfo = this.extractPaginationInfo(res);

                console.log('Extracted pagination info:', paginationInfo);

                this.paginationData = paginationInfo.data;
                this.products = paginationInfo.products;

                // Update pagination info
                this.currentPage = paginationInfo.currentPage;
                this.totalPages = paginationInfo.totalPages;
                this.itemsPerPage = paginationInfo.itemsPerPage;
                this.totalItems = paginationInfo.totalItems;

                console.log('Final pagination state:', {
                    currentPage: this.currentPage,
                    totalPages: this.totalPages,
                    itemsPerPage: this.itemsPerPage,
                    totalItems: this.totalItems
                });

                // normalize quantities so templates can rely on a safe numeric value
                this.normalizeProductQuantities();

                // For server-side pagination, we don't need client-side filtering
                // Just use the products directly from server
                this.filteredProducts = [...this.products];

                // Extract categories and sub-categories for filters
                // Note: For full category/subcategory lists, you might want to make a separate API call
                this.extractCategoriesAndSubCategories();

                this.loading = false;
            },
            error: (err) => {
                console.error('Product fetch error:', err);
                if (err.status === 401) {
                    this.error = 'Unauthenticated. Please log in again.';
                    this.auth.clearSession();
                } else if (err.status === 403) {
                    this.error = 'Access denied. You do not have permission to view POS items.';
                } else if (err.status === 404) {
                    this.error = 'POS endpoint not found. Please check your configuration.';
                } else {
                    this.error = err?.error?.message || 'Failed to load POS items. Please try again.';
                }
                this.loading = false;
            }
        });
    }

    // Pagination methods
    goToPage(page: number) {
        if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
            this.fetchProducts(page);
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

    // Generate page numbers for pagination display
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

    // Get safe items per page value for template usage
    get safeItemsPerPage(): number {
        return this.itemsPerPage || 21;
    }

    // Get products for the current page only
    getCurrentPageProducts(): any[] {
        if (!this.filteredProducts || this.filteredProducts.length === 0) {
            return [];
        }

        // For server-side pagination, the API already returns only the current page's items
        // So we just return the filteredProducts as-is (no slicing needed)
        return this.filteredProducts;
    }

    // Extract pagination information from various API response structures
    private extractPaginationInfo(res: any): {
        data: any;
        products: any[];
        currentPage: number;
        totalPages: number;
        itemsPerPage: number;
        totalItems: number;
    } {
        // Handle different possible API response structures
        let data = null;
        let products: any[] = [];
        let currentPage = 1;
        let totalPages = 1;
        let itemsPerPage = this.itemsPerPage || 21; // Use component's setting or default to 21
        let totalItems = 0;

        // Check if response has nested data structure (Laravel pagination)
        if (res?.data && typeof res.data === 'object') {
            data = res.data;

            // Extract products array using configured paths
            products = this.extractValueByPaths(res, this.apiConfig.productPaths) || [];

            // Extract pagination info using configured field names
            currentPage = this.extractValueByFields(res.data, this.apiConfig.currentPageFields) || 1;
            totalPages = this.extractValueByFields(res.data, this.apiConfig.totalPagesFields) || 1;

            // Prefer API-provided per_page when available; otherwise fall back to component setting or default.
            const apiPerPage = this.extractValueByFields(res.data, this.apiConfig.itemsPerPageFields);
            if (apiPerPage !== null && apiPerPage !== undefined) {
                itemsPerPage = Number(apiPerPage) || itemsPerPage;
            } else if (this.itemsPerPage && Number(this.itemsPerPage) > 0) {
                itemsPerPage = this.itemsPerPage;
            }

            totalItems = this.extractValueByFields(res.data, this.apiConfig.totalItemsFields) || products.length;

        } else if (Array.isArray(res?.data)) {
            // Simple array response
            data = res.data;
            products = res.data;
            totalItems = products.length;

        } else if (Array.isArray(res)) {
            // Direct array response
            data = res;
            products = res;
            totalItems = products.length;

        } else {
            // Fallback for unknown structure
            console.warn('Unknown API response structure:', res);
            this.logApiStructure(res);
            data = res;
            products = [];
        }

        // Ensure values are valid numbers
        currentPage = Math.max(1, Number(currentPage) || 1);
        itemsPerPage = Math.max(1, Number(itemsPerPage) || 21); // Use 21 as default (matching API default)
        totalItems = Math.max(0, Number(totalItems) || products.length);

        // Only recalculate totalPages if the API didn't provide it or if totalItems suggests more pages
        const apiTotalPages = this.extractValueByFields(res?.data, this.apiConfig.totalPagesFields);
        if (apiTotalPages && Number(apiTotalPages) > 1) {
            // Trust the API's totalPages
            totalPages = Math.max(1, Number(apiTotalPages));
        } else {
            // Recalculate based on totalItems and itemsPerPage
            totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
        }

        return {
            data,
            products,
            currentPage,
            totalPages,
            itemsPerPage,
            totalItems
        };
    }

    // Helper method to extract value by trying multiple field names
    private extractValueByFields(obj: any, fields: string[]): any {
        for (const field of fields) {
            if (obj && obj.hasOwnProperty(field) && obj[field] !== null && obj[field] !== undefined) {
                return obj[field];
            }
        }
        return null;
    }

    // Helper method to extract value by trying multiple object paths
    private extractValueByPaths(obj: any, paths: string[]): any {
        for (const path of paths) {
            const value = this.getNestedValue(obj, path);
            if (Array.isArray(value)) {
                return value;
            }
        }
        return null;
    }

    // Helper method to get nested object value by dot notation path
    private getNestedValue(obj: any, path: string): any {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : null;
        }, obj);
    }    // Helper method to log API structure for debugging
    private logApiStructure(res: any): void {
        console.group('API Response Structure Analysis');
        console.log('Full response:', res);
        console.log('Response type:', typeof res);
        console.log('Is array:', Array.isArray(res));

        if (res && typeof res === 'object') {
            console.log('Top-level keys:', Object.keys(res));

            if (res.data) {
                console.log('res.data type:', typeof res.data);
                console.log('res.data is array:', Array.isArray(res.data));
                if (res.data && typeof res.data === 'object' && !Array.isArray(res.data)) {
                    console.log('res.data keys:', Object.keys(res.data));
                }
            }
        }
        console.groupEnd();
    }

    // Ensure each product has a safe numeric `quantity` (integer >= 0)
    private normalizeProductQuantities() {
        if (!Array.isArray(this.products)) return;
        this.products = this.products.map((p: any) => {
            // try common locations for quantity
            const raw = p?.quantity ?? p?.product?.quantity ?? 0;
            const num = Number(raw);
            const safe = Number.isFinite(num) ? Math.max(0, Math.floor(num)) : 0;
            return { ...p, quantity: safe };
        });
    }

    // Search functionality methods
    onSearch() {
        // Clear previous timeout
        if (this.searchTimeout) {
            clearTimeout(this.searchTimeout);
        }

        // Debounce search for 300ms
        this.searchTimeout = setTimeout(() => {
            // Reset to first page when searching
            this.fetchProducts(1);
        }, 300);
    }

    clearSearch() {
        this.searchTerm = '';
        this.fetchProducts(1);
    }

    // Extract unique categories and sub-categories from products
    extractCategoriesAndSubCategories() {
        const categoryMap = new Map();
        const subCategoryMap = new Map();

        this.products.forEach(item => {
            const product = item.product || item;

            // Extract categories
            if (product.category && product.category.id) {
                categoryMap.set(product.category.id, product.category);
            }

            // Extract sub-categories
            if (product.sub_category && product.sub_category.id) {
                subCategoryMap.set(product.sub_category.id, product.sub_category);
            }
        });

        this.categories = Array.from(categoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        this.subCategories = Array.from(subCategoryMap.values()).sort((a, b) => a.name.localeCompare(b.name));
        this.filteredCategories = [...this.categories];
        this.filteredSubCategories = [...this.subCategories];

        console.log('Categories extracted:', this.categories.length, this.categories);
        console.log('Sub-categories extracted:', this.subCategories.length, this.subCategories);
    }

    // Filter modal methods
    openFilterModal() {
        this.showFilterModal = true;
        this.categorySearchTerm = '';
        this.subCategorySearchTerm = '';
        this.filteredCategories = [...this.categories];
        this.filteredSubCategories = this.selectedCategory ?
            this.subCategories.filter(sub =>
                this.products.some(item =>
                    (item.product || item).category?.id === this.selectedCategory.id &&
                    (item.product || item).sub_category?.id === sub.id
                )
            ) : [...this.subCategories];
    }

    closeFilterModal() {
        this.showFilterModal = false;
        this.showCategoryDropdown = false;
        this.showSubCategoryDropdown = false;
        this.categorySearchTerm = '';
        this.subCategorySearchTerm = '';
    }

    // Dropdown toggle methods
    toggleCategoryDropdown() {
        this.showCategoryDropdown = !this.showCategoryDropdown;
        this.showSubCategoryDropdown = false;

        if (this.showCategoryDropdown) {
            this.categorySearchTerm = '';
            this.filteredCategories = [...this.categories];
        }
    }

    toggleSubCategoryDropdown() {
        this.showSubCategoryDropdown = !this.showSubCategoryDropdown;
        this.showCategoryDropdown = false;

        if (this.showSubCategoryDropdown) {
            this.subCategorySearchTerm = '';
            this.filteredSubCategories = this.selectedCategory ?
                this.subCategories.filter(sub =>
                    this.products.some(item =>
                        (item.product || item).category?.id === this.selectedCategory.id &&
                        (item.product || item).sub_category?.id === sub.id
                    )
                ) : [...this.subCategories];
        }
    }

    // Category search methods
    onCategorySearch() {
        if (!this.categorySearchTerm.trim()) {
            this.filteredCategories = [...this.categories];
            return;
        }

        const searchLower = this.categorySearchTerm.toLowerCase();
        this.filteredCategories = this.categories.filter(category =>
            category.name.toLowerCase().includes(searchLower)
        );
    }

    clearCategorySearch() {
        this.categorySearchTerm = '';
        this.filteredCategories = [...this.categories];
    }

    selectCategory(category: any) {
        this.selectedCategory = category;
        this.selectedSubCategory = null; // Reset sub-category when category changes
        this.subCategorySearchTerm = '';
        this.showCategoryDropdown = false;

        // Filter sub-categories based on selected category
        if (category) {
            this.filteredSubCategories = this.subCategories.filter(sub =>
                this.products.some(item =>
                    (item.product || item).category?.id === category.id &&
                    (item.product || item).sub_category?.id === sub.id
                )
            );
        } else {
            this.filteredSubCategories = [...this.subCategories];
        }

        // Fetch new data with filter applied
        this.fetchProducts(1);
    }

    // Sub-category search methods
    onSubCategorySearch() {
        if (!this.subCategorySearchTerm.trim()) {
            this.filteredSubCategories = this.selectedCategory ?
                this.subCategories.filter(sub =>
                    this.products.some(item =>
                        (item.product || item).category?.id === this.selectedCategory.id &&
                        (item.product || item).sub_category?.id === sub.id
                    )
                ) : [...this.subCategories];
            return;
        }

        const searchLower = this.subCategorySearchTerm.toLowerCase();
        const availableSubCategories = this.selectedCategory ?
            this.subCategories.filter(sub =>
                this.products.some(item =>
                    (item.product || item).category?.id === this.selectedCategory.id &&
                    (item.product || item).sub_category?.id === sub.id
                )
            ) : this.subCategories;

        this.filteredSubCategories = availableSubCategories.filter(subCategory =>
            subCategory.name.toLowerCase().includes(searchLower)
        );
    }

    clearSubCategorySearch() {
        this.subCategorySearchTerm = '';
        this.filteredSubCategories = this.selectedCategory ?
            this.subCategories.filter(sub =>
                this.products.some(item =>
                    (item.product || item).category?.id === this.selectedCategory.id &&
                    (item.product || item).sub_category?.id === sub.id
                )
            ) : [...this.subCategories];
    }

    selectSubCategory(subCategory: any) {
        this.selectedSubCategory = subCategory;
        this.showSubCategoryDropdown = false;
        // Fetch new data with filter applied
        this.fetchProducts(1);
    }

    // Filter management methods
    clearCategoryFilter() {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.fetchProducts(1);
    }

    clearSubCategoryFilter() {
        this.selectedSubCategory = null;
        this.fetchProducts(1);
    }

    clearAllFilters() {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.searchTerm = '';
        this.fetchProducts(1);
        this.closeFilterModal();
    }

    applyFilters() {
        this.fetchProducts(1);
        this.closeFilterModal();
    }

    // Remove the old applyAllFilters method since we're using server-side filtering now

    logout() {
        this.auth.logout().subscribe({
            error: () => this.auth.clearSession()
        });
    }

    // derive id from the list item wrapper
    productIdOf(item: any): string {
        // common shapes: item.product.id, item.id, item.product.unique_id
        return String(item?.product?.id ?? item?.id ?? item?.product?.unique_id ?? '');
    }

    // toggleDetails removed — details are no longer fetched/expanded inline

    imgUrl(d: any): string | null {
        if (!d) return null;
        const img = d.image || d.file || d.image_path || d.photo || null;
        return this.productService.resolveImageUrl(img);
    }

    addToCart(item: any) {
        this.cart.add(item.product ?? item);
    }

    goToLogin() {
        this.router.navigate(['/login']);
    }
}
