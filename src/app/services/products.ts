import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({
  providedIn: 'root'
})
export class Products {

  constructor(private firestore: AngularFirestore) {}

  // =====================Agregar Nuevo Producto====================

  addProduct2(product: any): Promise<any> {
    return this.firestore.collection('products').add(product);
  }

  addProduct(product: any): Promise<void> {
    // Crear el documento sin un ID específico y obtener una referencia a él
    const productRef = this.firestore.collection('products').doc(); 
    const id = productRef.ref.id; // Obtener el ID generado automáticamente
  
    // Establecer los datos del producto con el ID dentro de los mismos datos
    return productRef.set({ ...product, id });
  }

  // =================== Obtener Producto ================================

  getProducts1(): Observable<any[]> {
    return this.firestore.collection('products').snapshotChanges().pipe(
      map(actions => 
        actions.map(a => {
          const data = a.payload.doc.data();  
          const id = a.payload.doc.id;        
          return { id, data };      
        })
      )
    );
  }
  
  // =================== Editar Producto ================================
  
  updateProduct(productId: string, updatedProduct: any) {
    return this.firestore.collection('products').doc(productId).update(updatedProduct);
  }
  

   // =================== Eliminar Producto ================================
  
  deleteProduct(productId: string): Promise<void> {
    return this.firestore.collection('products').doc(productId).delete();
  }

  getProductById(productId: string): Observable<any> {
    return this.firestore.collection('products').doc(productId).snapshotChanges().pipe(
      map(action => {
        const data = action.payload.data();
        const id = action.payload.id;
        // console.log(productId)
       
        // console.log(id)
        // console.log(data)
        return { id, data };  
      })
    );
  }


  // ===================== Actualizar Inventario =====================
updateProductStock(productId: string, quantitySold: number): Promise<void> {
  const productRef = this.firestore.collection('products').doc(productId);
  return productRef.get().toPromise().then((doc: any) => {
    if (doc.exists) {
      const currentStock = doc.data().stockQuantity;
      const newStock = currentStock - quantitySold;

      if (newStock >= 0) {
        return productRef.update({ stockQuantity: newStock });
      } else {
        throw new Error('Stock insuficiente para la venta');
      }
    } else {
      throw new Error('Producto no encontrado');
    }
  });
}

// ===================== Aumentar Inventario =====================

updateProductStock3(productId: string, newStock: number): Promise<void> {
  const productRef = this.firestore.collection('products').doc(productId);
  return productRef.update({
    'data.stockQuantity': newStock
  });
}

updateProductStock2(productId: string, newStock: number): Promise<void> {
  const productRef = this.firestore.collection('products').doc(productId);

  return productRef.update({
    stockQuantity: newStock
  });
}


increaseProductStock(productId: string, quantitySold: number): Promise<void> { 
  const productRef = this.firestore.collection('products').doc(productId);

  return productRef.get().toPromise()
    .then((doc: any) => {
      if (doc.exists) {
        const currentStock = doc.data().stockQuantity;

        // Asegurarse de que la cantidad a restaurar sea positiva
        if (quantitySold <= 0) {
          throw new Error('La cantidad a restaurar debe ser mayor que cero');
        }

        // Calcular el nuevo stock
        const newStock = currentStock + quantitySold;
        console.log('Stock actual:', currentStock);
        console.log('Cantidad a restaurar:', quantitySold);
        console.log('Nuevo stock:', newStock);

        // Actualizar el stock solo si el nuevo stock es diferente
        if (newStock !== currentStock) {
          return productRef.update({ stockQuantity: newStock });
        } else {
          console.log('El stock no necesita actualización.');
          return Promise.resolve(); // No actualizamos si el stock no cambia
        }
      } else {
        throw new Error('Producto no encontrado');
      }
    })
    .catch((error) => {
      console.error('Error al aumentar el stock:', error);
      throw error; // Vuelve a lanzar el error para manejarlo en el componente
    });
}


getProductByIdOnce(productId: string): Observable<any> {
  return this.firestore.collection('products').doc(productId).get().pipe(
    map(doc => {
      if (doc.exists) {
        const data = doc.data();
        return { id: doc.id, data };
      } else {
        throw new Error('Producto no encontrado');
      }
    })
  );
}


  // Método para obtener todas las categorías de los productos
  getCategories(): Observable<any[]> {
    return this.firestore.collection('products').valueChanges();}

}
