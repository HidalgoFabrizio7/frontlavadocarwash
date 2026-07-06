import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard = (rolesPermitidos: string[]): CanActivateFn => () => {
  const auth = inject(AuthService);
  const router = inject(Router);

  if (auth.isLoggedIn() && rolesPermitidos.includes(auth.getRole() ?? '')) {
    return true;
  }

  router.navigate(['/login']);
  return false;
};
