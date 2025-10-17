import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent {
    form: FormGroup;
    loading = false;
    error = '';

    constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
        this.form = this.fb.group({
            phone: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit() {
        if (this.form.invalid) return;

        this.loading = true;
        this.error = '';

        const { phone, password } = this.form.value;

        this.auth.login(phone, password).subscribe({
            next: (res) => {
                this.loading = false;
                const token = res.token || res.access_token || res.auth_token;
                if (token) {
                    sessionStorage.setItem('auth_token', token);
                    this.router.navigate(['/products']);
                } else {
                    this.error = 'Invalid login response';
                }
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.error?.message || 'Invalid credentials';
            }
        });
    }
}
