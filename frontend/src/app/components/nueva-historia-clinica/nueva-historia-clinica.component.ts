import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-nueva-historia-clinica',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule],
  templateUrl: './nueva-historia-clinica.component.html',
  styleUrl: './nueva-historia-clinica.component.scss'
})
export class NuevaHistoriaClinicaComponent {
  user: any = null;
  historiaClinicaForm: FormGroup;
  showModal: boolean = false;
  showSuccessModal: boolean = false;
  selectedFiles: File[] = [];
  recognition: any;
  isListening: boolean = false;
  mostrarCitacionPadres: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fb: FormBuilder,
    private http: HttpClient
  ) {
    this.user = this.authService.getCurrentUser();

    // Initialize speech recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'es-ES'; // Spanish

      this.recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        this.appendToField(transcript);
      };

      this.recognition.onend = () => {
        this.isListening = false;
      };

      this.recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        this.isListening = false;
      };
    } else {
      console.warn('Speech recognition not supported in this browser');
    }
    this.historiaClinicaForm = this.fb.group({
      nombrePaciente: [''],
      fechaNacimiento: [''],
      genero: [''],
      gradoPaciente: [''],
      direccion: [''],
      telefono: [''],
      email: ['', [Validators.email]],
      nivelRiesgo: [''],
      acompanamiento: [''],
      descripcionAcompanamientoPadre: [''],
      sesionesAcompanamientoFamiliar: this.fb.array([this.crearSesionAcompanamientoFamiliar()]),
      motivoConsulta: [''],
      antecedentesMedicos: [''],
      sintomasActuales: [''],
      diagnostico: [''],
      planTratamiento: [''],
      notas: [''],
      // Información familiar
      nombrePadre: [''],
      nombreMadre: [''],
      nombreAcudiente: [''],
      tieneHermanosColegio: [''], // No requerido
      gradoHermano: [''], // No requerido
      parentescoAcudiente: [''],
      sesiones: this.fb.array([])
    });

  }

  logout() {
    this.authService.logout();
  }

  closeModalAndLogout() {
    this.showModal = false;
    this.logout();
  }

  get sesiones(): FormArray {
    return this.historiaClinicaForm.get('sesiones') as FormArray;
  }

  get sesionesAcompanamientoFamiliar(): FormArray {
    return this.historiaClinicaForm.get('sesionesAcompanamientoFamiliar') as FormArray;
  }

  crearSesionAcompanamientoFamiliar() {
    return this.fb.group({
      descripcion: ['']
    });
  }

  agregarSesionAcompanamientoFamiliar() {
    this.sesionesAcompanamientoFamiliar.push(this.crearSesionAcompanamientoFamiliar());
  }

  eliminarSesionAcompanamientoFamiliar(index: number) {
    this.sesionesAcompanamientoFamiliar.removeAt(index);
  }

  get isAcompanamientoSelected(): boolean {
    return !!this.historiaClinicaForm.get('acompanamiento')?.value;
  }

  toggleCitacionPadres() {
    this.mostrarCitacionPadres = !this.mostrarCitacionPadres;
  }

  agregarSesion() {
    this.sesiones.push(this.fb.group({
      fecha: [''],
      tipo: [''],
      notas: [''],
      objetivos: [''],
      progreso: ['']
    }));
  }

  eliminarSesion(index: number) {
    this.sesiones.removeAt(index);
  }

  onSelectChange(event: Event) {
    const target = event.target as HTMLSelectElement;
    if (target.value === 'logout') {
      this.logout();
    }
  }

  onFileChange(event: any) {
    this.selectedFiles = Array.from(event.target.files);
  }

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
  }

  toggleSpeechRecognition(fieldName: string) {
    if (!this.recognition) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    if (this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    } else {
      (this.recognition as any).fieldName = fieldName; // Store which field to update
      this.recognition.start();
      this.isListening = true;
    }
  }

  appendToField(transcript: string) {
    const fieldName = (this.recognition as any).fieldName;
    const currentValue = this.historiaClinicaForm.get(fieldName)?.value || '';
    this.historiaClinicaForm.get(fieldName)?.setValue(currentValue + ' ' + transcript);
  }

  onSubmit() {
    const token = this.authService.getToken();
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    const formData = new FormData();
    const formValue = this.historiaClinicaForm.value;

    // Append form fields
    Object.keys(formValue).forEach(key => {
      if (key === 'sesiones' || key === 'sesionesAcompanamientoFamiliar') {
        formData.append(key, JSON.stringify(formValue[key]));
      } else {
        formData.append(key, formValue[key]);
      }
    });

    // Append files
    this.selectedFiles.forEach((file, index) => {
      formData.append('archivos', file);
    });

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    this.http.post('http://localhost:3000/api/historias', formData, { headers })
      .subscribe({
        next: (response: any) => {
          this.showSuccessModal = true;
          // Reset form but keep the structure intact
          this.historiaClinicaForm.reset();
          // Clear sesiones array
          const sesionesArray = this.historiaClinicaForm.get('sesiones') as FormArray;
          while (sesionesArray.length > 0) {
            sesionesArray.removeAt(0);
          }
          // Clear sesionesAcompanamientoFamiliar array
          const sesionesAcompFamiliarArray = this.historiaClinicaForm.get('sesionesAcompanamientoFamiliar') as FormArray;
          while (sesionesAcompFamiliarArray.length > 0) {
            sesionesAcompFamiliarArray.removeAt(0);
          }
          // Add initial session for acompanamiento familiar
          sesionesAcompFamiliarArray.push(this.crearSesionAcompanamientoFamiliar());
          // Clear selected files
          this.selectedFiles = [];
        },
        error: (error) => {
          console.error('Error al crear historia clínica:', error);
          if (error.status === 401) {
            this.showModal = true;
          } else {
            alert('Error al crear la historia clínica: ' + (error.error?.message || 'Error desconocido'));
          }
        }
      });
  }

  aceptarSuccess() {
    this.showSuccessModal = false;
    this.router.navigate(['/historia-clinica']);
  }

  exportarExcel(): void {
    const formValue = this.historiaClinicaForm.value;
    const fechaActual = new Date().toLocaleDateString('es-CO').replace(/\//g, '-');

    // Preparar datos para Excel
    const datos: any = {
      'Información del Paciente': {},
      'Datos Personales': {},
      'Información Clínica': {},
      'Sesiones': []
    };

    // Información del Paciente
    datos['Información del Paciente'] = {
      'Nombre del Paciente': formValue.nombrePaciente || '',
      'Fecha de Nacimiento': formValue.fechaNacimiento || '',
      'Género': formValue.genero || '',
      'Grado Escolar': formValue.gradoPaciente || '',
      'Dirección': formValue.direccion || '',
      'Teléfono': formValue.telefono || '',
      'Email': formValue.email || '',
      'Nivel de Riesgo': formValue.nivelRiesgo || ''
    };

    // Acompañamiento
    datos['Datos Personales'] = {
      'Tipo de Acompañamiento': formValue.acompanamiento || '',
      'Descripción Acompañamiento': formValue.descripcionAcompanamientoPadre || '',
      'Nombre del Padre': formValue.nombrePadre || '',
      'Nombre de la Madre': formValue.nombreMadre || '',
      'Nombre del Acudiente': formValue.nombreAcudiente || '',
      'Parentesco': formValue.parentescoAcudiente || '',
      'Hermanos en el Colegio': formValue.tieneHermanosColegio || '',
      'Grado del Hermano': formValue.gradoHermano || ''
    };

    // Información Clínica
    datos['Información Clínica'] = {
      'Motivo de Consulta': formValue.motivoConsulta || '',
      'Antecedentes Médicos': formValue.antecedentesMedicos || '',
      'Síntomas Actuales': formValue.sintomasActuales || '',
      'Diagnóstico': formValue.diagnostico || '',
      'Plan de Tratamiento': formValue.planTratamiento || '',
      'Notas': formValue.notas || ''
    };

    // Sesiones de Terapia
    if (formValue.sesiones && formValue.sesiones.length > 0) {
      formValue.sesiones.forEach((sesion: any, index: number) => {
        datos['Sesiones'].push({
          'Sesión #': index + 1,
          'Fecha': sesion.fecha || '',
          'Tipo': sesion.tipo || '',
          'Notas': sesion.notas || '',
          'Objetivos': sesion.objetivos || '',
          'Progreso': sesion.progreso || ''
        });
      });
    }

    // Crear libro de Excel
    const wb: XLSX.WorkBook = XLSX.utils.book_new();

    // Agregar cada sección como una hoja
    Object.keys(datos).forEach(sheetName => {
      const sheetData = datos[sheetName];
      if (Array.isArray(sheetData)) {
        // Es un array (sesiones)
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(sheetData);
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
      } else {
        // Es un objeto (datos simples)
        const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet([sheetData]);
        XLSX.utils.book_append_sheet(wb, ws, sheetName.substring(0, 31));
      }
    });

    // Generar nombre del archivo
    const nombreArchivo = `historia-clinica-${formValue.nombrePaciente || 'sin-nombre'}-${fechaActual}.xlsx`.replace(/\s+/g, '-').toLowerCase();

    // Descargar archivo
    XLSX.writeFile(wb, nombreArchivo);
  }
}

