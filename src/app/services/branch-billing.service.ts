import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BranchBillingService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    getProducts(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.category)     params = params.set('category',     filters.category);
        if (filters?.sub_category) params = params.set('sub_category', filters.sub_category);
        if (filters?.product)      params = params.set('product',      filters.product);
        if (filters?.filter)       params = params.set('filter',       filters.filter);
        return this.http.get(`${this.api}/branch/billing/get_product`, { params });
    }
    getSubCategories(id: string): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/get_sub_category`, { params: new HttpParams().set('id', id) });
    }
    getProductDetail(id: string): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/get_product_detail`, { params: new HttpParams().set('id', id) });
    }
    getImeiProduct(product: string): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/get_imei_product`, { params: new HttpParams().set('product', product) });
    }
    suggestPhone(phone: string): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/suggest_phone`, { params: new HttpParams().set('phone', phone) });
    }
    getCustomerDetail(phone: string): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/get_customer_detail`, { params: new HttpParams().set('phone', phone) });
    }
    storeCustomer(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/billing/customer_store`, body);
    }
    placeOrder(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/billing/store`, body);
    }
    getBill(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/billing/${id}/get_bill`);
    }
}
