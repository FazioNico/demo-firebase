import { inject, Injectable } from '@angular/core';
import { collection, collectionData, doc, Firestore, query, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from "uuid";

@Injectable({
  providedIn: 'root',
})
export class FireService {
  private readonly _fire = inject(Firestore);

  async addDoc(data: {title: string;}) {
    const id = uuidv4();
    const docRef = doc(this._fire, 'nomades-todos-list/' + id);
    await setDoc(docRef, {...data}).catch(error => {
      console.log('error firebase', )
    });
  }

  loadTodos() {
    const colRef = collection(this._fire, 'nomades-todos-list');
    const q = query(colRef);
    const datas$ = collectionData(q, {idField: 'id'}) as Observable<{title: string; id: string;}[]>;
    return datas$;
  }
}
