import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, updateDoc, deleteDoc, collectionData, query, where, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Venta {
  id?: string;
  productId?: string;
  productName?: string;
  quantity?: number;
  totalPrice?: number;
  date?: string; // formato ISO: 'YYYY-MM-DD'
  customer?: string;
  paymentMethod?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class VentasService {
  constructor(private firestore: Firestore) {}

  // ===================== Agregar Nueva Venta =====================
  async addVenta(venta: Venta): Promise<void> {
    const ventasRef = collection(this.firestore, 'ventas');
    const docRef = await addDoc(ventasRef, venta);
    await updateDoc(doc(this.firestore, `ventas/${docRef.id}`), { id: docRef.id });
  }

  // ===================== Obtener Todas las Ventas =====================
  getVentas(): Observable<Venta[]> {
    const ventasRef = collection(this.firestore, 'ventas');
    return collectionData(ventasRef, { idField: 'id' }) as Observable<Venta[]>;
  }

  // ===================== Obtener Producto por ID =====================
  getProductById(productId: string): Observable<any> {
    const productsRef = collection(this.firestore, 'products');
    const q = query(productsRef, where('id', '==', productId));
    return collectionData(q, { idField: 'id' }).pipe(map(items => items[0]));
  }

  // ===================== Editar Venta =====================
  updateVentas(ventaId: string, updatedVenta: Venta) {
    const ventaRef = doc(this.firestore, `ventas/${ventaId}`);
    return updateDoc(ventaRef, updatedVenta);
  }

  // ===================== Eliminar Venta =====================
  deleteVentas(ventaId: string): Promise<void> {
    const ventaRef = doc(this.firestore, `ventas/${ventaId}`);
    return deleteDoc(ventaRef);
  }

  // ===================== Obtener Ventas por Rango de Fechas =====================
  getVentasByDateRange(startDate: string, endDate: string): Observable<Venta[]> {
    const ventasRef = collection(this.firestore, 'ventas');
    const q = query(
      ventasRef,
      where('date', '>=', startDate),
      where('date', '<=', endDate),
      orderBy('date')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Venta[]>;
  }

  // ===================== Obtener Ventas por Día =====================
  getVentasByDay(date: string): Observable<Venta[]> {
    const ventasRef = collection(this.firestore, 'ventas');
    const q = query(
      ventasRef,
      where('date', '==', date),
      orderBy('date')
    );

    return collectionData(q, { idField: 'id' }) as Observable<Venta[]>;
  }

  // ===================== Contar Total de Ventas =====================
  getTotalVentas(): Observable<number> {
    const ventasRef = collection(this.firestore, 'ventas');
    return collectionData(ventasRef).pipe(map(actions => actions.length));
  }
}
