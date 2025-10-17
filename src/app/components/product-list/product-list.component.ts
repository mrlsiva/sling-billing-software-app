import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
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
    private subs: Subscription | null = null;

    constructor(private productService: ProductService, private auth: AuthService) { }

    ngOnInit() {
        // subscribe to reactive user updates
        this.subs = this.auth.user$.subscribe(u => {
            this.username = u?.name || u?.full_name || u?.username || null;
            this.userEmail = u?.email || u?.email_address || null;
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
                this.products = res.data ?? res;
                this.loading = false;
            },
            error: (err) => {
                this.error = err?.error?.message || 'Failed to load products';
                this.loading = false;
            }
        });
    }

    logout() {
        this.auth.logout().subscribe({
            error: () => this.auth.clearSession()
        });
    }
}
