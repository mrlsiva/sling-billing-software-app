import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { HeaderComponent } from '../header/header.component';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, HeaderComponent],
    templateUrl: './profile.component.html'
})
export class ProfileComponent {
    user: any = null;
    imgUrl = '';
    constructor(private auth: AuthService) {
        this.auth.user$.subscribe(u => { this.user = u; this.imgUrl = u?.logo ? u.logo : '' });
    }
}
