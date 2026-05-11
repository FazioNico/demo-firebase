import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FireService, TodoInterface } from './services/fire/fire';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo-fire');
  private readonly _fireService = inject(FireService);
  public readonly todosList$: Observable<TodoInterface[]> = this._fireService.loadTodos()
  .pipe(
    map((todos)=> {
      return todos.sort((a,b)=> {
        return a.title > b.title ? 1 : 0
      })
    }),
  );
  public readonly user$ = this._fireService.user$;

  async handleSaveUserData() {
    // extract data from user$ Observable
    const user = await firstValueFrom(this.user$);
    // send to firebase service 
    if (!user) return;
    await this._fireService.saveUserData(user);
  }

  async handleLogout() {
    await this._fireService.logout();
  }

  async handleAuthWithGoogle() {
    await this._fireService.signInWithGoogle();
    await this.handleSaveUserData();
  }

  async handleAdd() {
    this._fireService.addDoc({
      title: 'Il est ' + new Date().toLocaleTimeString()
    });
  }

  async handleDone(todoId: string) {
    await this._fireService.done(todoId);
  }
}
