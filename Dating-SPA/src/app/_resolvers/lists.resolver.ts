import { UserService } from "./../_services/user.service";
import { MemberDetailsComponent } from "./../members/member-details/member-details.component";
import { Injectable } from "@angular/core";
import { Resolve, ActivatedRouteSnapshot, Router } from "@angular/router";
import { User } from "../_models/user";
import { Observable, pipe, of } from "rxjs";
import { AlertifyService } from "../_services/alertify.service";
import { catchError } from "rxjs/operators";

@Injectable()
export class ListsResolver implements Resolve<User[]> {
    //likeParameter:string="likers"
    constructor(
        private alertify: AlertifyService,
        private router: Router,
        private userService: UserService
    ) {
        //super();
    }
    resolve(route: ActivatedRouteSnapshot): Observable<User[]> {

        return this.userService.getUsers(1, 10, null, "likees").pipe(
            catchError(error => {
                this.alertify.error('Something wrong happened while retrieving the data');
                this.router.navigate(['/members']);
                return of(null)
            })
        )

    }
}