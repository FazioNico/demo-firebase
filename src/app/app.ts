import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FireService, TodoInterface } from './services/fire/fire';
import { AsyncPipe } from '@angular/common';
import { firstValueFrom, map, Observable } from 'rxjs';
import { authState } from '@angular/fire/auth';
import { GetDownloadURLPipe } from './pipes/getDownloadURL/get-download-url-pipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AsyncPipe, GetDownloadURLPipe],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  protected readonly title = signal('demo-fire');
  private readonly _fireService = inject(FireService);
  public readonly todosList$: Observable<TodoInterface[]> = this._fireService.todos$
  .pipe(
    map((todos)=> {
      return todos.sort((a,b)=> {
        return a.title > b.title ? 1 : 0
      })
    }),
  );
  public readonly user$ = this._fireService.user$;
  public readonly userProfile$ = this._fireService.getUserProfile();

  ngOnInit(): void {
    this._fireService.loadTodos();  
  }

  async handleFileToUpload($event: any) {
    const file = $event.target.files[0];
    await this._fireService.uploadFile(file);
  }

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
