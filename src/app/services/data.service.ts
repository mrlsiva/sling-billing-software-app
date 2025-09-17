import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  private baseUrl = 'http://16.16.6.110/RetailPOS/Api/api/item/GetPosItemsByCategory';

  constructor(private http: HttpClient) { }

  getItemsByCategory(categoryId: number): Observable<any> {
    const url = `${this.baseUrl}?category=${categoryId}`;
    return this.http.get<any>(url);
  }
}
