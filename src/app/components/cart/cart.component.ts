import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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

    constructor(public cart: CartService) {
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

    private showToast(msg: string) {
        this.toast = msg;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => { this.toast = ''; this.toastTimer = null; }, 2000);
    }
}
