import { Component, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { environment } from '../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
@Component({
    selector: 'app-pdf-generator',
    standalone: true,
    imports: [],
    template: '', // No template needed as this is a service component
    styleUrls: ['./pdf-generator.component.scss']
})
export class PdfGeneratorComponent {
    private logoUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.jpg`;
    private user: any = null;
    private templateCache: string | null = null;

    constructor(
        private auth: AuthService,
        private toast: ToastService,
        private http: HttpClient
    ) {
        // Set up logo URL from user data
        this.auth.user$.subscribe(u => {
            this.user = u;
            const logoVal = u?.logo || u?.fav_icon || u?.logo_url || null;
            if (logoVal) {
                this.logoUrl = /^https?:\/\//i.test(logoVal) ? logoVal : `${environment.assetsBase.replace(/\/$/, '')}/${logoVal.replace(/^\//, '')}`;
            }
        });
    }

    async generateInvoicePdf(invoiceData: InvoiceData): Promise<void> {
        try {
            // Validate required data
            if (!invoiceData.customer) {
                this.toast.show('Customer information is required', 'error');
                return;
            }

            if (!invoiceData.staff) {
                this.toast.show('Staff information is required', 'error');
                return;
            }

            if (!invoiceData.items || invoiceData.items.length === 0) {
                this.toast.show('Cannot generate PDF for empty cart', 'error');
                return;
            }

            if (!invoiceData.payments || invoiceData.payments.length === 0) {
                this.toast.show('Payment information is required', 'error');
                return;
            }

            // Convert logo to base64 with timeout and fallback - Skip CORS-problematic URLs
            let logoBase64 = '';
            if (this.logoUrl && !this.isCorsProblematicUrl(this.logoUrl)) {
                try {
                    // Add a timeout for logo loading to prevent hanging
                    logoBase64 = await Promise.race([
                        this.convertImageToBase64(this.logoUrl),
                        new Promise<string>(resolve => setTimeout(() => resolve(''), 2000)) // 2 second timeout
                    ]);
                } catch (error) {
                    // Silent fallback - no console messages
                    logoBase64 = '';
                }
            }

            // Open print window
            const printWindow = window.open('', '_blank');
            if (!printWindow) {
                this.toast.show('Unable to open print window. Please check popup settings.', 'error');
                return;
            }

            // Generate HTML and display
            const html = await this.buildInvoiceHtml(invoiceData, logoBase64);
            printWindow.document.write(html);
            printWindow.document.close();

            // Wait for content to load then print
            printWindow.onload = function () {
                printWindow.focus();
                printWindow.print();
            };

            // Show success message
            this.toast.show('PDF generated successfully', 'success');

        } catch (error) {
            console.error('Error generating PDF:', error);
            this.toast.show('Error generating PDF', 'error');
        }
    }

    /**
     * Check if a URL is likely to cause CORS issues when loading from localhost
     */
    private isCorsProblematicUrl(url: string): boolean {
        if (!url) return false;

        // Skip external URLs that are likely to have CORS issues from localhost
        const corsProblematicDomains = [
            'test.slingbillings.com',
            'slingbillings.com',
            'api.slingbillings.com'
        ];

        return corsProblematicDomains.some(domain => url.includes(domain));
    }

    private convertImageToBase64(url: string): Promise<string> {
        return new Promise((resolve) => {
            if (!url) {
                resolve('');
                return;
            }

            // For CORS-problematic URLs, immediately return empty string
            if (this.isCorsProblematicUrl(url)) {
                resolve('');
                return;
            }

            // Try to load the image directly for non-problematic URLs
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            // Set crossOrigin to handle CORS issues
            img.crossOrigin = 'anonymous';

            img.onload = () => {
                try {
                    canvas.width = img.width;
                    canvas.height = img.height;
                    ctx?.drawImage(img, 0, 0);
                    const dataURL = canvas.toDataURL('image/png');
                    resolve(dataURL);
                } catch (error) {
                    // Silent fallback
                    resolve('');
                }
            };

            img.onerror = () => {
                // Silent fallback - no console messages or proxy attempts
                resolve('');
            };

            img.src = url;
        });
    }

    private async loadTemplate(): Promise<string> {
        if (this.templateCache) {
            return this.templateCache;
        }

        try {
            // Load the HTML template from the file
            const templatePath = './assets/templates/invoice-template.html';
            this.templateCache = await this.http.get(templatePath, { responseType: 'text' }).toPromise() || '';
            return this.templateCache;
        } catch (error) {
            console.error('Error loading template:', error);
            // Fallback to inline template if file loading fails
            return this.getInlineTemplate();
        }
    }

    private getInlineTemplate(): string {
        // Fallback inline template in case file loading fails
        return `
<!DOCTYPE html>
<html>
<head>
  <title>Invoice - {{customerName}}</title>
  <style>
    * { box-sizing: border-box; }
    body { 
      font-family: 'Arial', 'Helvetica', sans-serif; 
      padding: 0; margin: 0; color: #333; 
      background: white; line-height: 1.4;
    }
    .invoice-container { max-width: 800px; margin: 20px auto; background: white; border: 1px solid #ddd; }
    .header { background: #f8f9fa; border-bottom: 2px solid #333; padding: 30px; }
    .header-content { display: flex; align-items: center; gap: 25px; }
    .logo-container { width: 80px; height: 80px; border: 1px solid #ddd; display: flex; align-items: center; justify-content: center; overflow: hidden; }
    .logo { width: 70px; height: 70px; object-fit: cover; }
    .logo-fallback { width: 60px; height: 60px; background: #333; color: white; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; }
    .shop-info { flex: 1; }
    .shop-name { font-size: 24px; font-weight: 700; margin: 0 0 10px 0; color: #333; }
    .shop-details { font-size: 14px; margin: 5px 0; color: #666; }
    .shop-details strong { margin-right: 8px; color: #333; }
    .invoice-meta { position: absolute; top: 30px; right: 30px; text-align: right; }
    .invoice-title { font-size: 16px; font-weight: 600; color: #333; margin: 0; }
    .invoice-number { font-size: 20px; font-weight: 700; margin: 5px 0; color: #333; }
    .content { padding: 30px; }
    .customer-staff-row { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .info-card { border: 1px solid #ddd; padding: 20px; background: #f8f9fa; }
    .info-card h3 { margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: #333; border-bottom: 1px solid #ddd; padding-bottom: 8px; }
    .info-card .detail { font-size: 14px; margin: 8px 0; display: flex; justify-content: space-between; }
    .info-card .detail .label { font-weight: 600; color: #333; }
    .products-table, .payment-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #ddd; }
    .products-table th, .payment-table th { background: #333; color: white; padding: 15px 12px; font-weight: 600; text-align: left; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
    .products-table td, .payment-table td { padding: 12px; border-bottom: 1px solid #e0e0e0; font-size: 14px; }
    .products-table tbody tr:nth-child(even), .payment-table tbody tr:nth-child(even) { background: #f8f9fa; }
    .total-row { background: #333 !important; color: white !important; font-weight: 700; font-size: 16px; }
    .total-row td { padding: 18px 12px !important; border: none !important; }
    .payment-section { margin-top: 30px; }
    .section-title { font-size: 18px; font-weight: 700; color: #333; margin: 0 0 15px 0; padding-bottom: 8px; border-bottom: 2px solid #333; }
    .footer { background: #f8f9fa; border-top: 2px solid #333; text-align: center; padding: 25px; margin-top: 30px; }
    .footer h4 { margin: 0 0 10px 0; font-size: 16px; font-weight: 600; color: #333; }
    .footer p { margin: 5px 0; color: #666; font-size: 14px; }
    .right { text-align: right; }
    .center { text-align: center; }
    .currency { font-weight: 600; color: #333; }
    @media print { body { background: white; padding: 0; } .invoice-container { border: none; margin: 0; max-width: none; } }
    @media (max-width: 768px) { .customer-staff-row { grid-template-columns: 1fr; gap: 20px; } .header-content { flex-direction: column; text-align: center; } .invoice-meta { position: static; margin-top: 20px; } }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="header-content">
        <div class="logo-container">{{logoHtml}}</div>
        <div class="shop-info">
          <h1 class="shop-name">{{shopName}}</h1>
          {{shopPhoneHtml}}{{shopAddressHtml}}{{shopGstHtml}}
        </div>
      </div>
      <div class="invoice-meta">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">{{invoiceNumber}}</div>
        <div style="font-size: 12px; margin-top: 8px; color: #666;">{{currentDate}} • {{currentTime}}</div>
      </div>
    </div>
    <div class="content">
      <div class="customer-staff-row">
        <div class="info-card">
          <h3>Customer Information</h3>
          <div class="detail"><span class="label">Name:</span><span>{{customerName}}</span></div>
          {{customerPhoneHtml}}
        </div>
        <div class="info-card">
          <h3>Staff Information</h3>
          <div class="detail"><span class="label">Served by:</span><span>{{staffName}}</span></div>
          <div class="detail"><span class="label">Date:</span><span>{{currentDate}}</span></div>
        </div>
      </div>
      <h2 class="section-title">Products</h2>
      <table class="products-table">
        <thead><tr><th>Product</th><th style="text-align: center">Qty</th><th style="text-align: right">Price</th><th style="text-align: right">Total</th></tr></thead>
        <tbody>{{itemsHtml}}</tbody>
        <tfoot><tr class="total-row"><td colspan="3" class="right"><strong>TOTAL AMOUNT</strong></td><td class="right"><strong>₹{{totalAmount}}</strong></td></tr></tfoot>
      </table>
      <div class="payment-section">
        <h2 class="section-title">Payment Details</h2>
        <table class="payment-table">
          <thead><tr><th>Payment Method</th><th style="text-align: right">Amount</th><th>Details</th></tr></thead>
          <tbody>{{paymentsHtml}}</tbody>
        </table>
      </div>
    </div>
    <div class="footer">
      <h4>Thank you for your business!</h4>
      <p>We appreciate your trust and look forward to serving you again.</p>
      <p style="margin-top: 15px; font-size: 12px;">Generated on {{currentDate}} at {{currentTime}}</p>
    </div>
  </div>
</body>
</html>`;
    }

    private async buildInvoiceHtml(invoiceData: InvoiceData, logoBase64: string = ''): Promise<string> {
        // Load the HTML template
        let template = await this.loadTemplate();

        // Prepare data for template replacement
        const itemsHtml = invoiceData.items.map(i => `
            <tr>
                <td>${i.product?.name || i.product?.title || i.id}</td>
                <td style="text-align: center">${i.qty}</td>
                <td style="text-align: right">₹${Number(i.product?.price || 0).toFixed(2)}</td>
                <td style="text-align: right">₹${(Number(i.product?.price || 0) * i.qty).toFixed(2)}</td>
            </tr>
        `).join('');

        const staffName = invoiceData.staff?.name || invoiceData.staff?.full_name || '-';
        const customerName = invoiceData.customer?.name || 'Walk-in Customer';
        const customerPhone = invoiceData.customer?.phone || '';

        // Shop information from user data
        const shopName = this.user?.business_name || this.user?.name || 'Shop Name';
        const shopPhone = this.user?.phone || this.user?.mobile || '';
        const shopAddress = this.user?.user_detail?.address || this.user?.address || '';
        const shopGst = this.user?.user_detail?.gst_number || this.user?.gst_number || '';

        // Payment methods details
        const paymentsHtml = invoiceData.payments.map(payment => {
            const methodName = payment.method.name;
            const amount = `₹${Number(payment.amount || 0).toFixed(2)}`;
            let details = '';

            if (payment.method.name.toLowerCase() === 'finance') {
                details = `Ref: ${payment.financeRefNo || 'N/A'}, Finance: ${payment.selectedFinance?.name || 'N/A'}`;
            } else if (payment.method.name.toLowerCase() === 'card') {
                details = `Card: ${payment.cardNo || 'N/A'}, Name: ${payment.cardName || 'N/A'}`;
            } else if (payment.method.name.toLowerCase() === 'cheque') {
                details = `Cheque No: ${payment.chequeNo || 'N/A'}`;
            }

            return `
                <tr>
                    <td>${methodName}</td>
                    <td style="text-align: right">${amount}</td>
                    <td>${details}</td>
                </tr>
            `;
        }).join('');

        const currentDate = new Date().toLocaleDateString();
        const currentTime = new Date().toLocaleTimeString();

        // Prepare conditional HTML snippets
        const logoHtml = logoBase64 ?
            `<img src="${logoBase64}" alt="${shopName}" class="logo">` :
            `<div class="logo-fallback">${shopName.charAt(0)}</div>`;

        const shopPhoneHtml = shopPhone ? `<div class="shop-details"><strong>Phone:</strong> ${shopPhone}</div>` : '';
        const shopAddressHtml = shopAddress ? `<div class="shop-details"><strong>Address:</strong> ${shopAddress}</div>` : '';
        const shopGstHtml = shopGst ? `<div class="shop-details"><strong>GST No:</strong> ${shopGst}</div>` : '';
        const customerPhoneHtml = customerPhone ? `
            <div class="detail">
                <span class="label">Phone:</span>
                <span>${customerPhone}</span>
            </div>
        ` : '';

        // Replace template placeholders with actual data
        const replacements = {
            '{{customerName}}': customerName,
            '{{staffName}}': staffName,
            '{{shopName}}': shopName,
            '{{logoHtml}}': logoHtml,
            '{{shopPhoneHtml}}': shopPhoneHtml,
            '{{shopAddressHtml}}': shopAddressHtml,
            '{{shopGstHtml}}': shopGstHtml,
            '{{customerPhoneHtml}}': customerPhoneHtml,
            '{{invoiceNumber}}': `#INV-${Date.now().toString().slice(-6)}`,
            '{{currentDate}}': currentDate,
            '{{currentTime}}': currentTime,
            '{{itemsHtml}}': itemsHtml,
            '{{paymentsHtml}}': paymentsHtml,
            '{{totalAmount}}': invoiceData.total.toFixed(2)
        };

        // Apply all replacements
        Object.entries(replacements).forEach(([placeholder, value]) => {
            template = template.replace(new RegExp(placeholder, 'g'), value);
        });

        return template;
    }
}

// Interface for invoice data
export interface InvoiceData {
    customer: any;
    staff: any;
    items: any[];
    payments: any[];
    total: number;
}