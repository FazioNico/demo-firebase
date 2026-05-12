import { inject, Pipe, PipeTransform } from '@angular/core';
import { getDownloadURL, ref, Storage } from '@angular/fire/storage';

@Pipe({
  name: 'getDownloadURL',
})
export class GetDownloadURLPipe implements PipeTransform {
  private readonly _storage = inject(Storage);

  transform(value: any): Promise<string> {
    const storageRef = ref(this._storage, value);
    return getDownloadURL(storageRef);
  }
}
