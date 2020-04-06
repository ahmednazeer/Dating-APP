import { PaginationResult } from './../../_models/pagination';
import { UserService } from './../../_services/user.service';
import { Component, OnInit } from '@angular/core';
import { User } from '../../_models/user';
import { AlertifyService } from '../../_services/alertify.service';
import { ActivatedRoute } from '@angular/router';
import { Pagination } from 'src/app/_models/Pagination';

@Component({
  selector: 'app-member-list',
  templateUrl: './member-list.component.html',
  styleUrls: ['./member-list.component.css']
})
export class MemberListComponent implements OnInit {
  users: User[] = [];
  paginaation: Pagination;
  user:User=JSON.parse(localStorage.getItem('user'));
  
  minAge=18;
  maxAge=99;
  orderBy='lastActive';
  gender=this.user.gender==='male'?'female':'male';
  userParams={gender:this.gender,minAge:this.minAge,maxAge:this.maxAge,orderBy:this.orderBy};

  genderList=[{value:'male',display:'Male'},{value:'female',display:'FeMale'}];

  resetFilters(){
    this.userParams.gender=this.user.gender==='male'?'female':'male';
    this.userParams.minAge=this.minAge;
    this.userParams.maxAge=this.maxAge;

    this.loadUsers();
  }

  
  constructor(private userService: UserService, private alertify: AlertifyService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      (data) => {
        this.users = data['users'].result;
        this.paginaation = data['users'].pagination;
      },
      error => {
        this.alertify.error(error);
      }
    );
  }

  pageChanged(event){
    this.paginaation.pageNumber=event.page;
    this.loadUsers();
  }
  loadUsers() {
    
    this.userService.getUsers(this.paginaation.pageNumber,this.paginaation.pageSize,this.userParams).subscribe(
      data => {
        //this.paginaation = data['users'].pagination;
        this.users = data.result;
        
      },
      error => {
        this.alertify.error(error);
      });
  }

}
