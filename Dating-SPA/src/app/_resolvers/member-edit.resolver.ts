import { catchError } from "rxjs/operators";
import { UserService } from "./../_services/user.service";
import { AuthService } from "./../_services/auth.service";
import { Observable, of } from "rxjs";
import { Injectable } from "@angular/core";
import { Resolve, Router, ActivatedRouteSnapshot } from "@angular/router";
import { User } from "../_models/user";
import { AlertifyService } from "../_services/alertify.service";

@Injectable()
export class MemberEditResolver implements Resolve<User> {
  /**
   *
   */
  constructor(
    private auth: AuthService,
    private router: Router,
    private userService: UserService,
    private alertify: AlertifyService
  ) {}
  resolve(route: ActivatedRouteSnapshot): Observable<User> {
      let decodedToken=this.auth.decoodedAccessToken;
      console.log(decodedToken);
    let id = this.auth.decoodedAccessToken.nameid;
    return this.userService.getUser(id).pipe(
      catchError(error => {
        this.alertify.error("Error while retrieving data");
        this.router.navigate(['/home']);
        return of(null);
      })
    );
    //throw new Error("Method not implemented.");
  }
}
