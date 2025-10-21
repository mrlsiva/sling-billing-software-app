import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { environment } from '../../../environments/environment';
import { Subscription } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
    selector: 'app-product-list',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './product-list.component.html',
    styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
    products: any[] = [];
    loading = false;
    error: string | null = null;
    username: string | null = null;
    userEmail: string | null = null;
    logoUrl: string | null = null;
    readonly placeholderUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.jpg`;
    private subs: Subscription | null = null;
    // previously used for inline expansion; removed when details page was deprecated

    constructor(private productService: ProductService, private auth: AuthService, private cart: CartService) { }

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
    }

    fetchProducts() {
        this.loading = true;
        this.error = null;

        this.productService.list().subscribe({
            next: (res: any) => {
                // adapt according to your API response structure
                this.products = res.data.data ?? res;
                // normalize quantities so templates can rely on a safe numeric value
                this.normalizeProductQuantities();
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Failed to load POS items';
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
}
