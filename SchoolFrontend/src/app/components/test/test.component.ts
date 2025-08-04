import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-test',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div style="padding: 50px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; color: white;">
      <h1>🎓 School Management System</h1>
      <p>Application fonctionne correctement !</p>
      <div style="margin-top: 30px;">
        <button style="padding: 10px 20px; margin: 10px; border: none; border-radius: 5px; background: white; color: #667eea; cursor: pointer;" routerLink="/login">
          Aller au Login
        </button>
      </div>
    </div>
  `
})
export class TestComponent {} 