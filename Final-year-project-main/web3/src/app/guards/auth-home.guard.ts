import { Injectable } from '@angular/core';
import { CanActivate} from '@angular/router';
import { Observable } from 'rxjs';
import { MoralisService } from '../Shared/services/moralis.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHomeGuard implements CanActivate {
  session:boolean=false;
  constructor(private _moralis:MoralisService){
  }
  canActivate=():Observable<boolean>|Promise<boolean>|boolean => {
    return this._moralis.checkSession();
  }
}
