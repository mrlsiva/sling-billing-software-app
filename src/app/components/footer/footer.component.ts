import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    isSuperAdmin = false;
    isHO = false;
    isBranch = false;
    shouldShowPOS = false;

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.auth.user$.subscribe(() => {
            this.isSuperAdmin = this.auth.isSuperAdmin();
            this.isHO = this.auth.isHO();
            this.isBranch = this.auth.isBranch();
            this.shouldShowPOS = this.auth.shouldAccessPOS(); // Branch OR HO with billing
        });
    }

    go(path: string) {
        try { this.router.navigate([path]); } catch { /* noop */ }
    }
}
