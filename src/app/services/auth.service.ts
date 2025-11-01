import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { CartService } from './cart.service';

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

    constructor(private http: HttpClient, private router: Router, private cartService: CartService) {
        // Initialize user data from storage on service creation
        this.initFromStorage();
    }

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
        sessionStorage.removeItem(this.userKey);
        this.user$.next(null);

        // Clear cart data for the logged out user
        this.cartService.clear();

        // Reset favicon to default
        this.updateFavicon('fav.png');

        // Reset document title to default
        document.title = 'Sling Billing Software App';

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

    /** Check if user is Super Admin (role_id = 1) */
    isSuperAdmin(): boolean {
        const user = this.getUser();
        return user && user.role_id === 1;
    }

    /** Check if user is HO (role_id = 2) */
    isHO(): boolean {
        const user = this.getUser();
        return user && user.role_id === 2;
    }

    /** Check if user is Branch (role_id = 3) */
    isBranch(): boolean {
        const user = this.getUser();
        return user && user.role_id === 3;
    }

    /** Check if HO user has billing enabled (role_id = 2 AND is_bill_enabled = 1) */
    isHOWithBilling(): boolean {
        const user = this.getUser();
        return user && 
               user.role_id === 2 && 
               user.user_detail && 
               user.user_detail.is_bill_enabled === 1;
    }

    /** Check if user should access POS (Branch users OR HO with billing enabled) */
    shouldAccessPOS(): boolean {
        return this.isBranch() || this.isHOWithBilling();
    }

    /** @deprecated Use role-based methods instead */
    hasOwner(): boolean {
        const user = this.getUser();
        return user && user.owner_id !== null && user.owner_id !== undefined;
    }

    /** @deprecated Use role-based methods instead */
    isOwner(): boolean {
        const user = this.getUser();
        return user && (user.owner_id === null || user.owner_id === undefined);
    }
}
