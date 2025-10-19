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
            slug_name: ['', Validators.required],
            password: ['', Validators.required]
        });
    }

    submit() {
        if (this.form.invalid) return;

        this.loading = true;
        this.error = '';

        const { slug_name, password } = this.form.value;

        this.auth.login(slug_name, password).subscribe({
            next: (res: any) => {
                this.loading = false;
                // Accept token in multiple common locations, including nested `data` (Laravel-style)
                const token = res?.token || res?.access_token || res?.auth_token || res?.data?.token || res?.data?.access_token || res?.data?.auth_token;
                if (token) {
                    sessionStorage.setItem('auth_token', token);
                    this.router.navigate(['/products']);
                    return;
                }

                // If the API responded with success=true but no token field (e.g. cookie-based sessions),
                // attempt to navigate anyway — note: AuthGuard checks for token in sessionStorage, so
                // this path will work only if the backend uses cookies or you add an alternative isLoggedIn check.
                if (res?.success) {
                    this.router.navigate(['/products']);
                    return;
                }

                this.error = 'Invalid login response';
            },
            error: (err) => {
                this.loading = false;
                this.error = err?.error?.message || 'Invalid credentials';
            }
        });
    }
}
