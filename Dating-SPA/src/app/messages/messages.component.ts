import { Pagination } from './../_models/pagination';
import { AlertifyService } from './../_services/alertify.service';
import { AuthService } from './../_services/auth.service';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Message } from '../_models/message';
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';


@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.css']
})
export class MessagesComponent implements OnInit {
  messages: Message[];
  pagination: Pagination;
  messageType='Unread';
  live:true;
  constructor(private userService: UserService
    , private authService: AuthService
    , private alertifyService: AlertifyService
    , private route: ActivatedRoute, private intl: TimeagoIntl) {
      intl.strings = englishStrings;
      intl.changes.next();
    }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.messages = data['messages'].result;
        console.log(this.messages);
        this.pagination = data['messages'].pagination;
      },
      error => {
        this.alertifyService.error(error);
      }
    )
  }
  loadMessages(){
    this.userService.getMessages(this.authService.decoodedAccessToken.nameid
      ,this.pagination.pageNumber
      ,this.pagination.pageSize,
      this.messageType).subscribe(
        (data:any)=>{
          this.messages=data.result;
          this.pagination=data.pagination;

        }
      )
  }

  pageChanged(event){
    this.pagination.pageNumber=event.page;
    this.loadMessages();
  }
  deleteMessage(messageId,messageIndex){
    this.alertifyService.confirm("Are you sure you want to delete this message ?",()=>{
      this.userService.deleteMessage(messageId,this.authService.decoodedAccessToken.nameid).subscribe(
        ()=>{
          this.messages.splice(messageIndex,1);
          this.alertifyService.success("Message deleted successfully");
        }
      )
    })
    
  }

}
