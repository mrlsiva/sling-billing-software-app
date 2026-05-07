import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ReportsService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    private buildParams(filters: any): HttpParams {
        let params = new HttpParams();
        Object.keys(filters).forEach(k => { if (filters[k] !== '' && filters[k] != null) params = params.set(k, filters[k]); });
        return params;
    }

    // HO Reports
    getHoDaily(filters: any): Observable<any>   { return this.http.get(`${this.api}/reports/daily`,    { params: this.buildParams(filters) }); }
    getHoOrders(filters: any): Observable<any>  { return this.http.get(`${this.api}/reports/orders`,   { params: this.buildParams(filters) }); }
    getHoSales(filters: any): Observable<any>   { return this.http.get(`${this.api}/reports/sales`,    { params: this.buildParams(filters) }); }
    getHoPurchase(filters: any): Observable<any>{ return this.http.get(`${this.api}/reports/purchase`, { params: this.buildParams(filters) }); }
    getHoTransfer(filters: any): Observable<any>{ return this.http.get(`${this.api}/reports/transfer`, { params: this.buildParams(filters) }); }

    // Branch Reports
    getBranchDaily(filters: any): Observable<any>   { return this.http.get(`${this.api}/branch/reports/daily`,    { params: this.buildParams(filters) }); }
    getBranchOrders(filters: any): Observable<any>  { return this.http.get(`${this.api}/branch/reports/orders`,   { params: this.buildParams(filters) }); }
    getBranchSales(filters: any): Observable<any>   { return this.http.get(`${this.api}/branch/reports/sales`,    { params: this.buildParams(filters) }); }
    getBranchTransfer(filters: any): Observable<any>{ return this.http.get(`${this.api}/branch/reports/transfer`, { params: this.buildParams(filters) }); }
}
