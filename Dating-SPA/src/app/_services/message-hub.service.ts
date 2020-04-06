import { Message } from 'src/app/_models/message';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from "./../../environments/environment";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HubConnection } from "@aspnet/signalr";
import { UserService } from "src/app/_services/user.service";
import { Injectable } from "@angular/core";
import { HubConnectionBuilder } from "@aspnet/signalr";
import { Subject } from "rxjs";

import * as signalR from "@aspnet/signalr";

@Injectable({
  providedIn: "root"
})
export class MessageHubService {
  newMessageSubject :Subject<Message>;//= new Subject<Message>();
  connectionId: string = "";
  private messageHub:HubConnection;
  userId:number;

  constructor(private userService: UserService, private http: HttpClient
    //,private auth:AuthService
    ) {
      //let headers=new HttpHeaders() .set('Authorization','Bearer '+localStorage.getItem('token'));
      //setInterval(()=>{
        this.newMessageSubject=new Subject<Message>();
        this.messageHub = new signalR.HubConnectionBuilder()
        .configureLogging(signalR.LogLevel.Debug)
        .withUrl("http://localhost:55954/message", {
          skipNegotiation: true,
          transport: signalR.HttpTransportType.WebSockets,
          accessTokenFactory: () => {
            return JSON.parse( localStorage.getItem('user')).id; },
        })
        .build();
      //},200)
      
    
  }
  startListening(userId) {
    this.messageHub.on("ReceiveMessage",this.getMessage);
    this.messageHub.on("OnConnected",this.addUserConnection);
    this.messageHub.on("OnManageUsers",this.deleteUserConnection);
    this.userId=userId;
    this.messageHub.start()
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

  getConnectionId() {
    this.messageHub.invoke("getConnectionId").then(connectionId => {
      this.connectionId = connectionId;
      console.log(connectionId);
      console.log("===========" + this.connectionId);

      return connectionId;
    });
  }
/*
  private registerSignalREvents(){
    this.messageHub.on("ReceiveMessage", (message: Message) => {
      console.log("the new message"+message);
      this.newMessageSubject.next(message);
    });
  }
*/
  addUserConnection(connectionId/*, userId*/) {
    /*return this.http.post(
      environment.baseUrl + "users/" + userId + "/connections/" + connectionId,
      {}
    );*/
    console.log("My ConnectionId  : "+connectionId);
      this.connectionId=connectionId;

      //this.registerUserConnection();


  }

  deleteUserConnection(activeConnections/*,connectionId, userId*/) {
    /*let url=environment.baseUrl + "users/" + userId + "/connections/" + connectionId;
    let headers=new HttpHeaders() .set('Authorization','Bearer '+localStorage.getItem('token'));
    return this.http.get(
      environment.baseUrl + "users/" + userId + "/connections/" + connectionId,{headers:headers}
    );*/
    console.log("Active Connections : "+activeConnections);
  }
/*

  setupConnection(userId){
    this.startListening("1"); //so that calling getConnectionId Method
        
        setTimeout(() => {
       
          this
            .addUserConnection(
              this.connectionId,
              userId
            )
            .subscribe(connection => {
              console.log("Connection Established Successfully !");
             
            });
        }, 2000);
  }
*/

  notifySecondUser(userIds,msg){
    this.messageHub.invoke("sendMessage",msg).then(/*connectionId*/() => {
      //this.connectionId = connectionId;
      //console.log(connectionId);
      /*console.log("===========" + this.connectionId);

      return connectionId;*/
    });
  }
  getMessage(message){
    //this.newMessageSubject=new Subject<Message>();
    this.newMessageSubject.next(message);
  }
  registerUserConnection(){
    this.messageHub.invoke("addNewUser",this.userId,this.connectionId).then(() => {
      //this.connectionId = connectionId;
      //console.log(connectionId);
      console.log("===========connection Id Registered Succesfully" + this.connectionId);

      //return connectionId;
    });
  }

}
