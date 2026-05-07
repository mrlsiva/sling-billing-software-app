import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class CreditsService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    // HO
    getHoCredits(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.date)     params = params.set('date',     filters.date);
        if (filters?.customer) params = params.set('customer', filters.customer);
        return this.http.get(`${this.api}/ho/credits`, { params });
    }
    getHoCreditPayments(id: number): Observable<any> {
        return this.http.get(`${this.api}/ho/credits/${id}/payments`);
    }
    storeHoPayment(body: any): Observable<any> {
        return this.http.post(`${this.api}/ho/credits/payments/store`, body);
    }

    // Branch
    getBranchCredits(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.date)     params = params.set('date',     filters.date);
        if (filters?.customer) params = params.set('customer', filters.customer);
        return this.http.get(`${this.api}/branch/credits`, { params });
    }
    getBranchCreditPayments(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/credits/${id}/payments`);
    }
    storeBranchPayment(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/credits/payments/store`, body);
    }

    getPaymentList(): Observable<any> {
        return this.http.get(`${this.api}/payment_list`);
    }
}
