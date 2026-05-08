import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FireService, TodoInterface } from './services/fire/fire';
import { AsyncPipe } from '@angular/common';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo-fire');
  private readonly _fireService = inject(FireService);
  public readonly todosList$: Observable<TodoInterface[]> = this._fireService.loadTodos().pipe(
    map((todos)=> {
      return todos.sort((a,b)=> {
        return a.title > b.title ? 1 : 0
      })
    }),
  );

  async handleAdd() {
    this._fireService.addDoc({
      title: 'Il est ' + new Date().toLocaleTimeString()
    });
  }

  async handleDone(todoId: string) {
    await this._fireService.done(todoId);
  }
}
