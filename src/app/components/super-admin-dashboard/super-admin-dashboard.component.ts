import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-super-admin-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './super-admin-dashboard.component.html',
    styleUrls: ['./super-admin-dashboard.component.scss']
})
export class SuperAdminDashboardComponent implements OnInit {
    user: any = null;
    loading = true;

    constructor(private auth: AuthService) { }

    ngOnInit() {
        this.auth.user$.subscribe(u => {
            this.user = u;
            this.loading = false;
        });
    }
}