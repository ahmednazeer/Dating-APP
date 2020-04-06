import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor( private authService:AuthService,private router:Router,private alertify:AlertifyService){}
  canActivate(
   ): Observable<boolean > | Promise<boolean > | boolean  {

    if(this.authService.logedIn()){
      return true;
    }
    this.alertify.error('You Must Login First!!');
    this.router.navigate(['/home']);
    return false;
  }
  
}
