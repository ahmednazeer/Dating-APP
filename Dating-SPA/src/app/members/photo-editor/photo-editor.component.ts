import { Component, OnInit, Input, Output } from '@angular/core';
import { Photo } from 'src/app/_models/photo';
import { FileUploader } from 'ng2-file-upload';
import { AuthService } from 'src/app/_services/auth.service';
import { environment } from 'src/environments/environment';
import { UserService } from 'src/app/_services/user.service';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-photo-editor',
  templateUrl: './photo-editor.component.html',
  styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
  @Input() photos: Photo[];
  @Output() ChangeMainPhoto;
  uploader: FileUploader;
  hasBaseDropZoneOver: boolean;
  hasAnotherDropZoneOver: boolean;
  response: string;
  currentMainPhoto: Photo;

  constructor(private authService: AuthService, private userService: UserService
    , private alertify: AlertifyService) {

    this.ChangeMainPhoto = new EventEmitter();
    this.uploader = new FileUploader({
      url: environment.baseUrl + 'users/' + authService.decoodedAccessToken.nameid + '/photos',
      allowedFileType: ['image'],
      authToken: 'Bearer ' + localStorage.getItem('token'),
      removeAfterUpload: true,
      autoUpload: false,
      maxFileSize: 10 * 1024 * 1024
    });

    this.hasBaseDropZoneOver = false;
    this.hasAnotherDropZoneOver = false;
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false };
    this.uploader.onSuccessItem = (file, response, status, headers) => {
      const res = JSON.parse(response);
      let photo = {
        id: res.id,
        url: res.url,
        isMain: res.isMain,
        description: res.description,
        dateAdded: res.dateAdded
      }
      this.photos.push(photo);
      if(photo.isMain){
        this.authService.changePhotoUrl(photo.url);
      }
    }
  }

  ngOnInit(): void {
  }
  fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  setMainPhoto(photo) {
    let userId = this.authService.decoodedAccessToken.nameid;
    this.userService.setUserMainPhoto(photo.id, userId).subscribe(
      next => {
        console.log("Main Photo Set Successfully");
        this.currentMainPhoto = this.photos.filter(p => p.isMain === true)[0];
        photo.isMain = true;
        this.currentMainPhoto.isMain = false;
        this.authService.changePhotoUrl(photo.url);

      },
      error => {
        this.alertify.error(error);
      }
    )
  }

  deletePhoto(photoId, photoIndex) {
    let userId = this.authService.decoodedAccessToken.nameid;
    this.alertify.confirm("Delete This Photo ?", () => {
      this.userService.deletePhoto(userId, photoId).subscribe(
        data => {
          this.alertify.success("Photo Deleted Successfully");
          this.photos.splice(photoIndex, 1);
        }, error => {
          this.alertify.error(error);
        }
      )
    });

  }


}
