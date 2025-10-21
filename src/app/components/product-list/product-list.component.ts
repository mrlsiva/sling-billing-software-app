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

    fetchProducts() {
        this.loading = true;
        this.error = null;

        // Check if user is authenticated
        if (!this.auth.isLoggedIn()) {
            this.error = 'You are not authenticated. Please log in.';
            this.loading = false;
            return;
        }

        this.productService.list().subscribe({
            next: (res: any) => {
                // adapt according to your API response structure
                this.products = res.data?.data ?? res.data ?? res;
                // normalize quantities so templates can rely on a safe numeric value
                this.normalizeProductQuantities();
                // Extract categories and sub-categories for filters
                this.extractCategoriesAndSubCategories();
                // Initialize filtered products with all products
                this.filteredProducts = [...this.products];
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
            this.filterProducts();
        }, 300);
    }

    filterProducts() {
        if (!this.searchTerm.trim()) {
            // If search term is empty, show all products
            this.filteredProducts = [...this.products];
            return;
        }

        const searchLower = this.searchTerm.toLowerCase().trim();

        this.filteredProducts = this.products.filter((item: any) => {
            const product = item.product || item;

            // Search in product code
            const productCode = (product.code || '').toLowerCase();
            if (productCode.includes(searchLower)) return true;

            // Search in product name
            const productName = (product.name || '').toLowerCase();
            if (productName.includes(searchLower)) return true;

            // Search in category name
            const categoryName = (product.category?.name || '').toLowerCase();
            if (categoryName.includes(searchLower)) return true;

            // Search in sub-category name
            const subCategoryName = (product.sub_category?.name || '').toLowerCase();
            if (subCategoryName.includes(searchLower)) return true;

            return false;
        });
    }

    clearSearch() {
        this.searchTerm = '';
        this.applyAllFilters();
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
    }

    // Filter management methods
    clearCategoryFilter() {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.applyAllFilters();
    }

    clearSubCategoryFilter() {
        this.selectedSubCategory = null;
        this.applyAllFilters();
    }

    clearAllFilters() {
        this.selectedCategory = null;
        this.selectedSubCategory = null;
        this.searchTerm = '';
        this.applyAllFilters();
        this.closeFilterModal();
    }

    applyFilters() {
        this.applyAllFilters();
        this.closeFilterModal();
    }

    // Combined filtering method
    applyAllFilters() {
        let filtered = [...this.products];

        // Apply text search filter
        if (this.searchTerm.trim()) {
            const searchLower = this.searchTerm.toLowerCase().trim();
            filtered = filtered.filter((item: any) => {
                const product = item.product || item;

                const productCode = (product.code || '').toLowerCase();
                const productName = (product.name || '').toLowerCase();
                const categoryName = (product.category?.name || '').toLowerCase();
                const subCategoryName = (product.sub_category?.name || '').toLowerCase();

                return productCode.includes(searchLower) ||
                    productName.includes(searchLower) ||
                    categoryName.includes(searchLower) ||
                    subCategoryName.includes(searchLower);
            });
        }

        // Apply category filter
        if (this.selectedCategory) {
            filtered = filtered.filter((item: any) => {
                const product = item.product || item;
                return product.category?.id === this.selectedCategory.id;
            });
        }

        // Apply sub-category filter
        if (this.selectedSubCategory) {
            filtered = filtered.filter((item: any) => {
                const product = item.product || item;
                return product.sub_category?.id === this.selectedSubCategory.id;
            });
        }

        this.filteredProducts = filtered;
    }

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
