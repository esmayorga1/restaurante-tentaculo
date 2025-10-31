import { Injectable } from '@angular/core';
import { Firestore, collection, doc, addDoc, setDoc, updateDoc, deleteDoc, getDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

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

  // ===================== Agregar Nuevo Producto =====================
  async addProduct(product: Product): Promise<void> {
    const productsRef = collection(this.firestore, 'products');
    const docRef = await addDoc(productsRef, product);
    await updateDoc(doc(this.firestore, `products/${docRef.id}`), { id: docRef.id });
  }

  // ===================== Obtener Productos =====================
  getProducts1(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }

  // ===================== Obtener Producto por ID =====================
  getProductById(productId: string): Observable<Product> {
    const productRef = doc(this.firestore, `products/${productId}`);
    return getDoc(productRef).then(docSnap => {
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Product;
      } else {
        throw new Error('Producto no encontrado');
      }
    }) as unknown as Observable<Product>;
  }

  // ===================== Editar Producto =====================
  updateProduct(productId: string, updatedProduct: Product) {
    const productRef = doc(this.firestore, `products/${productId}`);
    return updateDoc(productRef, updatedProduct);
  }

  // ===================== Eliminar Producto =====================
  deleteProduct(productId: string): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    return deleteDoc(productRef);
  }

  // ===================== Actualizar Inventario =====================
  async updateProductStock(productId: string, quantitySold: number): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) throw new Error('Producto no encontrado');

    const stock = docSnap.data()['stockQuantity'] ?? 0;
    const newStock = stock - quantitySold;
    if (newStock < 0) throw new Error('Stock insuficiente para la venta');

    return updateDoc(productRef, { stockQuantity: newStock });
  }

  async increaseProductStock(productId: string, quantity: number): Promise<void> {
    const productRef = doc(this.firestore, `products/${productId}`);
    const docSnap = await getDoc(productRef);
    if (!docSnap.exists()) throw new Error('Producto no encontrado');
    if (quantity <= 0) throw new Error('Cantidad debe ser mayor a 0');

    const stock = docSnap.data()['stockQuantity'] ?? 0;
    return updateDoc(productRef, { stockQuantity: stock + quantity });
  }

  // ===================== Obtener Categorías =====================
  getCategories(): Observable<Product[]> {
    const productsRef = collection(this.firestore, 'products');
    return collectionData(productsRef, { idField: 'id' }) as Observable<Product[]>;
  }
}
