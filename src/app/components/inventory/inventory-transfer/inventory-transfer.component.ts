import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../../services/inventory.service';
import { ToastService } from '../../../services/toast.service';
import { DateFormatPipe } from '../../../shared/pipes/date-format.pipe';
import { SkeletonLoaderComponent } from '../../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../../shared/components/empty-state/empty-state.component';
import { AmountPipe } from '../../../shared/pipes/amount.pipe';

@Component({
    selector: 'app-inventory-transfer',
    standalone: true,
    imports: [CommonModule, FormsModule, DateFormatPipe, AmountPipe, SkeletonLoaderComponent, EmptyStateComponent],
    template: `
    <div class="page">
        <div class="page-header">
            <h2 class="page-title"><i class="fa fa-exchange-alt"></i> Stock Transfers</h2>
            <button class="btn-primary" (click)="showCreatePanel = true"><i class="fa fa-plus"></i> Create Transfer</button>
        </div>
        <!-- Filters -->
        <div class="filter-row">
            <select [(ngModel)]="filters.branch" (change)="load()">
                <option value="">All Branches</option>
                <option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</option>
            </select>
            <input type="text" [(ngModel)]="filters.product" placeholder="Search product..." (keyup.enter)="load()" />
            <button class="btn-apply" (click)="load()"><i class="fa fa-search"></i> Apply</button>
        </div>
        <!-- Transfer List -->
        <div class="section-card">
            <app-skeleton-loader *ngIf="loading" type="table" [count]="6"></app-skeleton-loader>
            <div class="table-responsive" *ngIf="!loading && transfers.length > 0">
                <table class="dt">
                    <thead><tr><th>Invoice</th><th>From</th><th>To</th><th>Date</th><th>Actions</th></tr></thead>
                    <tbody>
                        <tr *ngFor="let t of transfers">
                            <td><strong>{{ t.invoice ?? t.invoice_no ?? '-' }}</strong></td>
                            <td>{{ t.from ?? t.from_branch }}</td>
                            <td>{{ t.to ?? t.to_branch }}</td>
                            <td>{{ t.created_at | dateFormat }}</td>
                            <td><button class="btn-icon" (click)="viewBill(t)"><i class="fa fa-eye"></i></button></td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <app-empty-state *ngIf="!loading && transfers.length === 0" title="No transfers found"></app-empty-state>
        </div>
    </div>

    <!-- Create Transfer Panel -->
    <div class="slide-overlay" *ngIf="showCreatePanel" (click)="$event.target === $event.currentTarget && (showCreatePanel = false)">
        <div class="slide-panel">
            <div class="panel-header">
                <h3>Create Transfer</h3>
                <button (click)="showCreatePanel = false"><i class="fa fa-times"></i></button>
            </div>
            <div class="panel-body">
                <div class="form-group">
                    <label>Branch</label>
                    <select [(ngModel)]="createForm.branch_id">
                        <option value="">Select branch</option>
                        <option *ngFor="let b of branches" [value]="b.id">{{ b.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Category</label>
                    <select [(ngModel)]="createForm.category" (change)="onCategoryChange()">
                        <option value="">Select</option>
                        <option *ngFor="let c of categories" [value]="c.id">{{ c.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Sub-Category</label>
                    <select [(ngModel)]="createForm.sub_category" (change)="onSubCategoryChange()">
                        <option value="">Select</option>
                        <option *ngFor="let s of subCategories" [value]="s.id">{{ s.name }}</option>
                    </select>
                </div>
                <div class="form-group">
                    <label>Product</label>
                    <select [(ngModel)]="createForm.product" (change)="onProductChange()">
                        <option value="">Select</option>
                        <option *ngFor="let p of products" [value]="p.id">{{ p.name }}</option>
                    </select>
                </div>
                <ng-container *ngIf="productDetail">
                    <div class="stock-info">Available: <strong>{{ productDetail.stock ?? productDetail.quantity ?? 0 }}</strong></div>
                    <div class="form-group">
                        <label>Quantity</label>
                        <input type="number" [(ngModel)]="createForm.quantity" min="1" />
                    </div>
                    <!-- IMEI list -->
                    <div *ngIf="productDetail.imeis?.length">
                        <label style="font-size:12px;font-weight:600;color:#555">Select IMEIs</label>
                        <div class="imei-check-list">
                            <label *ngFor="let imei of productDetail.imeis" class="imei-check">
                                <input type="checkbox" [value]="imei" (change)="toggleImei(imei)" /> {{ imei }}
                            </label>
                        </div>
                    </div>
                    <!-- Variations -->
                    <div *ngIf="productDetail.variations?.length">
                        <label style="font-size:12px;font-weight:600;color:#555;margin-top:10px;display:block">Variations</label>
                        <table class="dt" style="margin-top:6px">
                            <thead><tr><th>Size</th><th>Colour</th><th>Qty</th><th>Transfer Qty</th></tr></thead>
                            <tbody>
                                <tr *ngFor="let v of productDetail.variations">
                                    <td>{{ v.size ?? '-' }}</td><td>{{ v.colour ?? '-' }}</td>
                                    <td>{{ v.quantity ?? 0 }}</td>
                                    <td><input type="number" [(ngModel)]="v.transfer_qty" min="0" style="width:60px;padding:3px 6px;border:1px solid #ddd;border-radius:5px;font-size:12px" /></td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ng-container>
            </div>
            <div class="panel-footer">
                <button class="btn-secondary" (click)="showCreatePanel = false">Cancel</button>
                <button class="btn-primary" (click)="saveTransfer()" [disabled]="saving">
                    {{ saving ? 'Saving...' : 'Create Transfer' }}
                </button>
            </div>
        </div>
    </div>

    <!-- Bill Modal -->
    <div class="modal-overlay" *ngIf="showBill" (click)="$event.target === $event.currentTarget && (showBill = false)">
        <div class="modal-box">
            <div class="modal-header"><h3>Transfer Bill</h3><button (click)="showBill = false"><i class="fa fa-times"></i></button></div>
            <div class="modal-body">
                <table class="dt" *ngIf="billItems.length > 0">
                    <thead><tr><th>Product</th><th class="tr">Qty</th><th class="tr">Value</th></tr></thead>
                    <tbody>
                        <tr *ngFor="let b of billItems">
                            <td>{{ b.product ?? b.product_name }}</td>
                            <td class="tr">{{ b.quantity ?? b.qty }}</td>
                            <td class="tr">{{ (b.value ?? b.amount ?? 0) | amount }}</td>
                        </tr>
                    </tbody>
                </table>
                <p *ngIf="billItems.length === 0" class="text-muted">No items.</p>
            </div>
        </div>
    </div>`,
    styleUrls: ['../inventory-shared.scss']
})
export class InventoryTransferComponent implements OnInit {
    transfers: any[] = []; branches: any[] = []; categories: any[] = [];
    subCategories: any[] = []; products: any[] = []; productDetail: any = null;
    billItems: any[] = [];
    loading = true; showCreatePanel = false; showBill = false; saving = false;
    filters = { branch: '', product: '' };
    createForm = { branch_id: '', category: '', sub_category: '', product: '', quantity: 1 };
    selectedImeis: string[] = [];

