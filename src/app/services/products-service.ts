import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  getDoc,
  collectionData
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

export interface Product {
  id?: string;
  name?: string;
  purchasePrice?: number;
  salePrice?: number;
  stockQuantity?: number;
  category?: string;
  brand?: string;
  supplier?: string;
  description?: string;
  imageUrl?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  constructor(private firestore: Firestore) {}

  // ==============================================================
  // 🟢 AGREGAR PRODUCTO NUEVO
  // ==============================================================
  async addProduct(product: Product): Promise<void> {
    const productsRef = collection(this.firestore, 'products');
    const docRef = await addDoc(productsRef, product);
    await updateDoc(doc(this.firestore, `products/${docRef.id}`), { id: docRef.id });
  }

  // ==============================================================
  // 🔵 OBTENER TODOS LOS PRODUCTOS
  // ==============================================================
  getProducts1(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  // ==============================================================
  // 🟡 OBTENER PRODUCTO POR ID (devuelve PROMISE, no Observable)
  // ==============================================================
  async getProductById(productId: string): Promise<Product> {
    const productRef = doc(this.firestore, `products/${productId}`);
    const docSnap = await getDoc(productRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Product;
    } else {
      throw new Error('Producto no encontrado');
    }
  }

  // ==============================================================
  // 🟠 ACTUALIZAR PRODUCTO COMPLETO
  // ==============================================================
  async updateProduct(productId: string, updatedProduct: Product): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    await updateDoc(productRef, updatedProduct);
  }

  // ==============================================================
  // 🔴 ELIMINAR PRODUCTO
  // ==============================================================
  async deleteProduct(productId: string): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    await deleteDoc(productRef);
  }

  // ==============================================================
  // ⚙️ ACTUALIZAR INVENTARIO (recibe el nuevo stock directamente)
  // ==============================================================
  async updateProductStock(productId: string, newStock: number): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    if (newStock < 0) throw new Error('El stock no puede ser negativo');
    await updateDoc(productRef, { stockQuantity: newStock });
  }

  // ==============================================================
  // ➕ AUMENTAR STOCK (por ejemplo, al recibir nueva mercancía)
  // ==============================================================
  async increaseProductStock(productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) throw new Error('La cantidad debe ser mayor a 0');
    const productRef = doc(this.firestore, `products/${productId}`);
    const docSnap = await getDoc(productRef);

    if (!docSnap.exists()) throw new Error('Producto no encontrado');

    const stockActual = docSnap.data()['stockQuantity'] ?? 0;
    const nuevoStock = stockActual + quantity;

    await updateDoc(productRef, { stockQuantity: nuevoStock });
  }

  // ==============================================================
  // 🗂️ OBTENER LISTA DE PRODUCTOS (CATEGORÍAS)
  // ==============================================================
  getCategories(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }
}
