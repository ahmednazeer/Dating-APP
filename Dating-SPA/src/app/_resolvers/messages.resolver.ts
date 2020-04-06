import { AuthService } from './../_services/auth.service';
import { Message } from './../_models/message';
import { UserService } from "../_services/user.service";

import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";

import { Observable, pipe, of } from "rxjs";
import { AlertifyService } from "../_services/alertify.service";
import { catchError } from "rxjs/operators";

@Injectable()
export class MessagesResolver implements Resolve<Message[]> {
  /**
   *
   */
  constructor(
    private alertify: AlertifyService,
    private router: Router,
    private userService: UserService,
    private authService: AuthService
  ) {
    //super();
  }
  resolve(route: ActivatedRouteSnapshot): Observable<Message[]> {

    return this.userService.getMessages(this.authService.decoodedAccessToken.nameid).pipe(
      catchError(error => {
        this.alertify.error('Something wrong happened while retrieving the data');
        this.router.navigate(['/members']);
        return of(null)
      })
    )

  }
}