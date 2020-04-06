import { AuthService } from './../_services/auth.service';
import { MessageHubService } from './../_services/message-hub.service';
import { CanDeactivate } from '@angular/router';
import { MemberMessagesComponent } from '../members/member-messages/member-messages.component';
import { Injectable } from '@angular/core';
import { error } from 'protractor';
@Injectable()
export class CanDeactivateMemberMessages implements CanDeactivate<MemberMessagesComponent>{
    /**
     *
     */
    constructor(private messageHubService:MessageHubService,private auth:AuthService) {
        //super();
        
    }
    canDeactivate(component: MemberMessagesComponent, currentRoute: import("@angular/router").ActivatedRouteSnapshot, currentState: import("@angular/router").RouterStateSnapshot, nextState?: import("@angular/router").RouterStateSnapshot): boolean | import("@angular/router").UrlTree | import("rxjs").Observable<boolean | import("@angular/router").UrlTree> | Promise<boolean | import("@angular/router").UrlTree> {
        this.messageHubService.deleteUserConnection(component.connectionId
            ,this.auth.decoodedAccessToken.nameid).subscribe(
                ()=>{
                    console.log("connection deleted successfully !");
                },error=>{
                    console.log(error);
                }
            )
        //throw new Error("Method not implemented.");
    }

}