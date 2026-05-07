import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FireService } from './services/fire/fire';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('demo-fire');
  private readonly _fireService = inject(FireService);
  public readonly todosList$ = this._fireService.loadTodos();

  async handleAdd() {
    this._fireService.addDoc({
      title: 'Il est ' + new Date().toLocaleTimeString()
    });
  }
}
