import { CanDeactivate } from '@angular/router';
import { MemberEditComponent } from '../members/member-edit/member-edit.component';
import { Observable } from 'rxjs';

export class CanDeactivateUnsavedChanges implements CanDeactivate<MemberEditComponent>{
    canDeactivate(component: MemberEditComponent):Observable<boolean>|Promise<boolean>|boolean {
        if(component.editUserForm.dirty){
            return confirm('Are You Sure ! Unsaved changes will be lost')
        }
        return true;
        //throw new Error("Method not implemented.");
    }

}