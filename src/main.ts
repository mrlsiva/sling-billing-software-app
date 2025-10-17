import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { appConfig } from './app/app.config';
import { provideAnimations } from '@angular/platform-browser/animations';

// Preserve providers from `appConfig` and merge any additional providers here.
bootstrapApplication(AppComponent, {
  ...appConfig,
  providers: [
    // keep existing providers from appConfig (if any) and add/override safely
    ...((appConfig && (appConfig as any).providers) || []),
    provideAnimations(),
  ],
}).catch(err => console.error(err));
