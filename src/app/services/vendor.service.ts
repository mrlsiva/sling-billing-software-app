import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class VendorService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    getLedger(vendorId: number, filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.from_date) params = params.set('from_date', filters.from_date);
        if (filters?.to_date)   params = params.set('to_date',   filters.to_date);
        if (filters?.search)    params = params.set('search',    filters.search);
        return this.http.get(`${this.api}/vendors/${vendorId}/ledger`, { params });
    }

    getPayments(vendorId: number): Observable<any> {
        return this.http.get(`${this.api}/vendors/${vendorId}/payments`);
    }

    storePayment(body: any): Observable<any> {
        return this.http.post(`${this.api}/vendors/payments/store`, body);
    }

    getPaymentList(): Observable<any> {
        return this.http.get(`${this.api}/payment_list`);
    }

    updatePurchaseOrder(body: any): Observable<any> {
        return this.http.post(`${this.api}/purchase_orders/update`, body);
    }

    refundPurchaseOrder(body: any): Observable<any> {
        return this.http.post(`${this.api}/purchase_orders/refund`, body);
    }
}
