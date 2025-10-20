import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
    selector: 'app-footer',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    constructor(private router: Router) { }

    go(path: string) {
        try { this.router.navigate([path]); } catch { /* noop */ }
    }
}
