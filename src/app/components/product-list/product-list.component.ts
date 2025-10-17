import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { AuthService } from '../../services/auth.service';
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

    constructor(private productService: ProductService, private auth: AuthService) { }

    ngOnInit() {
        this.fetchProducts();
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
