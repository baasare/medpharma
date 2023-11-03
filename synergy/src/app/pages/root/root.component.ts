import {ChangeDetectionStrategy, Component} from '@angular/core';
import * as CryptoJS from 'crypto-js';
import {environment} from "../../../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './root.component.html',
  styleUrls: ['./root.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RootComponent {
  products =
    {
      "ezwich": "Ezwich",
      "powercard": "GhLink/GIP",
      "ghanapay": "GhanaPay"
    }


  constructor() {
  }

  encrypt(txt: string) {
    return CryptoJS.AES.encrypt(txt, environment.secret_key).toString().replace(/\//g, 's1L2a3S4h');
  }
}
