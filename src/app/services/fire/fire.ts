import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, doc, Firestore, query, setDoc, updateDoc, where } from '@angular/fire/firestore';
import { firstValueFrom, map, Observable, switchMap, throwError } from 'rxjs';
import { v4 as uuidv4 } from "uuid";
import { environment } from '../../../environments/environment';
import { Auth, authState, GoogleAuthProvider, signInWithPopup, signOut, User } from '@angular/fire/auth';

export interface TodoInterface {
  title: string; 
  id: string;
  done?: boolean;
  uid: string;
}

@Injectable({
  providedIn: 'root',
})
export class FireService {
  private readonly _fire = inject(Firestore);
  private readonly _auth = inject(Auth);
  public readonly user$ = authState(this._auth);

  constructor() {
    console.log('FireService created', environment.name);
  }

  async saveUserData(data: User) {
    const docRef = doc(this._fire, `users-data/${data.uid}`);
    await setDoc(docRef, {
      email: data.email,
      displayName: data.displayName
    });
  }

  async signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(this._auth, provider);
    console.log(result.user);
  }

  async logout() {
    await signOut(this._auth);
  }

  async addDoc(data: {title: string;}) {
    const id = uuidv4();
    const docRef = doc(this._fire, 'nomades-todos-list/' + id);
    const user = await firstValueFrom(this.user$);
    if (!user) {
      throw new Error('User not authenticated');
    }
    await setDoc(docRef, {...data, uid: user.uid}).catch(error => {
      console.log('error firebase', )
    });

    // const colRef = collection(this._fire, 'nomades-todos-list');
    // await addDoc(colRef, data).catch(error => {
    //   console.log('error: ', error);
    // });
  }

  loadTodos() {
    const colRef = collection(this._fire, 'nomades-todos-list');
    return this.user$.pipe(
      switchMap((user) => {
        if (!user) {
          throwError(()=> new Error('no user'));
        }
        const fromUserId = where('uid', '==', user!.uid);
        const q = query(colRef, fromUserId);
        const datas$ = collectionData(q, {idField: 'id'}) as Observable<TodoInterface[]>;
        return datas$;
      })
    );
  }

  async done(id: string) {
    const docRef = doc(this._fire, `nomades-todos-list/${id}`);
    await updateDoc(docRef, {done: true, updatedAt: new Date().toISOString()}).catch(erreur => {
      console.log('error: ', erreur);
    });
  }
}
