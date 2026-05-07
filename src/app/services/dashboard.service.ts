import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DashboardService {
    constructor(private http: HttpClient) {}

    getHoDashboard(fromDate?: string, toDate?: string): Observable<any> {
        let params = new HttpParams();
        if (fromDate) params = params.set('from_date', fromDate);
        if (toDate) params = params.set('to_date', toDate);
        return this.http.get(`${environment.apiBase}/dashboard`, { params });
    }

    getBranchDashboard(fromDate?: string, toDate?: string): Observable<any> {
        let params = new HttpParams();
        if (fromDate) params = params.set('from_date', fromDate);
        if (toDate) params = params.set('to_date', toDate);
        return this.http.get(`${environment.apiBase}/branch/dashboard`, { params });
    }
}
