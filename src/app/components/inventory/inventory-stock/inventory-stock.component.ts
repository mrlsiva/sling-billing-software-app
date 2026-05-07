import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-inventory-stock',
    standalone: true,
    imports: [CommonModule, FormsModule, SkeletonLoaderComponent, EmptyStateComponent],
    template: `
    <div class="page">
        <div class="page-header">
            <h2 class="page-title"><i class="fa fa-boxes"></i> Inventory Stock</h2>
        </div>
        <div class="filter-row">
            <select [(ngModel)]="filters.branch" (change)="load()">
                <option value="0">All Branches</option>
                <option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</option>
            </select>
            <input type="text" [(ngModel)]="filters.product" placeholder="Search product..." (keyup.enter)="load()" />
            <label class="toggle-label">
                <input type="checkbox" [(ngModel)]="filters.stock_in" (change)="load()" /> In Stock Only
            </label>
            <button class="btn-apply" (click)="load()"><i class="fa fa-search"></i> Apply</button>
        </div>
        <div class="section-card">
            <app-skeleton-loader *ngIf="loading" type="table" [count]="8"></app-skeleton-loader>
            <div class="table-responsive" *ngIf="!loading && items.length > 0">
                <table class="dt">
                    <thead><tr><th>Category</th><th>Sub-Category</th><th>Product</th><th class="tr">Qty</th><th class="tr">IMEI Count</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr *ngFor="let item of items">
                            <td>{{ item.product?.category?.name ?? item.category?.name ?? item.category ?? '-' }}</td>
                            <td>{{ item.product?.sub_category?.name ?? item.sub_category?.name ?? item.sub_category ?? '-' }}</td>
                            <td>{{ item.product?.name ?? item.product_name ?? '-' }}</td>
                            <td class="tr">{{ item.quantity ?? item.qty ?? 0 }}</td>
                            <td class="tr">{{ item.imei_count ?? (item.imei ? 1 : 0) }}</td>
                            <td><button class="btn-icon" (click)="viewVariations(item)"><i class="fa fa-eye"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <app-empty-state *ngIf="!loading && items.length === 0" title="No stock found"></app-empty-state>
        </div>
        <!-- Variations Modal -->
        <div class="modal-overlay" *ngIf="showVariations" (click)="$event.target === $event.currentTarget && (showVariations = false)">
            <div class="modal-box">
                <div class="modal-header"><h3>Variations</h3><button (click)="showVariations = false"><i class="fa fa-times"></i></button></div>
                <div class="modal-body">
                    <table class="dt" *ngIf="variations.length > 0">
                        <thead><tr><th>Size</th><th>Colour</th><th class="tr">Qty</th><th class="tr">Price</th></tr></thead>
                        <tbody>
                            <tr *ngFor="let v of variations">
                                <td>{{ v.size ?? '-' }}</td><td>{{ v.colour ?? '-' }}</td>
                                <td class="tr">{{ v.quantity ?? v.qty }}</td><td class="tr">₹ {{ v.price ?? 0 }}</td>
                            </tr>
                        </tbody>
                    </table>
                    <p *ngIf="variations.length === 0" class="text-muted">No variations.</p>
                </div>
            </div>
        </div>
    </div>`,
    styleUrls: ['../inventory-shared.scss']
})
export class InventoryStockComponent implements OnInit {
    items: any[] = []; branches: any[] = []; variations: any[] = [];
    loading = true; showVariations = false;
    filters = { branch: '0', product: '', stock_in: false };

    constructor(private svc: InventoryService) {}
    ngOnInit() { this.loadBranches(); this.load(); }

    loadBranches() { this.svc.getBranches().subscribe({ next: (r: any) => { this.branches = r?.data ?? r ?? []; } }); }

    load() {
        this.loading = true;
        this.svc.getStock(this.filters).subscribe({
            next: (r: any) => { this.items = r?.data?.data ?? r?.data ?? r ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    viewVariations(item: any) {
        this.variations = [];
        this.showVariations = true;
        this.svc.getStockVariations(item.id).subscribe({ next: (r: any) => { this.variations = r?.data ?? r ?? []; } });
    }
}
