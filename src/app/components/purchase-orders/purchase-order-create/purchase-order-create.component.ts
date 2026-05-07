import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { PurchaseOrderService } from '../../../services/purchase-order.service';
import { ToastService } from '../../../services/toast.service';
import { AmountPipe } from '../../../shared/pipes/amount.pipe';

interface ProductRow {
    category: string;
    subCategory: string;
    product: string;
    unit: string;
    qty: number;
    price: number;
    taxPercent: number;
    discount: number;
    netCost: number;
    grossCost: number;
    stock: number;
    categories: any[];
    subCategories: any[];
    products: any[];
    imeiType: boolean;
    imeiInput: string;
    imeis: string[];
    variations: any[];
}

@Component({
    selector: 'app-purchase-order-create',
    standalone: true,
    imports: [CommonModule, FormsModule, AmountPipe],
    templateUrl: './purchase-order-create.component.html',
    styleUrls: ['./purchase-order-create.component.scss']
})
export class PurchaseOrderCreateComponent implements OnInit {
    vendors: any[] = [];
    payments: any[] = [];
    loading = true;
    saving = false;

    header = { vendor_id: '', payment_id: '', invoice_no: '', invoice_date: '', due_date: '' };
    rows: ProductRow[] = [];
    errors: any = {};

    constructor(
        private svc: PurchaseOrderService,
        private toast: ToastService,
        private router: Router
    ) {}

    ngOnInit() {
        this.svc.getCreateData().subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                this.vendors = d?.vendors ?? [];
                this.payments = d?.payments ?? [];
                this.loading = false;
                this.addRow();
            },
            error: () => { this.loading = false; this.addRow(); }
        });
    }

    addRow() {
        this.svc.getCategories().subscribe({
            next: (res: any) => {
                const row: ProductRow = {
                    category: '', subCategory: '', product: '', unit: '',
                    qty: 1, price: 0, taxPercent: 0, discount: 0, netCost: 0, grossCost: 0,
                    stock: 0, categories: res?.data ?? res ?? [], subCategories: [],
                    products: [], imeiType: false, imeiInput: '', imeis: [], variations: []
                };
                this.rows.push(row);
            }
        });
    }

    removeRow(i: number) { this.rows.splice(i, 1); }

    onCategoryChange(row: ProductRow) {
        row.subCategory = ''; row.product = ''; row.subCategories = []; row.products = [];
        if (!row.category) return;
        const cat = row.categories.find((c: any) => c.id == row.category || c.name === row.category);
        row.subCategories = cat?.sub_categories ?? [];
    }

    onSubCategoryChange(row: ProductRow) {
        row.product = ''; row.products = [];
        if (!row.subCategory) return;
        this.svc.getProducts(row.category, row.subCategory).subscribe({
            next: (res: any) => { row.products = res?.data ?? res ?? []; }
        });
    }

    onProductChange(row: ProductRow) {
        if (!row.product) return;
        this.svc.getProductDetail(row.product).subscribe({
            next: (res: any) => {
                const d = res?.data ?? res;
                row.unit = d?.unit ?? d?.metric ?? '';
                row.taxPercent = parseFloat(d?.tax ?? d?.tax_percent ?? 0);
                row.imeiType = d?.type === 'imei' || d?.is_imei === 1;
                this.recalc(row);
            }
        });
        this.svc.getProductStock(row.product).subscribe({
            next: (res: any) => { row.stock = res?.data?.stock ?? res?.stock ?? 0; }
        });
        if (row.product) {
            this.svc.getStockVariations(+row.product).subscribe({
                next: (res: any) => { row.variations = res?.data ?? res ?? []; }
            });
        }
    }

    recalc(row: ProductRow) {
        row.netCost = row.qty * row.price;
        const tax = row.netCost * (row.taxPercent / 100);
        row.grossCost = row.netCost + tax - (row.discount || 0);
    }

    addImei(row: ProductRow) {
        const v = row.imeiInput.trim();
        if (!/^\d{15}$/.test(v)) { this.toast.show('IMEI must be exactly 15 digits', 'error'); return; }
        if (row.imeis.includes(v)) { this.toast.show('Duplicate IMEI', 'error'); return; }
        row.imeis.push(v); row.imeiInput = '';
    }

    removeImei(row: ProductRow, i: number) { row.imeis.splice(i, 1); }

    get grandTotal(): number { return this.rows.reduce((s, r) => s + r.grossCost, 0); }

    save() {
        this.errors = {};
        if (!this.header.vendor_id)   { this.errors.vendor_id = 'Vendor required'; return; }
        if (!this.header.invoice_no)  { this.errors.invoice_no = 'Invoice No required'; return; }
        if (!this.header.invoice_date){ this.errors.invoice_date = 'Invoice date required'; return; }
        if (this.rows.length === 0)   { this.toast.show('Add at least one product', 'error'); return; }

        const products = this.rows.map(r => ({
            category: r.category, sub_category: r.subCategory, product: r.product,
            unit: r.unit, quantity: r.qty, price_per_unit: r.price,
            tax_percent: r.taxPercent, discount: r.discount,
            net_cost: r.netCost, gross_cost: r.grossCost,
            imeis: r.imeis,
            variations: r.variations.filter((v: any) => v.transfer_qty > 0)
        }));

        this.saving = true;
        this.svc.store({ ...this.header, products, grand_total: this.grandTotal }).subscribe({
            next: () => {
                this.saving = false;
                this.toast.show('Purchase order created', 'success');
                this.router.navigate(['/purchase-orders']);
            },
            error: (err: any) => {
                this.saving = false;
                this.errors = err?.error?.errors ?? {};
                this.toast.show('Failed to create purchase order', 'error');
            }
        });
    }
}
