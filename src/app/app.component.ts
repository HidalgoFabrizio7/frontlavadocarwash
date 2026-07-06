import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
@Component({
    selector: 'app-root',
    imports: [
        RouterOutlet,
        RouterLink,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
        CommonModule,
        MatButtonModule,
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.css'
})
export class AppComponent {

  title = 'frontlavadocarwash';
  showMobileMenu = false;
  mobileSubMenu: string | null = null;

  constructor(private authS: AuthService, private router: Router) {}

  get isLoggedIn(): boolean {
    return this.authS.isLoggedIn();
  }

  get esAdmin(): boolean {
    return this.authS.hasRole('ADMIN');
  }

  get esVentas(): boolean {
    return this.authS.hasRole('VENTAS');
  }

  get esEmpleado(): boolean {
    return this.authS.hasRole('EMPLEADO');
  }

  get esSupervisor(): boolean {
    return this.authS.hasRole('SUPERVISOR');
  }

  toggleMobileMenu() {
    this.showMobileMenu = !this.showMobileMenu;
    this.mobileSubMenu = null; // opcional: cerrar submenús al cerrar
  }
  closeMobileMenu() {
    this.showMobileMenu = false;
    this.mobileSubMenu = null;
  }

  cerrarSesion() {
    this.authS.logout();
    this.closeMobileMenu();
    this.router.navigate(['/login']);
  }

}


