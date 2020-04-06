import { HubConnection } from '@aspnet/signalr';
import { MemberMessagesComponent } from './members/member-messages/member-messages.component';
import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberEditComponent } from './members/member-edit/member-edit.component';
import { MemberEditResolver } from './_resolvers/member-edit.resolver';
import { MemberslistResolver } from './_resolvers/members-list.resolver';
import { MemberDetailsComponent } from './members/member-details/member-details.component';
import { RouterModule } from '@angular/router';
import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

// RECOMMENDED
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { TabsModule } from 'ngx-bootstrap';
import { NgxGalleryModule } from '@kolkov/ngx-gallery';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { TimeagoModule, TimeagoIntl, TimeagoFormatter, TimeagoCustomFormatter } from 'ngx-timeago';


import { HttpClientModule } from "@angular/common/http";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";

import { NavComponent } from "./nav/nav.component";
import { HomeComponent } from "./home/home.component";
import { AuthService } from "./_services/auth.service";

import { RegisterComponent } from "./register/register.component";
import { ErrorInterceptorProvider } from "./_services/error.interceptor";
import { AlertifyService } from "./_services/alertify.service";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ListsComponent } from './lists/lists.component';
import { MessagesComponent } from './messages/messages.component';
import { appRputes } from './routes';
import { AuthGuard } from './_guards/auth.guard';
import { UserService } from './_services/user.service';
import { MemberCardComponent } from './members/member-card/member-card.component';
import { MemberListComponent } from './members/member-list/member-list.component';
import { JwtModule } from '@auth0/angular-jwt';
import { MemberDetailsResolver } from './_resolvers/member-details.resolver';
import { CanDeactivateUnsavedChanges } from './_guards/canDeactivate-unsaved-changes.guard';
import { PhotoEditorComponent } from './members/photo-editor/photo-editor.component';
import { FileUploadModule } from 'ng2-file-upload';
import { MyIntl } from './_helpers/MyIntl';
import { ListsResolver } from './_resolvers/lists.resolver';
import { MessageHubService } from './_services/message-hub.service';
//import { CanDeactivateMemberMessages } from './_guards/canDeactivate-memberMessages.guard';



export function tokenGetter() {
   return localStorage.getItem('token');
}

@NgModule({
   declarations: [
      AppComponent,
      NavComponent,
      HomeComponent,
      RegisterComponent,
      ListsComponent,
      MemberListComponent,
      MessagesComponent,
      MemberCardComponent,
      MemberDetailsComponent,
      MemberEditComponent,
      PhotoEditorComponent,
      MemberMessagesComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgxGalleryModule,
      FileUploadModule,
      ReactiveFormsModule,

      BsDropdownModule.forRoot(),
      TabsModule.forRoot(),
      BsDatepickerModule.forRoot(),
      PaginationModule.forRoot(),
      ButtonsModule.forRoot(),
      TimeagoModule.forRoot({
         intl: { provide: TimeagoIntl, useClass: MyIntl },
         formatter: { provide: TimeagoFormatter, useClass: TimeagoCustomFormatter },
       }),

      FormsModule,
      RouterModule.forRoot(appRputes),
      JwtModule.forRoot({
         config: {
            tokenGetter: tokenGetter,
            whitelistedDomains: ["localhost:55954"],
            blacklistedRoutes: ["localhost:55954/api/auth"]
         }
      })

   ],
   exports: [
      //TabsModule.forRoot()
      
   ],
   providers: [
      AuthService,
      ErrorInterceptorProvider,
      AlertifyService,
      AuthGuard,
      UserService,
      MemberDetailsResolver,
      MemberslistResolver,
      MemberEditResolver,
      CanDeactivateUnsavedChanges,
      ListsResolver,
      MessagesResolver,
      MessageHubService,
       
      //CanDeactivateMemberMessages
     
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule { }
