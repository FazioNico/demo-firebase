import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyCXb3cJLnXLLN903GX43OHP4i71fA03LXs",
  authDomain: "demo2020-75757.firebaseapp.com",
  databaseURL: "https://demo2020-75757.firebaseio.com",
  projectId: "demo2020-75757",
  storageBucket: "demo2020-75757.appspot.com",
  messagingSenderId: "517554055042",
  appId: "1:517554055042:web:25cc92ed2a167c0f85519b"
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideAuth(() => getAuth())
  ]
};
