import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ProductService {
    private url = `${environment.apiBase}/pos/product`;

    constructor(private http: HttpClient) { }

    /**
     * Fetch product list using POS API.
     * Optional filters: { category, sub_category, product, filter }
     */
    list(filters?: { category?: string; sub_category?: string; product?: string; filter?: string }): Observable<any> {
        const params: any = {};
        if (filters) {
            if (filters.category) params.category = filters.category;
            if (filters.sub_category) params.sub_category = filters.sub_category;
            if (filters.product) params.product = filters.product;
            if (filters.filter) params.filter = filters.filter;
        }
        return this.http.get(this.url, { params });
    }

    /** Fetch single product by id using POS detail endpoint, fallback to list lookup */
    getById(id: number | string): Observable<any> {
        const detailUrl = `${environment.apiBase}/pos/${id}/get_product_detail`;
        return this.http.get(detailUrl).pipe(
            map((res: any) => {
                const raw = (res && res.data) ? res.data : res;
                // if the API returns a wrapper with `product`, return that
                return raw?.product ? raw.product : raw;
            }),
            catchError(() => {
                // fallback: search through paginated product list pages
                return this.searchPagesForId(id);
            })
        );
    }

    /**
     * Walks paginated pos/product pages following next_page_url until the product is found
     */
    private searchPagesForId(id: number | string): Observable<any> {
        const startUrl = this.url; // this is environment.apiBase + '/pos/product'

        return new Observable<any>((observer) => {
            const httpGet = (url: string) => {
                this.http.get(url).subscribe({
                    next: (res: any) => {
                        const pageItems = (res && res.data) ? res.data : (Array.isArray(res) ? res : []);
                        if (Array.isArray(pageItems)) {
                            const found = pageItems.find((p: any) => {
                                // items may be wrapper objects with `.product`
                                const candidate = p?.product ? p.product : p;
                                return String(candidate?.id) === String(id) || candidate?.unique_id === id || candidate?.unique_number === id;
                            });
                            if (found) {
                                const product = found?.product ? found.product : found;
                                observer.next(product);
                                observer.complete();
                                return;
                            }
                        }

                        const nextUrl = res?.next_page_url || res?.links?.find?.((l: any) => l?.label?.toString().includes('Next'))?.url;
                        if (nextUrl) {
                            // follow next page
                            httpGet(nextUrl);
                        } else {
                            observer.error(new Error('Product not found'));
                        }
                    },
                    error: (err) => {
                        observer.error(err);
                    }
                });
            };

            httpGet(startUrl);
        });
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
