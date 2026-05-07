import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class BranchOrdersService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    getOrders(search?: string): Observable<any> {
        let params = new HttpParams();
        if (search) params = params.set('order', search);
        return this.http.get(`${this.api}/branch/orders`, { params });
    }
    getRefundData(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/orders/${id}/refund_data`);
    }
    processRefund(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/orders/refund`, body);
    }
}
