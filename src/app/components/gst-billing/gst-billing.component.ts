import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { GstBillingService } from '../../services/gst-billing.service';
import { ToastService } from '../../services/toast.service';
import { AmountPipe } from '../../shared/pipes/amount.pipe';
import { DateFormatPipe } from '../../shared/pipes/date-format.pipe';
import { SkeletonLoaderComponent } from '../../shared/components/skeleton-loader/skeleton-loader.component';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-gst-billing',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe, DateFormatPipe, SkeletonLoaderComponent, EmptyStateComponent],
    templateUrl: './gst-billing.component.html',
    styleUrls: ['../inventory/inventory-shared.scss']
})
export class GstBillingComponent implements OnInit {
    isHo: boolean = false;
    bills: any[] = []; branches: any[] = []; loading = true;
    selectedBranch = '0';
    showViewModal = false; viewBill: any = null; viewItems: any[] = [];
    showCreateModal = false; saving = false;
    categories: any[] = []; subCategories: any[] = []; products: any[] = [];
    bulkFile: File | null = null; bulkResult: any = null;

    form: any = { branch_id: '', order_id: '', reference_no: '', date_time: '', issued_by: '', sold_by: '',
        customer_name: '', phone: '', address: '', category: '', sub_category: '', product_id: '',
        imei: '', item_code: '', quantity: 1, gross_amount: '' };

    constructor(private svc: GstBillingService, private toast: ToastService, private auth: AuthService, private router: Router) {}

    ngOnInit() {
        this.isHo = this.auth.isHO();
        this.loadCreateData();
        this.load();
    }

    load() {
        this.loading = true;
        const obs = this.isHo ? this.svc.getHoList(this.selectedBranch) : this.svc.getBranchList();
        obs.subscribe({
            next: (r: any) => {
                const d = r?.data ?? r;
                this.bills = d?.data ?? d?.bills ?? (Array.isArray(d) ? d : []);
                this.branches = d?.branches ?? [];
                this.loading = false;
            },
            error: () => { this.loading = false; }
        });
    }

    loadCreateData() {
        const obs = this.isHo ? this.svc.getHoCreateData() : this.svc.getBranchCreateData();
        obs.subscribe({ next: (r: any) => { this.categories = r?.data?.categories ?? r?.categories ?? []; } });
    }

    onCategoryChange() {
        this.subCategories = []; this.products = []; this.form.sub_category = ''; this.form.product_id = '';
        if (!this.form.category) return;
        const cat = this.categories.find((c: any) => c.id == this.form.category);
        this.subCategories = cat?.sub_categories ?? [];
    }

    onSubCategoryChange() {
        this.products = []; this.form.product_id = '';
        if (!this.form.sub_category) return;
        const obs = this.isHo
            ? this.svc.getHoProducts(this.form.category, this.form.sub_category)
            : this.svc.getHoProducts(this.form.category, this.form.sub_category);
        obs.subscribe({ next: (r: any) => { this.products = r?.data ?? r ?? []; } });
    }

    viewBillModal(bill: any) {
        this.viewBill = bill; this.viewItems = []; this.showViewModal = true;
        const obs = this.isHo ? this.svc.getHoView(bill.id) : this.svc.getBranchView(bill.id);
        obs.subscribe({ next: (r: any) => { this.viewItems = r?.data?.items ?? r?.data ?? []; } });
    }

    save() {
        this.saving = true;
        const obs = this.isHo ? this.svc.storeHo(this.form) : this.svc.storeBranch(this.form);
        obs.subscribe({
            next: () => { this.saving = false; this.showCreateModal = false; this.toast.show('GST bill created', 'success'); this.load(); },
            error: () => { this.saving = false; this.toast.show('Failed to create', 'error'); }
        });
    }

    onFileChange(e: Event) { this.bulkFile = (e.target as HTMLInputElement).files?.[0] ?? null; }

    uploadBulk() {
        if (!this.bulkFile) return;
        this.svc.bulkUpload(this.bulkFile).subscribe({
            next: (r: any) => { this.bulkResult = r?.data ?? r; this.toast.show('Upload complete', 'success'); this.load(); },
            error: () => this.toast.show('Upload failed', 'error')
        });
    }
}
