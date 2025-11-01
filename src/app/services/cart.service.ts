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
        console.log('🛒 CartService.add called with product:', product);

        const id = String(product?.id ?? product?.product?.id ?? product?.product_id ?? product?.sku ?? '');
        if (!id) {
            console.log('🚫 No valid ID found for product');
            return;
        }

        // Check product quantity before adding - comprehensive check for all possible structures
        const quantities = [
            product?.quantity,
            product?.product?.quantity,
            product?.stock,
            product?.available_quantity,
            product?.qty,
            product?.product?.stock,
            product?.product?.qty
        ];

        console.log('🛒 All possible quantity values in CartService:', quantities);

        // Get the first valid number from the quantities array, default to 0
        const quantity = quantities.find(q => Number.isFinite(Number(q)) && Number(q) >= 0) || 0;
        const finalQuantity = Number(quantity);

        console.log('🛒 CartService.add validation:', {
            product,
            extractedQuantity: finalQuantity,
            allQuantities: quantities,
            isValid: Number.isFinite(finalQuantity) && finalQuantity > 0
        });

        if (!Number.isFinite(finalQuantity) || finalQuantity <= 0) {
            console.log('🚫 BLOCKED in CartService: Product has quantity:', finalQuantity);
            console.log('Cannot add product to cart: quantity is 0 or negative');
            return;
        }

        console.log('✅ ALLOWED in CartService: Adding product with quantity:', finalQuantity);

        const ex = this.items.find(i => i.id === id);
        if (ex) {
            ex.qty += 1;
            // emit the existing item as added
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
