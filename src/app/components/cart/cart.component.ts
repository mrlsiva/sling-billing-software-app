import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
    selector: 'app-cart',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent {
    open = false;
    items: any[] = [];
    toast = '';
    toastTimer: any = null;
    pulse = false;

    constructor(public cart: CartService, private router: Router) {
        this.cart.cart$.subscribe(i => {
            this.items = i;
            // auto-close when cart becomes empty
            if (!this.items || this.items.length === 0) {
                this.open = false;
            }
        });

        // open panel when a new item is added and show a brief toast
        this.cart.added$.subscribe(() => {
            if (this.cart.totalItems() > 0) {
                this.open = true;
                this.pulse = true;
                setTimeout(() => this.pulse = false, 350);
                this.showToast('Added to cart');
            }
        });
    }

    /**
     * Safely compute tax percentage for a cart item.
     * If price is zero or invalid, returns null.
     */
    taxPercent(item: any): number | null {
        try {
            const product = item.product || {};
            const priceRaw = product.price ?? product.selling_price ?? 0;
            const taxRaw = product.tax_amount ?? product.taxAmount ?? item.tax_amount ?? 0;
            const price = Number(priceRaw) || 0;
            const tax = Number(taxRaw) || 0;
            if (price <= 0 || tax <= 0) return null;
            const pct = (tax / price) * 100;
            // round to 2 decimals
            return Math.round(pct * 100) / 100;
        } catch (e) {
            return null;
        }
    }

    toggle() {
        if (!this.items?.length) {
            this.showToast('No items available in cart');
            return;
        }
        this.open = !this.open;
    }
    close() { this.open = false; }

    inc(id: string) { this.cart.increment(id); }
    dec(id: string) { this.cart.decrement(id); }
    del(id: string) { this.cart.remove(id); }
    clear() { this.cart.clear(); }

    goToCheckout() {
        if (!this.items?.length) {
            this.showToast('Cart is empty');
            return;
        }
        this.router.navigate(['/checkout']);
    }

    private showToast(msg: string) {
        this.toast = msg;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => { this.toast = ''; this.toastTimer = null; }, 2000);
    }
}
