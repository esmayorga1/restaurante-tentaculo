import { ApplicationConfig, provideZoneChangeDetection, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';

// ✅ Firebase Modular imports
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),

    // ✅ Firebase Modular Init
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
    provideDatabase(() => getDatabase()),
  ]
};
