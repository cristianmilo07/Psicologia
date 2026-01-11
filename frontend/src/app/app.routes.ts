import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./components/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./components/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'zona-ninos',
    loadComponent: () => import('./components/zona-ninos/zona-ninos.component').then(m => m.ZonaNinosComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'zona-padres',
    loadComponent: () => import('./components/zona-padres/zona-padres.component').then(m => m.ZonaPadresComponent),
    canActivate: [AuthGuard]
  },
    {
    path: 'calendario',
    loadComponent: () => import('./components/calendario/calendario.component').then(m => m.CalendarioComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'zona-profesional',
    loadComponent: () => import('./components/zona-profesional/zona-profesional.component').then(m => m.ZonaProfesionalComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'historia-clinica',
    loadComponent: () => import('./components/historia-clinica/historia-clinica.component').then(m => m.HistoriaClinicaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-historia-clinica',
    loadComponent: () => import('./components/nueva-historia-clinica/nueva-historia-clinica.component').then(m => m.NuevaHistoriaClinicaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-historia-clinica/:id',
    loadComponent: () => import('./components/detalle-historia-clinica/detalle-historia-clinica.component').then(m => m.DetalleHistoriaClinicaComponent),
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-historia-clinica/:id',
    loadComponent: () => import('./components/editar-historia-clinica/editar-historia-clinica.component').then(m => m.EditarHistoriaClinicaComponent),
    canActivate: [AuthGuard]
  }
];

