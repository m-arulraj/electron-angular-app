import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AboutComponent } from './pages/about/about.component';
import { ServicesComponent } from './pages/services/services.component';
import { ContactComponent } from './pages/contact/contact.component';
import { HelpComponent } from './pages/help/help.component';
import { CrewComponent } from './crew/crew.component';
import { VULReportComponent } from './pages/vul-report/vul-report.component';
import { AuthGuard } from './auth.guard';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
    { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard]  },
  { path: 'crew', component: CrewComponent, canActivate: [AuthGuard] },
  {path: 'vul-report', component: VULReportComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '/home' }
];
