import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit, Input } from '@angular/core';
import { User } from 'src/app/_models/user';
import { AuthService } from 'src/app/_services/auth.service';
import { AlertifyService } from 'src/app/_services/alertify.service';

@Component({
  selector: 'app-member-card',
  templateUrl: './member-card.component.html',
  styleUrls: ['./member-card.component.css']
})
export class MemberCardComponent implements OnInit {
  @Input() user:User;
  constructor(private auth:AuthService,private userService:UserService,private alert:AlertifyService) { }

  ngOnInit() {
  }

  sendLike(){
      this.userService.sendLike(+this.auth.decoodedAccessToken.nameid,this.user.id).subscribe(
        ()=>{
          this.alert.success("User "+this.user.knownAs+' Liked Successfully .');
        },
        error=>{
          this.alert.error(error);
        }
      )
  }

}
