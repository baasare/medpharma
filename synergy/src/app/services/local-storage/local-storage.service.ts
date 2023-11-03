import {Injectable} from '@angular/core';
import { enc, AES } from 'crypto-js';
import {environment} from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() {
  }

  private static encrypt(txt: string): string {
    return AES.encrypt(txt, environment.secret_key).toString();
  }

  private static decrypt(txtToDecrypt: string) {
    return AES.decrypt(txtToDecrypt, environment.secret_key).toString(enc.Utf8);
  }


  public saveData(key: string, value: string) {
    localStorage.setItem(key, LocalStorageService.encrypt(value));
  }

  public getData(key: string) {
    const data = localStorage.getItem(key) || '';
    return LocalStorageService.decrypt(data);
  }

  public removeData(key: string) {
    localStorage.removeItem(key);
  }

  public clearData() {
    localStorage.clear();
  }
}
