import { Message } from './../_models/message';
import { pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from './../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../_models/user';
import { PaginationResult } from '../_models/Pagination';

/*const optionsHeaders={
  headers:new HttpHeaders({
    'Authorization':'Bearer '+localStorage.getItem('token')
  })
};*/

@Injectable({
  providedIn: 'root'
})
export class UserService {
  baseUrl = environment.baseUrl + 'users';


  constructor(private http: HttpClient) { }

  getUsers(pageNumber?, pageSize?, userParams?, likeParameter?): Observable<PaginationResult<User[]>> {

    let params = new HttpParams();
    let paginatedResult = new PaginationResult<User[]>();

    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);
      if (userParams != null) {
        params = params.append('minAge', userParams.minAge);
        params = params.append('maxAge', userParams.maxAge);
        params = params.append('gender', userParams.gender);
        params = params.append('orderBy', userParams.orderBy);
      }

      if (likeParameter != null) {
        if (likeParameter === 'Likers')
          params = params.append('likers', '' + true);
        else
          params = params.append('likees', '' + true);

      }
    }

    return this.http.get<User[]>(this.baseUrl, {
      observe: 'response', params
    }).pipe(
      map(response => {
        paginatedResult.result = response.body;
        paginatedResult.pagination = JSON.parse(response.headers.get('Pagination'));
        return paginatedResult;
      }));

  }

  getUser(id): Observable<User> {

    return this.http.get<User>(this.baseUrl + '/' + id);
  }

  updateUser(id: number, user: User) {
    return this.http.put(this.baseUrl + '/' + id, user);
  }

  setUserMainPhoto(photoId, userId) {
    return this.http.post(this.baseUrl + '/' + userId + '/photos/' + photoId + '/setMain', {});
  }

  deletePhoto(userId, photoId) {
    return this.http.delete(this.baseUrl + '/' + userId + '/photos/' + photoId);
  }

  sendLike(userId: number, recepientId: number) {
    return this.http.post(this.baseUrl + '/' + userId + '/like/' + recepientId, {});
  }

  getMessages(userId, pageNumber?, pageSize?, messageType = "Unread"): Observable<PaginationResult<Message[]>> {
    let params = new HttpParams();

    params = params.append('messageType', messageType);

    if (pageNumber != null && pageSize != null) {
      params = params.append('pageNumber', pageNumber);
      params = params.append('pageSize', pageSize);

    }


    let result = new PaginationResult<Message[]>();

    return this.http.get(this.baseUrl + '/' + userId + '/messages', { observe: 'response', params }).pipe(
      map((response: any) => {
        result.result = response.body;
        if (response.headers.get('pagination') != null) {
          result.pagination = JSON.parse(response.headers.get('pagination'));
        }

        return result;

      })
    );

  }

  getMessageThread(senderId, receiverId) {
    return this.http.get(this.baseUrl + '/' + senderId + '/messages/thread/' + receiverId);
  }

  sendMessage(senderId, message: Message) {
    return this.http.post(this.baseUrl + '/' + senderId + '/messages', message);
  }

  deleteMessage(messageId, userId) {
    return this.http.post(this.baseUrl + '/' + userId + '/messages/' + messageId, {});
  }
  markMessageRead(messageId, userId) {
     this.http.post(this.baseUrl + '/' + userId + '/messages/' + messageId + '/read', {}).subscribe();
  }

}
