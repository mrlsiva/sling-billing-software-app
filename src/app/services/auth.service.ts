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

    /** Convenience: return Http headers with Authorization if token present */
    authHeaders(): { [header: string]: string } | undefined {
        const token = this.getToken();
        if (!token) return undefined;
        return { Authorization: `Bearer ${token}` };
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
                    // update favicon if API provided one
                    try { this.setFaviconFromUser(user); } catch { }
                    // update document title if API provided an app/company/title
                    try { this.setDocumentTitleFromUser(user); } catch { }
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
            try {
                const parsed = JSON.parse(raw);
                this.user$.next(parsed);
                try { this.setFaviconFromUser(parsed); } catch { }
                try { this.setDocumentTitleFromUser(parsed); } catch { }
            } catch { this.user$.next(null); }
        } else {
            this.user$.next(null);
        }
    }

    /** Set document.title using likely fields from API-provided user/app object */
    private setDocumentTitleFromUser(user: any): void {
        if (!user) return;
        const candidates = [
            user.app_title,
            user.appName,
            user.company_name,
            user.company,
            user.business_name,
            user.org_name,
            user.name,
            user.title,
            user.slug_name
        ].filter(Boolean).map(String);
        if (!candidates.length) return;
        const title = candidates[0];
        try { document.title = title; } catch { }
    }

    /** Resolve and set favicon based on user data if provided by API */
    private setFaviconFromUser(user: any): void {
        if (!user) return;
        const possible = [
            user.fav_icon,
            user.favicon,
            user.favIcon,
            user.icon,
            user.logo,
            user.logo_url,
            user.fav_icon_url,
            (user.data && user.data.fav_icon) || undefined
        ].filter(Boolean) as string[];
        if (!possible.length) return;
        const icon = possible[0];
        let href = icon;
        // If it's a relative path, resolve against assetsBase
        if (!/^https?:\/\//i.test(icon)) {
            const base = (environment.assetsBase || '').replace(/\/$/, '');
            href = base ? `${base}/${icon.replace(/^\//, '')}` : icon;
        }
        this.updateFavicon(href);
    }

    /** Update or create the <link rel="icon"> element on the page */
    private updateFavicon(href: string): void {
        if (!href) return;
        try {
            const doc = document;
            let link: HTMLLinkElement | null = doc.querySelector("link[rel~='icon']");
            if (!link) {
                link = doc.createElement('link');
                link.rel = 'icon';
                doc.getElementsByTagName('head')[0].appendChild(link);
            }
            if (link.href !== href) {
                link.href = href;
            }
        } catch (e) {
            // ignore in non-browser contexts
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
