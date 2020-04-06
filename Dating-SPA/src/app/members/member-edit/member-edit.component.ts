
import { Component, OnInit, ViewChild } from '@angular/core';
import { User } from 'src/app/_models/user';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from 'src/app/_services/auth.service';
import { TimeagoIntl } from 'ngx-timeago';
import {strings as englishStrings} from 'ngx-timeago/language-strings/en';

@Component({
  selector: 'app-member-edit',
  templateUrl: './member-edit.component.html',
  styleUrls: ['./member-edit.component.css']
})
export class MemberEditComponent implements OnInit {
  user: User;
  photoUrl:string;
  live=true;
  @ViewChild('editUserForm') editUserForm: NgForm;
  constructor(private route: ActivatedRoute, private alertify: AlertifyService
    , private userService: UserService, private authService: AuthService 
    ,private intl: TimeagoIntl) { 
      intl.strings = englishStrings;
      intl.changes.next();

    }

  ngOnInit() {

    this.route.data.subscribe(
      data => {
        this.user = data['user'];
      }
    )
    this.changeMainPhoto();
  }
  updateUser() {
    this.userService.updateUser(this.authService.decoodedAccessToken.nameid, this.user).subscribe(
      next => {
        this.alertify.success('Profile Updated Successfully');
        this.editUserForm.reset(this.user);
      }
      , error => {
        this.alertify.error(error);
      }
    )

  }
  changeMainPhoto(){
    this.authService.currentPhotoUrl.subscribe(
      photoUrl=>this.photoUrl=photoUrl
    );
  }

}
