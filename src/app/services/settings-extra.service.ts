import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class SettingsExtraService {
    private api = environment.apiBase;
    constructor(private http: HttpClient) {}

    // Sizes
    getSizes(search?: string): Observable<any> {
        let params = new HttpParams();
        if (search) params = params.set('size', search);
        return this.http.get(`${this.api}/sizes`, { params });
    }
    storeSize(name: string): Observable<any> {
        return this.http.post(`${this.api}/sizes/store`, { name });
    }
    getSizeById(id: number): Observable<any> {
        return this.http.get(`${this.api}/sizes/${id}/view`);
    }
    updateSize(size_id: number, size: string): Observable<any> {
        return this.http.post(`${this.api}/sizes/update`, { size_id, size });
    }
    toggleSizeStatus(id: number): Observable<any> {
        return this.http.get(`${this.api}/sizes/${id}/status`);
    }

    // Colours
    getColours(search?: string): Observable<any> {
        let params = new HttpParams();
        if (search) params = params.set('colour', search);
        return this.http.get(`${this.api}/colours/list`, { params });
    }
    storeColour(name: string): Observable<any> {
        return this.http.post(`${this.api}/colours/store`, { name });
    }
    getColourById(id: number): Observable<any> {
        return this.http.get(`${this.api}/colours/${id}/view`);
    }
    updateColour(colour_id: number, colour: string): Observable<any> {
        return this.http.post(`${this.api}/colours/update`, { colour_id, colour });
    }
    toggleColourStatus(id: number): Observable<any> {
        return this.http.get(`${this.api}/colours/${id}/status`);
    }
}
