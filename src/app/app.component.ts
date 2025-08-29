import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';
import { AuthService } from './auth.service';
import { CommonModule } from '@angular/common';
declare global {
  interface Window {
  electronAPI: {
  sendMessage:
    (message : string) => void;
  }
  }
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule,RouterOutlet,SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'electron-angular-app';
  isAuthenticated = false; 
sidebarOpen = false;
  constructor(private authService: AuthService) {
    this.isAuthenticated = this.authService.isLoggedIn();
  }

  sendMessage() { window.electronAPI.sendMessage("Hello from Angular!"); }
  
  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
