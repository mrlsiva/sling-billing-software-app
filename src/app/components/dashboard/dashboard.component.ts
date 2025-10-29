import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
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
