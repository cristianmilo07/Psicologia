import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-cambiar-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="password-container">
      <h2>Cambiar Contraseña</h2>
      
      <div *ngIf="message" [class]="messageType === 'success' ? 'success-message' : 'error-message'">
        {{ message }}
      </div>

      <form (ngSubmit)="changePassword()">
        <div class="form-group">
          <label for="currentPassword">Contraseña Actual:</label>
          <input 
            type="password" 
            id="currentPassword" 
            [(ngModel)]="currentPassword" 
            name="currentPassword" 
            required
          >
        </div>

        <div class="form-group">
          <label for="newPassword">Nueva Contraseña:</label>
          <input 
            type="password" 
            id="newPassword" 
            [(ngModel)]="newPassword" 
            name="newPassword" 
            required
            minlength="8"
          >
          <small>La contraseña debe tener al menos 8 caracteres</small>
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirmar Nueva Contraseña:</label>
          <input 
            type="password" 
            id="confirmPassword" 
            [(ngModel)]="confirmPassword" 
            name="confirmPassword" 
            required
          >
        </div>

        <button type="submit" [disabled]="loading || !isFormValid()">
          {{ loading ? 'Cambiando...' : 'Cambiar Contraseña' }}
        </button>
      </form>
    </div>
  `,
  styles: [`
    .password-container {
      max-width: 400px;
      margin: 2rem auto;
      padding: 2rem;
      background: #f5f5f5;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 1rem;
    }
    .form-group label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: bold;
    }
    .form-group input {
      width: 100%;
      padding: 0.5rem;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .form-group small {
      color: #666;
    }
    button {
      width: 100%;
      padding: 0.75rem;
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
    }
    button:disabled {
      background: #ccc;
    }
    .success-message {
      background: #d4edda;
      color: #155724;
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 0.5rem;
      border-radius: 4px;
      margin-bottom: 1rem;
    }
  `]
})
export class CambiarPasswordComponent {
  private authService = inject(AuthService);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';
  message = '';
  messageType: 'success' | 'error' = 'success';
  loading = false;

  isFormValid(): boolean {
    return (
      this.currentPassword.length > 0 &&
      this.newPassword.length >= 8 &&
      this.newPassword === this.confirmPassword
    );
  }

  changePassword(): void {
    if (!this.isFormValid()) {
      this.message = 'Por favor complete todos los campos correctamente';
      this.messageType = 'error';
      return;
    }

    this.loading = true;
    this.message = '';

    this.authService.changePassword(this.currentPassword, this.newPassword).subscribe({
      next: (response) => {
        this.message = response.message;
        this.messageType = 'success';
        this.currentPassword = '';
        this.newPassword = '';
        this.confirmPassword = '';
        this.loading = false;
      },
      error: (error) => {
        this.message = error.error?.message || 'Error al cambiar contraseña';
        this.messageType = 'error';
        this.loading = false;
      }
    });
  }
}
