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
    isOwner = false;
    hasOwner = false;

    constructor(private router: Router, private auth: AuthService) { }

    ngOnInit() {
        this.auth.user$.subscribe(() => {
            this.isOwner = this.auth.isOwner();
            this.hasOwner = this.auth.hasOwner();
        });
    }

    go(path: string) {
        try { this.router.navigate([path]); } catch { /* noop */ }
    }
}
