import { Component, EventEmitter, Output, ElementRef, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-header',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']

})
export class HeaderComponent implements OnInit, OnDestroy {
    open = false;
    userName = '';
    logoUrl = `${environment.assetsBase.replace(/\/$/, '')}/no-image-icon.svg`;
    isFullscreen = false;
    private previousFocus: Element | null = null;
    @ViewChild('sideMenu', { read: ElementRef, static: false }) sideMenuRef?: ElementRef<HTMLElement>;

    // Role detection properties
    isSuperAdmin = false;
    isHO = false;
    isBranch = false;
    shouldShowPOS = false;

    private onKeydown = (e: KeyboardEvent) => {
        if (!this.open) return;
        if (e.key === 'Escape') { this.close(); e.preventDefault(); }
        if (e.key === 'Tab') { this.maintainFocus(e); }
    }

    constructor(private auth: AuthService, private router: Router) {
        this.auth.user$.subscribe(u => {
            this.userName = u?.name || u?.full_name || u?.username || '';
            const logoVal = u?.logo || u?.fav_icon || u?.logo_url || null;
            if (logoVal) {
                this.logoUrl = /^https?:\/\//i.test(logoVal) ? logoVal : `${environment.assetsBase.replace(/\/$/, '')}/${logoVal.replace(/^\//, '')}`;
            }
            // Update role status
            this.isSuperAdmin = this.auth.isSuperAdmin();
            this.isHO = this.auth.isHO();
            this.isBranch = this.auth.isBranch();
            this.shouldShowPOS = this.auth.shouldAccessPOS(); // Branch OR HO with billing
        });
    }

    toggle() {
        this.open = !this.open;
        if (this.open) { this.onOpen(); } else { this.onClose(); }
    }

    private onOpen() {
        this.previousFocus = document.activeElement as Element;
        // focus first focusable element in menu after it's rendered
        setTimeout(() => this.focusFirstInMenu(), 0);
    }

    close() { this.open = false; this.onClose(); }

    private onClose() {
        // restore previous focus
        try { (this.previousFocus as HTMLElement)?.focus?.(); } catch { }
    }

    private focusFirstInMenu() {
        const menu = this.sideMenuRef?.nativeElement;
        if (!menu) return;
        const focusable = Array.from(menu.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")).filter(el => !el.hasAttribute('disabled'));
        if (focusable.length) focusable[0].focus();
    }

    ngOnInit(): void {
        document.addEventListener('keydown', this.onKeydown);
    }

    ngOnDestroy(): void {
        document.removeEventListener('keydown', this.onKeydown);
    }

    @HostListener('document:fullscreenchange', [])
    @HostListener('document:webkitfullscreenchange', [])
    @HostListener('document:mozfullscreenchange', [])
    @HostListener('document:MSFullscreenChange', [])
    onFsChange() {
        const doc: any = document as any;
        this.isFullscreen = !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
    }

    async toggleFullscreen() {
        try {
            const doc: any = document as any;
            if (this.isFullscreen) {
                if (doc.exitFullscreen) await doc.exitFullscreen();
                else if (doc.webkitExitFullscreen) await doc.webkitExitFullscreen();
                else if (doc.mozCancelFullScreen) await doc.mozCancelFullScreen();
                else if (doc.msExitFullscreen) await doc.msExitFullscreen();
                this.isFullscreen = false;
            } else {
                const el: any = document.documentElement as any;
                if (el.requestFullscreen) await el.requestFullscreen();
                else if (el.webkitRequestFullscreen) await el.webkitRequestFullscreen();
                else if (el.mozRequestFullScreen) await el.mozRequestFullScreen();
                else if (el.msRequestFullscreen) await el.msRequestFullscreen();
                this.isFullscreen = true;
            }
        } catch (e) {
            // ignore errors (user may block fullscreen)
        }
    }

    // Keep focus inside the side menu when it's open
    private maintainFocus(e: KeyboardEvent) {
        const menu = this.sideMenuRef?.nativeElement;
        if (!menu) return;
        const focusable = Array.from(menu.querySelectorAll<HTMLElement>("a, button, [tabindex]:not([tabindex='-1'])")).filter(el => !el.hasAttribute('disabled'));
        if (!focusable.length) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement;

        if (!e.shiftKey && active === last) {
            first.focus();
            e.preventDefault();
        } else if (e.shiftKey && active === first) {
            last.focus();
            e.preventDefault();
        }
    }

    onLogout() {
        this.auth.logout().subscribe({
            complete: () => { this.auth.clearSession(); this.router.navigate(['/login']); }
        });
    }
}
