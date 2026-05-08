import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from "uuid";
import { environment } from '../../../environments/environment';

export interface TodoInterface {
  title: string; 
  id: string;
  done?: boolean;
}
@Injectable({
  providedIn: 'root',
})
export class FireService {
  private readonly _fire = inject(Firestore);

  constructor() {
    console.log('FireService created', environment.name);
  }

  async addDoc(data: {title: string;}) {
    const id = uuidv4();
    const docRef = doc(this._fire, 'nomades-todos-list/' + id);
    await setDoc(docRef, {...data}).catch(error => {
      console.log('error firebase', )
    });

    // const colRef = collection(this._fire, 'nomades-todos-list');
    // await addDoc(colRef, data).catch(error => {
    //   console.log('error: ', error);
    // });
  }

  loadTodos() {
    const colRef = collection(this._fire, 'nomades-todos-list');
    const q = query(colRef);
    const datas$ = collectionData(q, {idField: 'id'}) as Observable<TodoInterface[]>;
    return datas$;
  }

  async done(id: string) {
    const docRef = doc(this._fire, `nomades-todos-list/${id}`);
    await updateDoc(docRef, {done: true, updatedAt: new Date().toISOString()}).catch(erreur => {
      console.log('error: ', erreur);
    });
  }
}
