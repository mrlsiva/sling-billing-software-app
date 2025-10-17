import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private url = `${environment.apiBase}/products/list`;

    constructor(private http: HttpClient) { }

    list(): Observable<any> {
        return this.http.get(this.url);
    }
}
