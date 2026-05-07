import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GstBillingService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    // HO
    getHoList(branch?: string): Observable<any> {
        let params = new HttpParams();
        if (branch) params = params.set('branch', branch);
        return this.http.get(`${this.api}/gst_bills`, { params });
    }
    getHoView(id: number): Observable<any> {
        return this.http.get(`${this.api}/gst_bills/${id}/view`);
    }
    getHoCreateData(): Observable<any> {
        return this.http.get(`${this.api}/gst_bills/create_data`);
    }
    getHoSubCategories(id: string): Observable<any> {
        return this.http.get(`${this.api}/gst_bills/get_sub_category`, { params: new HttpParams().set('id', id) });
    }
    getHoProducts(category: string, subCategory: string): Observable<any> {
        let params = new HttpParams().set('category', category).set('sub_category', subCategory);
        return this.http.get(`${this.api}/gst_bills/get_product`, { params });
    }
    storeHo(body: any): Observable<any> {
        return this.http.post(`${this.api}/gst_bills/store`, body);
    }
    bulkUpload(file: File): Observable<any> {
        const fd = new FormData();
        fd.append('file', file);
        return this.http.post(`${this.api}/gst_bills/bulk_upload`, fd);
    }

    // Branch
    getBranchList(): Observable<any> {
        return this.http.get(`${this.api}/branch/gst_bills`);
    }
    getBranchView(id: number): Observable<any> {
        return this.http.get(`${this.api}/branch/gst_bills/${id}/view`);
    }
    getBranchCreateData(): Observable<any> {
        return this.http.get(`${this.api}/branch/gst_bills/create_data`);
    }
    storeBranch(body: any): Observable<any> {
        return this.http.post(`${this.api}/branch/gst_bills/store`, body);
    }
}
