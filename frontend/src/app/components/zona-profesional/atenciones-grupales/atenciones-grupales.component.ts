import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { AtencionesGrupalesService, AtencionGrupal } from '../../../services/atenciones-grupales.service';

@Component({
  selector: 'app-atenciones-grupales',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './atenciones-grupales.component.html',
  styleUrl: './atenciones-grupales.component.scss'
})
export class AtencionesGrupalesComponent implements OnInit {
  user: any = null;
  selectedMonth = '';
  selectedMonthLabel = '';

  meses: { value: string, label: string }[] = [];

  constructor(
    private authService: AuthService,
    private router: Router,
    private atencionesService: AtencionesGrupalesService
  ) {
    this.user = this.authService.getCurrentUser();
    this.initializeMeses();
  }

  atencionesPorGrado: any[] = [];
  atenciones: AtencionGrupal[] = [];
  showForm = false;
  maxAtenciones = 0;
  loading = false;

  nuevaAtencion: Omit<AtencionGrupal, '_id' | 'createdBy' | 'createdAt' | 'updatedAt'> = {
    grado: 'Preescolar',
    fecha: '',
    tema: '',
    numeroParticipantes: 1,
    objetivos: '',
    actividades: '',
    observaciones: ''
  };

  grados = [
    'Preescolar', 'Primero', 'Segundo', 'Tercero', 'Cuarto', 'Quinto',
    'Sexto', 'Séptimo', 'Octavo', 'Noveno', 'Décimo', 'Once'
  ];

  ngOnInit() {
    this.loadAtenciones();
  }

  initializeMeses() {
    const currentYear = new Date().getFullYear();
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    // Add months for current year and next year
    for (let year = currentYear; year <= currentYear + 1; year++) {
      months.forEach((monthName, index) => {
        const monthValue = `${index + 1}-${year}`; // Use month number (1-12)
        const monthLabel = `${monthName.charAt(0).toUpperCase() + monthName.slice(1)} ${year}`;
        this.meses.push({ value: monthValue, label: monthLabel });
      });
    }

    // Set default to current month
    const currentMonth = new Date().getMonth();
    const currentMonthName = months[currentMonth];
    this.selectedMonth = `${currentMonth + 1}-${currentYear}`;
    this.selectedMonthLabel = currentMonthName;
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
    const selectedMes = this.meses.find(m => m.value === this.selectedMonth);
    this.selectedMonthLabel = selectedMes ? selectedMes.label.split(' ')[0].toLowerCase() : 'enero';
    this.loadAtenciones();
  }

  toggleDetails(grado: any) {
    grado.expanded = !grado.expanded;
  }

  loadAtenciones() {
    this.loading = true;
    const [mes, anio] = this.selectedMonth.split('-');
    const mesIndex = parseInt(mes);

    this.atencionesService.obtenerAtencionesPorMes(mesIndex, parseInt(anio)).subscribe({
      next: (atenciones) => {
        this.atenciones = atenciones;
        this.updateAtencionesPorGrado();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading atenciones:', error);
        this.atenciones = [];
        this.updateAtencionesPorGrado();
        this.loading = false;
      }
    });
  }

  updateAtencionesPorGrado() {
    const gradoMap = new Map<string, { total: number, dias: number[], expanded: boolean }>();

    this.grados.forEach(grado => {
      gradoMap.set(grado, { total: 0, dias: [], expanded: false });
    });

    this.atenciones.forEach(atencion => {
      const gradoData = gradoMap.get(atencion.grado);
      if (gradoData) {
        gradoData.total++;
        const dia = new Date(atencion.fecha).getDate();
        if (!gradoData.dias.includes(dia)) {
          gradoData.dias.push(dia);
          gradoData.dias.sort((a, b) => a - b);
        }
      }
    });

    this.atencionesPorGrado = Array.from(gradoMap.entries()).map(([grado, data]) => ({
      grado,
      ...data
    }));

    this.maxAtenciones = this.atencionesPorGrado.length > 0 ? Math.max(...this.atencionesPorGrado.map(g => g.total)) : 0;
  }

  toggleForm() {
    this.showForm = !this.showForm;
  }

  guardarAtencion() {
    if (!this.nuevaAtencion.fecha || !this.nuevaAtencion.tema || !this.nuevaAtencion.numeroParticipantes) {
      alert('Por favor complete todos los campos obligatorios');
      return;
    }

    this.atencionesService.crearAtencion(this.nuevaAtencion).subscribe({
      next: (response) => {
        alert('Atención grupal guardada exitosamente');
        this.showForm = false;

        // Update selected month to match the saved date's month/year
        const savedDate = new Date(this.nuevaAtencion.fecha);
        const savedMonth = savedDate.getMonth() + 1; // getMonth() returns 0-11
        const savedYear = savedDate.getFullYear();
        const monthValue = `${savedMonth}-${savedYear}`;

        this.selectedMonth = monthValue;
        this.selectedMonthLabel = this.getMonthName(savedMonth);

        this.resetForm();
        this.loadAtenciones();
      },
      error: (error) => {
        console.error('Error saving atencion:', error);
        alert('Error al guardar la atención grupal');
      }
    });
  }

  getMonthName(monthNumber: number): string {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return months[monthNumber - 1];
  }

  getMonthNumber(monthName: string): number {
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return months.indexOf(monthName) + 1;
  }

  resetForm() {
    this.nuevaAtencion = {
      grado: 'Preescolar',
      fecha: '',
      tema: '',
      numeroParticipantes: 1,
      objetivos: '',
      actividades: '',
      observaciones: ''
    };
  }

  getAtencionDetails(grado: string, dia: number): string {
    const atencion = this.atenciones.find(a =>
      a.grado === grado && new Date(a.fecha).getDate() === dia
    );
    return atencion ? `Tema: ${atencion.tema}` : 'Sesión de terapia grupal';
  }
}
