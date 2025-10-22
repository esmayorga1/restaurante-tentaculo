import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getDatabase, provideDatabase } from '@angular/fire/database';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    // Agrega el interceptor de ngrok aquí:
   
    provideFirebaseApp(() =>
      initializeApp({
          apiKey: "AIzaSyB13Wgz9sZVRoAPsLmLx3TIol4Xbp_XY6M",
          authDomain: "restaurante-tentaculo.firebaseapp.com",
          projectId: "restaurante-tentaculo",
          storageBucket: "restaurante-tentaculo.firebasestorage.app",
          messagingSenderId: "290468542373",
          appId: "1:290468542373:web:733a08cf2f032ee0a3da4c",
          measurementId: "G-XMLS77YJY4"    
        

      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase())
  
  ]
};
