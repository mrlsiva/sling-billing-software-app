import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InventoryService } from '../../services/inventory.service';
import { ToastService } from '../../services/toast.service';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';

@Component({
    selector: 'app-branch-stock',
    standalone: true,
    imports: [CommonModule, FormsModule, DateFormatPipe, AmountPipe, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './branch-stock.component.html',
    styleUrls: ['../inventory/inventory-shared.scss']
})
export class BranchStockComponent implements OnInit {
    activeTab: 'stock' | 'transfer' = 'stock';

    // Stock
    stockItems: any[] = []; stockLoading = true;
    stockFilters = { product: '', stock_in: false };
    variations: any[] = []; showVariations = false;

    // Transfer History
    transfers: any[] = []; transferLoading = true;
    transferFilters = { product: '', branch: '' };
    billItems: any[] = []; showBill = false;
    branches: any[] = [];

    // Create Transfer
    showCreatePanel = false; saving = false;
    transferTo: '1' | '2' = '2';
    categories: any[] = []; subCategories: any[] = []; products: any[] = [];
    productDetail: any = null; selectedImeis: string[] = [];
    createForm = { branch_id: '', category: '', sub_category: '', product: '', quantity: 1 };

    constructor(private svc: InventoryService, private toast: ToastService) {}

    ngOnInit() {
        this.loadStock();
        this.loadTransfers();
        this.loadBranches();
        this.loadCategories();
    }

    loadBranches() { this.svc.getBranches().subscribe({ next: (r: any) => { this.branches = r?.data ?? r ?? []; } }); }

    loadCategories() {
        this.svc.getBranchSubCategories().subscribe({ next: (r: any) => { this.categories = r?.data ?? r ?? []; } });
    }

    loadStock() {
        this.stockLoading = true;
        this.svc.getBranchStock(this.stockFilters).subscribe({
            next: (r: any) => { this.stockItems = r?.data?.data ?? r?.data ?? r ?? []; this.stockLoading = false; },
            error: () => { this.stockLoading = false; }
        });
    }

    viewVariations(item: any) {
        this.variations = []; this.showVariations = true;
        this.svc.getBranchStockVariations(item.id).subscribe({ next: (r: any) => { this.variations = r?.data ?? r ?? []; } });
    }

    loadTransfers() {
        this.transferLoading = true;
        this.svc.getBranchTransfers(this.transferFilters).subscribe({
            next: (r: any) => { this.transfers = r?.data?.data ?? r?.data ?? r ?? []; this.transferLoading = false; },
            error: () => { this.transferLoading = false; }
        });
    }

    viewBill(t: any) {
        this.billItems = []; this.showBill = true;
        this.svc.getBranchTransferBill(t.id).subscribe({ next: (r: any) => { this.billItems = r?.data?.products ?? r?.data ?? r ?? []; } });
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
        this.svc.getBranchProducts(this.createForm.category, this.createForm.sub_category).subscribe({
            next: (r: any) => { this.products = r?.data ?? r ?? []; }
        });
    }

    onProductChange() {
        this.productDetail = null; this.selectedImeis = [];
        if (!this.createForm.product) return;
        this.svc.getBranchProductDetail(this.createForm.product).subscribe({
            next: (r: any) => { this.productDetail = r?.data ?? r; }
        });
    }

    toggleImei(imei: string) {
        const idx = this.selectedImeis.indexOf(imei);
        if (idx >= 0) this.selectedImeis.splice(idx, 1); else this.selectedImeis.push(imei);
    }

    saveTransfer() {
        this.saving = true;
        const body = {
            ...this.createForm,
            transfer_to: this.transferTo,
            imeis: this.selectedImeis,
            variations: this.productDetail?.variations?.filter((v: any) => v.transfer_qty > 0) ?? []
        };
        this.svc.storeBranchTransfer(body).subscribe({
            next: () => { this.saving = false; this.showCreatePanel = false; this.toast.show('Transfer created', 'success'); this.loadTransfers(); },
            error: () => { this.saving = false; this.toast.show('Transfer failed', 'error'); }
        });
    }
}
