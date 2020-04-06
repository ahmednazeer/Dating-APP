//import { messageHub } from './../../_services/message-hub.service';
import { Message } from 'src/app/_models/message';
import { AlertifyService } from './../../_services/alertify.service';
import { AuthService } from './../../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit, Input, OnDestroy } from '@angular/core';

import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { tap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { MessageHubService } from 'src/app/_services/message-hub.service';
import { Subject } from 'rxjs';
import { HubConnection } from '@aspnet/signalr';
import * as signalR from '@aspnet/signalr';


@Component({
  selector: 'app-member-messages',
  templateUrl: './member-messages.component.html',
  styleUrls: ['./member-messages.component.css']
})
export class MemberMessagesComponent implements OnInit {
  @Input() receiverId: number;
  messages: Message[];
  newMessage: any = {}
  live: true;
  newMessageSubject :Subject<Message>;//= new Subject<Message>();
  connectionId: string = "";
   messageHubConnection:HubConnection;
  //connectionId:string;
  constructor(
    private userService: UserService
    , private auth: AuthService
    , private alertifyService: AlertifyService
    //,private messageHub:MessageHubService
    , private intl: TimeagoIntl) {
    intl.strings = englishStrings;
    intl.changes.next();

//====================================================
this.newMessageSubject=new Subject<Message>();
        this.messageHubConnection = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl("http://localhost:55954/message", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => {
            return JSON.parse( localStorage.getItem('user')).id; },
        })
        .build();
//====================================================

    
  }
  startListening(userId) {
    this.messageHubConnection.on("ReceiveMessage",/*this.getMessage*/(msg)=>{
      this.AddMessage(msg);
    });
    this.messageHubConnection.on("OnConnected",this.addUserConnection);
    this.messageHubConnection.on("OnManageUsers",this.deleteUserConnection);
    //this.userId=userId;
    this.messageHubConnection.start()
      .then(() => {
        console.log("Connection started!");
        //if (connectionId) {
         /* this.registerSignalREvents();
          this.getConnectionId();*/
          //console.log(this.connectionId);
        //}

      })
      .catch(function(e) {
        setTimeout(() =>
         {
          this. startListening(userId);
        }, 5000);

      }
      );
    
  }
  addUserConnection(connectionId) {
    console.log("My ConnectionId  : "+connectionId);
      this.connectionId=connectionId;
  }

  deleteUserConnection(activeConnections) {
    console.log("Active Connections : "+activeConnections);
  }


  notifySecondUser(userIds,msg){
    this.messageHubConnection.invoke("sendMessage",msg).then(/*connectionId*/() => {
     
    });
  }

  getMessage(message){
    //this.messages.unshift(message);
    //this.newMessageSubject.next(message);
    this.AddMessage(message);
  }



  ngOnInit() {

    //this.newMessage.sendAt=new Date();
    const userId = +this.auth.decoodedAccessToken.nameid;
    this.userService.getMessageThread(this.auth.decoodedAccessToken.nameid, this.receiverId)
      .pipe(
        tap((messages:Message[])=>{
          for(let i=0;i<messages.length;i++){
            let pipe = new DatePipe('en-US'); // Use your own locale
            messages[i].ReadAt=pipe.transform(messages[i].ReadAt);
            if(messages[i].isRead===false&&messages[i].receiverId===userId){
              this.userService.markMessageRead(messages[i].id,userId);
              //messages[i].ReadAt=/*new Date(*/pipe.transform(messages[i].ReadAt/*,'MMM d, y, h:mm:ss a')*/);
              messages[i].ReadAt=Date.now;
            }
          }
        })
      )
      .subscribe(
        (messages: Message[]) => {
          this.messages = messages;

          //setup connection
          //this.messageHub.setupConnection(this.auth.decoodedAccessToken.nameid);
          this.startListening(this.auth.decoodedAccessToken.namid);
          //this.messageHub.registerUserConnection();

        }, error => {
          this.alertifyService.error(error);
        }
      );

      this.newMessageSubject.subscribe(
      message=>{
        this.messages.unshift(message);
        console.log("new Message : "+message);
      },
      error=>{
        this.alertifyService.error(error);
      }
    )

      
  }


AddMessage(newMes){
  this.messages.unshift(newMes);
}



  sendMessage() {
    this.newMessage.receiverId = this.receiverId;
    this.newMessage.senderId = this.auth.decoodedAccessToken.nameid;
    this.userService.sendMessage(this.auth.decoodedAccessToken.nameid, this.newMessage).subscribe(
      (data:{msg,iDs}/*message: Message*/) => {
        //this.messages.unshift(message);
        this.messages.unshift(data.msg);
        let ids=data.iDs;
        this.notifySecondUser(ids,data.msg);


      }, error => {
        this.alertifyService.error(error);
      }
    )
  }

}
