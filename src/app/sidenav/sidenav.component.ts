import { Component } from '@angular/core';
import { RouterModule ,RouterLink, RouterOutlet,Router } from '@angular/router';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-sidenav',
  standalone: true,
  imports: [RouterModule ,RouterLink, RouterOutlet],
  templateUrl: './sidenav.component.html',
  styleUrl: './sidenav.component.css'
})
export class SidenavComponent {
  constructor(private authService: AuthService, private router: Router) {}
logout(): void {
    this.authService.logout();  // Clear the logged-in state
    this.router.navigate(['/login']);  // Redirect to login page
  }
}
