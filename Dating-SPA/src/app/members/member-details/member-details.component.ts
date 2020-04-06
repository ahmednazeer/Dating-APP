import { AuthService } from './../../_services/auth.service';
import { MessageHubService } from './../../_services/message-hub.service';
import { UserService } from "./../../_services/user.service";
import { Component, OnInit, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { User } from "src/app/_models/user";
import { ActivatedRoute } from "@angular/router";
import { AlertifyService } from "src/app/_services/alertify.service";
import {
  NgxGalleryOptions,
  NgxGalleryImage,
  NgxGalleryAnimation
} from "@kolkov/ngx-gallery";
import { TimeagoIntl } from 'ngx-timeago';
import { strings as englishStrings } from 'ngx-timeago/language-strings/en';
import { TabsetComponent } from 'ngx-bootstrap/tabs/tabset.component';


@Component({
  selector: "app-member-details",
  templateUrl: "./member-details.component.html",
  styleUrls: ["./member-details.component.css"]
})
export class MemberDetailsComponent implements OnInit,AfterViewInit  {
  galleryOptions: NgxGalleryOptions[];
  galleryImages: NgxGalleryImage[];
  user: User;
  live:true;
  tabIndex:number;
  cdr:ChangeDetectorRef;
  @ViewChild('tabset', { static: false }) staticTabs: TabsetComponent;
  constructor(
    private route: ActivatedRoute,
    private alertify: AlertifyService,
    private userService: UserService,
    private messageHubService:MessageHubService,
    private auth:AuthService, 
    private intl: TimeagoIntl) {
    intl.strings = englishStrings;
    intl.changes.next();
  }
  ngAfterViewInit(): void {
    this.staticTabs.tabs[this.tabIndex>0?this.tabIndex:0].active = true;
    
  }

  ngOnInit() {
    this.route.data.subscribe(
      data => {
        this.user = data["user"];
      },
      error => {
        this.alertify.error(error);
      }
    );

    this.route.queryParams.subscribe(
      (param)=>{
        this.tabIndex=+param['tab'];
        
        
      }
    );


    this.galleryImages = this.getImages();
    this.galleryOptions = [
      {
        width: "600px",
        height: "600px",
        imagePercent: 100,
        thumbnailsColumns: 4,
        imageAnimation: NgxGalleryAnimation.Slide,
        preview: false
      }
    ];

    


  }

  getImages() {
    let userImages = [];
    for (let i = 0; i < this.user.photos.length; i++) {
      userImages.push({
        small: this.user.photos[i].url,
        medium: this.user.photos[i].url,
        big: this.user.photos[i].url
      });
    }
    return userImages;
  }

  selectTab(tabId: number) {
    this.staticTabs.tabs[tabId].active = true;
/*
if(tabId!=3){
  if(this.messageHubService.connectionId!=null&&this.messageHubService.connectionId!=undefined){
    this.messageHubService.deleteUserConnection(this.messageHubService.connectionId
      ,this.auth.decoodedAccessToken.nameid).subscribe(
          ()=>{
              console.log("connection deleted successfully !");
              this.messageHubService.connectionId=null;
          },error=>{
              console.log(error);
          }
      )
  }
}else{
  if(this.messageHubService.connectionId==null||this.messageHubService.connectionId==undefined)
    this.messageHubService.setupConnection(this.auth.decoodedAccessToken.nameid);
}*/

  }
}
