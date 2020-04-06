import { Component, OnInit } from "@angular/core";
import { AuthService } from "../_services/auth.service";
import { AlertifyService } from "./../_services/alertify.service";
import { Router } from "@angular/router";
import { MessageHubService } from "../_services/message-hub.service";

@Component({
  selector: "app-nav",
  templateUrl: "./nav.component.html",
  styleUrls: ["./nav.component.css"]
})
export class NavComponent implements OnInit {
  model: any = {};
  photoUrl: string;
  constructor(
    public auth: AuthService,
    private alertifyService: AlertifyService,
    private router: Router,
    private messageHubService: MessageHubService
  ) {}

  ngOnInit() {
    this.auth.currentPhotoUrl.subscribe(photoUrl => (this.photoUrl = photoUrl));
  }
  Login() {
    this.auth.Login(this.model).subscribe(
      next => {
        this.alertifyService.success("User Logged in successfully");
        /*
        this.messageHubService.startListening("1"); //so that calling getConnectionId Method
        let connectionId;
        setTimeout(() => {
          connectionId = this.messageHubService.connectionId;
          this.messageHubService
            .addUserConnection(
              connectionId,
              this.auth.decoodedAccessToken.nameid
            )
            .subscribe(connection => {
              console.log("Connection Established Successfully !");
              localStorage.setItem("connectionId", connectionId);
            });
        }, 2000);*/
      },
      error => {
        this.alertifyService.error(error);
      },
      () => {
        this.router.navigate(["/members"]);
      }
    );
  }

  LoggedInUser() {
    return this.auth.logedIn();
  }

  Logout() {
    const token = localStorage.getItem("token");
    if (token) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      this.alertifyService.message("Logged out");
      this.router.navigate(["/home"]);
      /*
      this.messageHubService
        .deleteUserConnection(
          localStorage.getItem("connectionId"),
          this.auth.decoodedAccessToken.nameid
        )
        .subscribe(
          () => {
            console.log("Connection Deleted Successfully !");
            //localStorage.removeItem("connectionId");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
          },
          error => {
            console.log(error);
          }
        );

      //localStorage.removeItem("user");
      this.alertifyService.message("Logged out");
      this.router.navigate(["/home"]);*/
    }
  }
}
