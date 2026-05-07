import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PurchaseOrderService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    list(vendor?: string): Observable<any> {
        let params = new HttpParams();
        if (vendor) params = params.set('vendor', vendor);
        return this.http.get(`${this.api}/purchase_orders`, { params });
    }

    getDetail(id: number): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/${id}/detail`);
    }

    getCreateData(): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/create_data`);
    }

    getCategories(): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/get_categories`);
    }

    getProducts(category?: string, subCategory?: string): Observable<any> {
        let params = new HttpParams();
        if (category)    params = params.set('category', category);
        if (subCategory) params = params.set('sub_category', subCategory);
        return this.http.get(`${this.api}/purchase_orders/get_product`, { params });
    }

    getProductDetail(product: string): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/get_product_detail`, { params: new HttpParams().set('product', product) });
    }

    getProductStock(product: string): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/get_product_stock`, { params: new HttpParams().set('product', product) });
    }

    getStockVariations(productId: number): Observable<any> {
        return this.http.get(`${this.api}/purchase_orders/get_stock_variations`, { params: new HttpParams().set('product_id', productId.toString()) });
    }

    store(body: any): Observable<any> {
        return this.http.post(`${this.api}/purchase_orders/store`, body);
    }
}
