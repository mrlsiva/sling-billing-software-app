import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Subject } from 'rxjs';

export interface CartItem {
    id: string;
    product: any;
    qty: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
    private items: CartItem[] = [];
    private subj = new BehaviorSubject<CartItem[]>([]);
    cart$ = this.subj.asObservable();
    // emits when an item is added (passes the item)
    private addedSub = new Subject<CartItem>();
    added$ = this.addedSub.asObservable();

    constructor() {
        try {
            const raw = sessionStorage.getItem('app_cart');
            if (raw) this.items = JSON.parse(raw) as CartItem[];
        } catch { }
        this.emit();
    }

    private persist() {
        try { sessionStorage.setItem('app_cart', JSON.stringify(this.items)); } catch { }
    }

    private emit() {
        this.subj.next([...this.items]);
        this.persist();
    }

    add(product: any) {
        // Extract ID from either the product structure or the nested product
        const id = String(product?.product?.id ?? product?.id ?? product?.product_id ?? product?.sku ?? '');
        if (!id) return;

        // Check product quantity before adding - use original POS structure
        const quantity = Number(product?.quantity ?? product?.product?.quantity ?? 0);

        if (!Number.isFinite(quantity) || quantity <= 0) {
            console.log('Cannot add product to cart: quantity is 0 or negative');
            return;
        }

        const ex = this.items.find(i => i.id === id);
        if (ex) {
            ex.qty += 1;
            this.addedSub.next(ex);
        } else {
            this.items.push({ id, product, qty: 1 });
            this.addedSub.next({ id, product, qty: 1 });
        }
        this.emit();
    }

    increment(id: string) {
        const it = this.items.find(i => i.id === id);
        if (!it) return;

        // Check if we can increment based on available quantity
        const availableQuantity = it.product?.quantity ?? it.product?.product?.quantity ?? 0;

        if (it.qty >= availableQuantity) {
            console.log('Cannot increment: would exceed available quantity');
            return;
        }

        it.qty += 1;
        this.emit();
    }

    decrement(id: string) {
        const it = this.items.find(i => i.id === id);
        if (!it) return;
        it.qty -= 1;
        if (it.qty <= 0) this.remove(id); else this.emit();
    }

    remove(id: string) {
        this.items = this.items.filter(i => i.id !== id);
        this.emit();
    }

    clear() {
        this.items = [];
        this.emit();
    }

    totalItems(): number {
        return this.items.reduce((s, i) => s + i.qty, 0);
    }

    totalPrice(): number {
        return this.items.reduce((s, i) => s + (Number(i.product?.price ?? i.product?.product?.price ?? 0) * i.qty), 0);
    }
}
