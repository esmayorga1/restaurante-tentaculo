import { Injectable, NgZone } from '@angular/core';
import {
  Auth,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  UserCredential,
} from '@angular/fire/auth';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private afAuth: Auth, private firestore: Firestore, private ngZone: NgZone) {}

  // Crear usuario
  async createUser(email: string, password: string): Promise<void> {
    const userCredential: UserCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
    const user = userCredential.user;

    // Enviar verificación de correo
    await sendEmailVerification(user);

    // Guardar datos básicos del usuario en Firestore
    await setDoc(doc(this.firestore, 'users', user.uid), {
      email: user.email,
      emailVerified: user.emailVerified,
    });
  }

  // Iniciar sesión
  async loginWithEmail(email: string, password: string): Promise<void> {
    const userCredential = await signInWithEmailAndPassword(this.afAuth, email, password);
    if (!userCredential.user.emailVerified) {
      throw new Error('Debe verificar su correo electrónico antes de iniciar sesión.');
    }
  }

  // Cerrar sesión
  async logout(): Promise<void> {
    await signOut(this.afAuth);
  }

  // Verificar si hay sesión activa
  isLoggedIn(): Observable<boolean> {
    return new Observable((subscriber) => {
      this.afAuth.onAuthStateChanged((user) => {
        subscriber.next(!!user);
      });
    });
  }

  // Recuperar contraseña
  async forgotPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.afAuth, email);
  }
}
