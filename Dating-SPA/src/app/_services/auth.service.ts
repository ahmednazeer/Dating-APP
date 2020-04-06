import { MessageHubService } from './message-hub.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { JwtHelperService } from "@auth0/angular-jwt";
import { User } from '../_models/user';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = "http://localhost:55954/api/auth/";

  jwtHelper = new JwtHelperService();
  decoodedAccessToken;
  currentUser: User;
  photoUrl=new BehaviorSubject<string>('../../assets/user.png');
  currentPhotoUrl=this.photoUrl.asObservable();


  constructor(private http: HttpClient,private messageHubService:MessageHubService) { }
  Login(model: any) {
    return this.http.post(this.baseUrl + 'login', model)
      .pipe(
        map((response: any) => {
          const user = response;
          console.log(response);
          this.decoodedAccessToken = this.jwtHelper.decodeToken(user.token);
          this.currentUser = user.user;
          localStorage.setItem('token', user.token);
          localStorage.setItem('user', JSON.stringify(this.currentUser));
          
          this.changePhotoUrl(this.currentUser.photoUrl);
          console.log(this.decoodedAccessToken);
        })
      );
  }

  register(model: any) {
    return this.http.post(this.baseUrl + 'register', model);
  }

  logedIn() {
    let token = localStorage.getItem('token');
    return !this.jwtHelper.isTokenExpired(token);
  }

  changePhotoUrl(photoUrl){
    this.photoUrl.next(photoUrl);
    this.currentUser.photoUrl=photoUrl;
    localStorage.setItem('user',JSON.stringify(this.currentUser));
    
}

}
