import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';

interface LoginResponse {
    token?: string;
    access_token?: string;
    auth_token?: string;
    user?: any;
    message?: string;
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private loginUrl = `${environment.apiBase}/login`;
    private logoutUrl = `${environment.apiBase}/logout`;
    private tokenKey = 'auth_token';

    constructor(private http: HttpClient, private router: Router) { }

    /** Get saved token */
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    /** Perform login */
    login(phone: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.loginUrl, { phone, password }).pipe(
            tap(res => {
                const token = res.token || res.access_token || res.auth_token;
                if (token) {
                    sessionStorage.setItem(this.tokenKey, token);
                }
            })
        );
    }

    /** Perform logout */
    logout(): Observable<any> {
        const token = this.getToken();
        const headers = token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;

        return this.http.post(this.logoutUrl, {}, { headers }).pipe(
            tap(() => this.clearSession())
        );
    }

    /** Clear session */
    clearSession(): void {
        sessionStorage.removeItem(this.tokenKey);
        this.router.navigate(['/login']);
    }

    /** Check login status */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }
}