    constructor(private svc: InventoryService, private toast: ToastService) {}
    ngOnInit() { this.loadBranches(); this.loadCategories(); this.load(); }

    loadBranches() { this.svc.getBranches().subscribe({ next: (r: any) => { this.branches = r?.data ?? r ?? []; } }); }
    loadCategories() { this.svc.getSubCategories().subscribe({ next: (r: any) => { this.categories = r?.data ?? r ?? []; } }); }

    load() {
        this.loading = true;
        this.svc.getTransfers(this.filters).subscribe({
            next: (r: any) => { this.transfers = r?.data?.data ?? r?.data ?? r ?? []; this.loading = false; },
            error: () => { this.loading = false; }
        });
    }

    onCategoryChange() {
        this.subCategories = []; this.products = []; this.createForm.sub_category = ''; this.createForm.product = '';
        if (!this.createForm.category) return;
        const cat = this.categories.find((c: any) => c.id == this.createForm.category);
        this.subCategories = cat?.sub_categories ?? [];
    }

    onSubCategoryChange() {
        this.products = []; this.createForm.product = '';
        if (!this.createForm.sub_category) return;
        this.svc.getProducts(this.createForm.category, this.createForm.sub_category).subscribe({
            next: (r: any) => { this.products = r?.data ?? r ?? []; }
        });
    }

    onProductChange() {
        this.productDetail = null; this.selectedImeis = [];
        if (!this.createForm.product) return;
        this.svc.getProductDetail(this.createForm.product).subscribe({
            next: (r: any) => { this.productDetail = r?.data ?? r; }
        });
    }

    toggleImei(imei: string) {
        const idx = this.selectedImeis.indexOf(imei);
        if (idx >= 0) this.selectedImeis.splice(idx, 1); else this.selectedImeis.push(imei);
    }

    viewBill(t: any) {
        this.billItems = []; this.showBill = true;
        this.svc.getTransferBill(t.id).subscribe({ next: (r: any) => { this.billItems = r?.data?.products ?? r?.data ?? r ?? []; } });
    }

    saveTransfer() {
        this.saving = true;
        const body = {
            ...this.createForm,
            imeis: this.selectedImeis,
            variations: this.productDetail?.variations?.filter((v: any) => v.transfer_qty > 0) ?? []
        };
        this.svc.storeTransfer(body).subscribe({
            next: () => { this.saving = false; this.showCreatePanel = false; this.toast.show('Transfer created', 'success'); this.load(); },
            error: () => { this.saving = false; this.toast.show('Transfer failed', 'error'); }
        });
    }
}
