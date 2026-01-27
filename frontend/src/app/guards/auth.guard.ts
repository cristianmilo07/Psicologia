import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { catchError, map, of } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const http = inject(HttpClient);

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  // Verify token with backend
  const token = authService.getToken();
  return http.get('http://localhost:3000/api/auth/verify', {
    headers: { 'Authorization': `Bearer ${token}` }
  }).pipe(
    map(() => true),
    catchError(() => {
      authService.logout();
      return of(false);
    })
  );
};

