import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatFormFieldModule,
        MatInputModule,
    ],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {
  form: FormGroup;
  error: string | null = null;
  cargando = false;

  constructor(
    private formBuilder: FormBuilder,
    private authS: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  ingresar(): void {
    this.error = null;
    if (this.form.invalid) {
      return;
    }
    this.cargando = true;
    const { username, password } = this.form.value;
    this.authS.login(username, password).subscribe({
      next: () => {
        this.cargando = false;
        const rol = this.authS.getRole();
        if (rol === 'EMPLEADO') {
          this.router.navigate(['/servicio/recojos']);
        } else if (rol === 'SUPERVISOR') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/servicio']); // ADMIN / VENTAS
        }
      },
      error: () => {
        this.cargando = false;
        this.error = 'Usuario o contraseña incorrectos';
      },
    });
  }
}
