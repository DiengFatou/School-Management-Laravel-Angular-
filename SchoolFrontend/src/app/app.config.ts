import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { appRoutes } from './app.routes';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

export const appConfig = {
  providers: [
    provideHttpClient(),
    provideRouter(appRoutes),  // <-- Ici on passe les routes
    provideCharts(withDefaultRegisterables())  // Configuration de ng2-charts
  ]
};
