import { Routes } from '@angular/router';
import { LoginComponent } from './components/auth/login.component';
import { DashboardImprovedComponent } from './pages/dashboard/dashboard-improved.component';
import { FamilleListComponent } from './pages/familles/famille-list.component';
import { FamilleDetailComponent } from './pages/familles/famille-detail.component';
import { QuartierListComponent } from './components/quartier/quartier-list.component';
import { ProjetListComponent } from './components/projet/projet-list.component';
import { ProfilComponent } from './pages/profil/profil.component';
import { ParametresComponent } from './pages/parametres/parametres.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'dashboard', 
    component: DashboardImprovedComponent
  },
  { 
    path: 'familles', 
    component: FamilleListComponent
  },
  { 
    path: 'familles/:id', 
    component: FamilleDetailComponent
  },
  { 
    path: 'quartiers', 
    component: QuartierListComponent
  },
  { 
    path: 'projets', 
    component: ProjetListComponent
  },
  { 
    path: 'profil', 
    component: ProfilComponent
  },
  { 
    path: 'parametres', 
    component: ParametresComponent
  },
  { 
    path: 'notifications', 
    component: NotificationsComponent
  },
  { 
    path: 'statistiques', 
    component: DashboardImprovedComponent
    // TODO: Add auth guard
  },
  { 
    path: 'etiquettes', 
    loadComponent: () => import('./pages/etiquettes/etiquettes.component').then(m => m.EtiquettesComponent),
    // TODO: Add auth guard
  },
  { path: '**', redirectTo: '/login' }
];
