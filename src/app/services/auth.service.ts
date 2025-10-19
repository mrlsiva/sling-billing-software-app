import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
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
    private userKey = 'auth_user';
    /** Public observable for current user (null when not set) */
    public user$ = new BehaviorSubject<any | null>(null);

    constructor(private http: HttpClient, private router: Router) { }

    // initialize stored user on service creation
    ngOnInit?: never;
    constructorInit? = (() => { this.initFromStorage(); return null; })();

    /** Get saved token */
    getToken(): string | null {
        return sessionStorage.getItem(this.tokenKey);
    }

    /** Perform login */
    login(slug_name: string, password: string): Observable<LoginResponse> {
        return this.http.post<LoginResponse>(this.loginUrl, { slug_name, password }).pipe(
            tap(res => {
                // Support token returned directly or inside `data` (Laravel-style)
                const token = res.token || res.access_token || res.auth_token || (res as any)?.data?.token || (res as any)?.data?.access_token || (res as any)?.data?.auth_token;
                if (token) {
                    sessionStorage.setItem(this.tokenKey, token);
                }

                // If API returned user data (common Laravel shape: data.user or data), persist it
                const user = (res as any)?.user || (res as any)?.data?.user || (res as any)?.data;
                if (user) {
                    try { sessionStorage.setItem(this.userKey, JSON.stringify(user)); } catch { }
                    // emit to subscribers
                    this.user$.next(user);
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

    /** Initialize user$ from storage (call on app startup or service construction) */
    initFromStorage(): void {
        const raw = sessionStorage.getItem(this.userKey);
        if (raw) {
            try { this.user$.next(JSON.parse(raw)); } catch { this.user$.next(null); }
        } else {
            this.user$.next(null);
        }
    }

    /** Check login status */
    isLoggedIn(): boolean {
        return !!this.getToken();
    }

    /** Get saved user info (if any) */
    getUser(): any {
        const raw = sessionStorage.getItem(this.userKey);
        if (!raw) return null;
        try { return JSON.parse(raw); } catch { return null; }
    }
}
