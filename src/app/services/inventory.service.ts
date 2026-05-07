import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InventoryService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    // HO Stock
    getStock(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.branch)   params = params.set('branch',   filters.branch);
        if (filters?.product)  params = params.set('product',  filters.product);
        if (filters?.stock_in) params = params.set('stock_in', '1');
        return this.http.get(`${this.api}/inventory/stock`, { params });
    }
    getStockVariations(id: number): Observable<any> {
        return this.http.get(`${this.api}/inventory/stock/${id}/variations`);
    }

    // HO Transfer
    getTransfers(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.product) params = params.set('product', filters.product);
        if (filters?.branch)  params = params.set('branch',  filters.branch);
        return this.http.get(`${this.api}/inventory/transfer`, { params });
    }
    getTransferBill(id: number): Observable<any> {
        return this.http.get(`${this.api}/inventory/transfer/${id}/bill`);
    }
    getBranches(): Observable<any> {
        return this.http.get(`${this.api}/branches`);
    }
    getSubCategories(id?: string): Observable<any> {
        let params = new HttpParams();
        if (id) params = params.set('id', id);
        return this.http.get(`${this.api}/inventory/get_sub_category`, { params });
    }
    getProducts(category?: string, subCategory?: string): Observable<any> {
        let params = new HttpParams();
        if (category)    params = params.set('category',    category);
        if (subCategory) params = params.set('sub_category', subCategory);
        return this.http.get(`${this.api}/inventory/get_product`, { params });
    }
    getProductDetail(product: string): Observable<any> {
        return this.http.get(`${this.api}/inventory/get_product_detail`, { params: new HttpParams().set('product', product) });
    }
    storeTransfer(body: any): Observable<any> {
        return this.http.post(`${this.api}/inventory/transfer/store`, body);
    }

    // Branch Stock
    getBranchStock(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.product)  params = params.set('product',  filters.product);
        if (filters?.stock_in) params = params.set('stock_in', '1');
        return this.http.get(`${this.api}/branch/stock`, { params });
    }
    getBranchStockVariations(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/stock/${id}/variations`);
    }
    getBranchTransfers(filters?: any): Observable<any> {
        let params = new HttpParams();
        if (filters?.product) params = params.set('product', filters.product);
        if (filters?.branch)  params = params.set('branch',  filters.branch);
        return this.http.get(`${this.api}/branch/transfer`, { params });
    }
    getBranchTransferBill(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/transfer/${id}/bill`);
    }
    getBranchSubCategories(id?: string): Observable<any> {
        let params = new HttpParams();
        if (id) params = params.set('id', id);
        return this.http.get(`${this.api}/branch/get_sub_category`, { params });
    }
    getBranchProducts(category?: string, subCategory?: string): Observable<any> {
        let params = new HttpParams();
        if (category)    params = params.set('category',    category);
        if (subCategory) params = params.set('sub_category', subCategory);
        return this.http.get(`${this.api}/branch/get_product`, { params });
    }
    getBranchProductDetail(product: string): Observable<any> {
        return this.http.get(`${this.api}/branch/get_product_detail`, { params: new HttpParams().set('product', product) });
    }
    storeBranchTransfer(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/transfer/store`, body);
    }
}
