import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private url = `${environment.apiBase}/products/list`;

    constructor(private http: HttpClient) { }

    list(): Observable<any> {
        return this.http.get(this.url);
    }

    /** Fetch single product by id */
    getById(id: number | string): Observable<any> {
        // First try to find the product in the list to avoid calling a non-existent detail endpoint
        return this.list().pipe(
            map((res: any) => (res && res.data) ? res.data : res),
            switchMap((items: any[]) => {
                if (Array.isArray(items)) {
                    const found = items.find((p: any) => String(p.id) === String(id) || p.unique_id === id || p.unique_number === id);
                    if (found) {
                        return of(found);
                    }
                }
                // Not found in list — try the conventional REST endpoint as a fallback
                return this.http.get(`${environment.apiBase}/products/${id}`).pipe(
                    catchError(err => {
                        // propagate a clearer error
                        return throwError(() => new Error('Product not found'));
                    })
                );
            })
        );
    }

    /** Resolve image URL: if value already looks like a URL, return it; otherwise prefix with environment.assetsBase */
    resolveImageUrl(img: string | null | undefined): string | null {
        if (!img) return null;
        try {
            // naive check for scheme
            if (/^https?:\/\//i.test(img)) return img;
            // otherwise prefix with assets base
            return `${(environment as any).assetsBase.replace(/\/$/, '')}/${img.replace(/^\//, '')}`;
        } catch {
            return null;
        }
    }
}
