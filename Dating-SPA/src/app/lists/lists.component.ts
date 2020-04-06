import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit } from '@angular/core';
import { Pagination } from '../_models/Pagination';
import { User } from '../_models/user';
import { AlertifyService } from '../_services/alertify.service';
import { AuthService } from '../_services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lists',
  templateUrl: './lists.component.html',
  styleUrls: ['./lists.component.css']
})
export class ListsComponent implements OnInit {
  likesParam = 'Likees';
  pagination: Pagination;
  users: User[] = [];
  constructor(private userService: UserService, private alertify: AlertifyService
    , private auth: AuthService,private route:ActivatedRoute) { }

  ngOnInit() {
    this.route.data.subscribe(
      data=>{
        this.users = data['users'].result;
        this.pagination = data['users'].pagination;
      },
      error => {
        this.alertify.error(error);
      }
    )
  }

  loadUsers(){
    this.userService.getUsers(this.pagination.pageNumber,this.pagination.pageSize,null,this.likesParam).subscribe(
      data=>{
        this.users=data.result;
        this.pagination=data.pagination;
      }
    )
  }

  pageChanged(event){
    this.pagination.pageNumber=event.page;
  }
}
