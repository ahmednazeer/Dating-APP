import { MessagesResolver } from './_resolvers/messages.resolver';
import { MemberEditResolver } from "./_resolvers/member-edit.resolver";
import { MemberslistResolver } from "./_resolvers/members-list.resolver";
import { AuthService } from "./_services/auth.service";
import { MessagesComponent } from "./messages/messages.component";

import { HomeComponent } from "./home/home.component";
import { Routes } from "@angular/router";
import { ListsComponent } from "./lists/lists.component";
import { AuthGuard } from "./_guards/auth.guard";
import { MemberListComponent } from "./members/member-list/member-list.component";
import { MemberDetailsComponent } from "./members/member-details/member-details.component";
import { MemberDetailsResolver } from "./_resolvers/member-details.resolver";
import { MemberEditComponent } from "./members/member-edit/member-edit.component";
import { CanDeactivateUnsavedChanges } from './_guards/canDeactivate-unsaved-changes.guard';
import { ListsResolver } from './_resolvers/lists.resolver';
export const appRputes: Routes = [
  { path: "", component: HomeComponent, pathMatch: "full" },
  { path: "home", component: HomeComponent },

  {
    path: "",
    runGuardsAndResolvers: "always",
    canActivate: [AuthGuard],
    children: [
      { path: "lists", component: ListsComponent,resolve:{users:ListsResolver} },
      {
        path: "members",
        component: MemberListComponent,
        resolve: { users: MemberslistResolver }
      },
      {
        path: "members/edit",
        pathMatch:"full",
        component: MemberEditComponent,
        resolve: { user: MemberEditResolver },
        canDeactivate:[CanDeactivateUnsavedChanges]
      },
      {
        path: "members/:id",
        component: MemberDetailsComponent,
        resolve: { user: MemberDetailsResolver }
      },
     
      { path: "messages", component: MessagesComponent,resolve:{messages:MessagesResolver} }
    ]
  },
  { path: "**", redirectTo: "home", pathMatch: "full" }
];
