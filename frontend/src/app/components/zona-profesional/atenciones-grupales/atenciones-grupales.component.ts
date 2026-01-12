import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-atenciones-grupales',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './atenciones-grupales.component.html',
  styleUrl: './atenciones-grupales.component.scss'
})
export class AtencionesGrupalesComponent {
  user: any = null;
  selectedMonth = 'marzo-2026';
  selectedMonthLabel = 'marzo';

  meses = [
    { value: 'marzo-2026', label: 'Marzo 2026' },
    { value: 'abril-2026', label: 'Abril 2026' },
    // Add more months as needed
  ];

  atencionesPorGrado = [
    { grado: 'Preescolar', total: 5, dias: [3, 10, 17, 24, 31], expanded: false },
    { grado: 'Primero', total: 2, dias: [5, 19], expanded: false },
    { grado: 'Segundo', total: 3, dias: [4, 18, 25], expanded: false },
    { grado: 'Tercero', total: 1, dias: [12], expanded: false },
    { grado: 'Cuarto', total: 4, dias: [2, 9, 16, 23], expanded: false },
    { grado: 'Quinto', total: 3, dias: [6, 13, 20], expanded: false },
    { grado: 'Sexto', total: 2, dias: [7, 21], expanded: false },
    { grado: 'Séptimo', total: 1, dias: [14], expanded: false },
    { grado: 'Octavo', total: 2, dias: [8, 22], expanded: false },
    { grado: 'Noveno', total: 3, dias: [1, 15, 29], expanded: false },
    { grado: 'Décimo', total: 2, dias: [11, 25], expanded: false },
    { grado: 'Once', total: 4, dias: [2, 9, 16, 23], expanded: false }
  ];

  maxAtenciones = Math.max(...this.atencionesPorGrado.map(g => g.total));

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.user = this.authService.getCurrentUser();
  }

  logout() {
    this.authService.logout();
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'logout') {
      this.logout();
    }
  }

  onMonthChange() {
    // Logic to load data for selected month
    this.selectedMonthLabel = this.meses.find(m => m.value === this.selectedMonth)?.label.split(' ')[0] || 'marzo';
    // In a real app, fetch data from backend
  }

  toggleDetails(grado: any) {
    grado.expanded = !grado.expanded;
  }
}
