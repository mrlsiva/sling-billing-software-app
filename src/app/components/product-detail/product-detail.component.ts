import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
    selector: 'app-product-detail',
    standalone: true,
    imports: [CommonModule],
    styleUrls: ['./product-detail.component.scss'],
    template: `
        <div style="margin:1rem 0;">
            <button (click)="goBack()">← Back</button>
        </div>

        <div *ngIf="loading">Loading...</div>
        <div *ngIf="error">{{ error }}</div>

        <div *ngIf="product">
            <h2 class="pd-title">Product: {{ product.unique_id || product.unique_number || ('#' + product.id) }}</h2>
            <p class="pd-meta"><strong>Name / ID:</strong> {{ product.name || product.unique_id || product.id }}</p>
            <p class="pd-meta"><strong>Status:</strong> {{ product.status }}</p>
            <p class="pd-meta"><strong>Created:</strong> {{ product.created_at }}</p>
            <p *ngIf="product.description" class="pd-desc"><strong>Description:</strong> {{ product.description }}</p>

                    <section *ngIf="product.details?.length" class="pd-details">
                        <h3>Details</h3>
                        <div class="pd-detail-list">
                            <div *ngFor="let d of product.details" class="pd-detail-item">
                                            <div class="pd-detail-image">
                                                <img *ngIf="imgUrl(d)" [src]="imgUrl(d)" alt="detail-image" class="pd-img" />
                                                <img *ngIf="!imgUrl(d)" [src]="placeholder" alt="no-image" class="pd-img placeholder" />
                                            </div>
                                <div class="pd-detail-body">
                                    <div><strong>ID:</strong> {{ d.id }}</div>
                                    <div><strong>Category:</strong> {{ d.category_id }}</div>
                                    <div><strong>Gender:</strong> {{ d.gender_id }}</div>
                                    <div><strong>Age:</strong> {{ d.age }} {{ d.age_type }}</div>
                                    <div *ngIf="d.details_text"><strong>Details:</strong> {{ d.details_text }}</div>
                                </div>
                            </div>
                        </div>
                    </section>

            <pre *ngIf="!product.details?.length">{{ product | json }}</pre>
        </div>
        `
})
export class ProductDetailComponent implements OnInit {
    product: any = null;
    loading = false;
    error: string | null = null;
    readonly placeholder = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="120" height="80" viewBox="0 0 120 80"><rect width="120" height="80" fill="%23f3f3f3"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-size="12">No image</text></svg>';

    constructor(private route: ActivatedRoute, private productService: ProductService) { }

    goBack() {
        try { history.back(); } catch { /* noop */ }
    }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (!id) { this.error = 'No product id'; return; }
        this.fetch(id);
    }

    fetch(id: string) {
        this.loading = true;
        this.productService.getById(id).subscribe({
            next: (res: any) => {
                // adapt: API may return { data: product } or product directly
                this.product = res?.data ?? res;
                this.loading = false;
            },
            error: (err) => {
                // prefer server message, then JS Error message, then fallback string
                this.error = err?.error?.message || err?.message || 'Failed to load product';
                this.loading = false;
            }
        });
    }

    imgUrl(d: any): string | null {
        if (!d) return null;
        // prefer explicit image field, but if the API stores filename in another key try common keys
        const img = d.image || d.file || d.image_path || d.photo || null;
        return this.productService.resolveImageUrl(img);
    }
}
