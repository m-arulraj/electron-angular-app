import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SidenavComponent } from './sidenav/sidenav.component';

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
  imports: [RouterOutlet,SidenavComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent {
  title = 'electron-angular-app';
  sendMessage() { window.electronAPI.sendMessage("Hello from Angular!"); }
}
