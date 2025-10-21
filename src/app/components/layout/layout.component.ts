import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../header/header.component';
import { FooterComponent } from '../footer/footer.component';
import { CartComponent } from '../cart/cart.component';

@Component({
    selector: 'app-layout',
    standalone: true,
    imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent, CartComponent],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent { }
