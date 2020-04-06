import { MessageHubService } from './_services/message-hub.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './_services/auth.service';
import { Component } from '@angular/core';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit,OnDestroy {
  jwtHelper=new JwtHelperService();
  connectionId:string;
  constructor(private authService:AuthService,private messageHubService:MessageHubService) {}
  ngOnDestroy(): void {
    
        
  }

  ngOnInit(): void {
    const token=localStorage.getItem('token');
    const user=localStorage.getItem('user');
    if(token){
      this.authService.decoodedAccessToken=this.jwtHelper.decodeToken(token);
      /*this.messageHubService.startListening();
      //let connectionId;
      setTimeout(()=>{
        this.connectionId =this.messageHubService.connectionId;
        this.messageHubService.addUserConnection(this.connectionId,this.authService.decoodedAccessToken.nameid)
      .subscribe(
        connection=>{
          console.log("Connection Established Successfully !");
        
      })
      },2000) ;
      */

    }
    if(user){
      this.authService.currentUser=JSON.parse(user);
      this.authService.changePhotoUrl(this.authService.currentUser.photoUrl);
    }
    //check for connectionId
    /*let connId=localStorage.getItem("connectionId");
    if(connId){
      this.messageHubService.startListening();
    }*/
     
  }
}
