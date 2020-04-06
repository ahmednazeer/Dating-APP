import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HTTP_INTERCEPTORS
} from "@angular/common/http";
import { Observable, throwError } from "rxjs";
import { retry, catchError } from "rxjs/operators";

export class ErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        
        if (error instanceof HttpErrorResponse) {
          if(error.status===401){
            return throwError (error.statusText);
          }

          //handle Application-Error
          let applicationErrorMessage = error.headers.get('Application-Error');
          if(applicationErrorMessage){
            return throwError(applicationErrorMessage);
          }
          //handle Model State Error
          let serverError=error.error;
          if(serverError||typeof serverError==='object' ){
            let serverErroeMessages='';
            for(let key in serverError){
              serverErroeMessages+=serverError[key]+'\n';
            }
            return throwError(serverErroeMessages||serverError||'Server Error');
          }
         
          
      }}
    ));} 
}


export const ErrorInterceptorProvider={
  provide:HTTP_INTERCEPTORS,
  useClass:ErrorInterceptor,
  multi:true
}
