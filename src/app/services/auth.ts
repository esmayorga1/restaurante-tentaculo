import { Injectable, NgZone } from '@angular/core';
import { Auth as FirebaseAuth, createUserWithEmailAndPassword, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword, signOut, UserCredential } from 'firebase/auth';
import { doc, Firestore, getDoc, setDoc } from 'firebase/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Auth {

  constructor(private afAuth: FirebaseAuth, private firestore: Firestore, private ngZone: NgZone) { }

  // Método para registrar un usuario y almacenar su rol en Firestore
  async createUser(email: string, password: string, role: string): Promise<void> {
    try {
      const userCredential: UserCredential = await createUserWithEmailAndPassword(this.afAuth, email, password);
      const user = userCredential.user;

      // Enviar correo de verificación
      await sendEmailVerification(user);

      // Guardar información adicional en Firestore (rol del usuario)
      await setDoc(doc(this.firestore, 'users', user.uid), {
        email: user.email,
        role: role,
        emailVerified: user.emailVerified
      });

    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw error;
    }
  }

  // Método para iniciar sesión
  async loginWithEmail(email: string, password: string): Promise<void> {
    try {
      const userCredential = await signInWithEmailAndPassword(this.afAuth, email, password);
      if (!userCredential.user.emailVerified) {
        throw new Error('Debe verificar su correo electrónico antes de iniciar sesión.');
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  }

  // Método para cerrar sesión
  async logout(): Promise<void> {
    try {
      await signOut(this.afAuth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  }

  // Método para verificar si el usuario está autenticado
  isLoggedIn(): Observable<boolean> {
    return new Observable<boolean>(subscriber => {
      this.afAuth.onAuthStateChanged(user => {
        subscriber.next(!!user);
      });
    });
  }

  // Método para recuperar la contraseña
  async forgotPassword(email: string): Promise<void> {
    try {
      await sendPasswordResetEmail(this.afAuth, email);
    } catch (error) {
      console.error('Error al enviar correo de recuperación:', error);
      throw error;
    }
  }

  // Metodo para recuperar rol de usuario

async getCurrentUserRole(): Promise<string | null> {
  const user = this.afAuth.currentUser;
  if (user) {
    const userDoc = await getDoc(doc(this.firestore, 'users', user.uid));
    if (userDoc.exists()) {
      return userDoc.data()['role'];
    }
  }
  return null;
}

  
}