import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoggerService {

  constructor(private http: HttpClient) { }

  log(type, text): Observable<Object> {

    // Initialize Params Object
    let Params = new HttpParams();

    Params = Params.append('text', text);
    Params = Params.append('app', 'PBM');
    Params = Params.append('browser', window.navigator.userAgent);
    Params = Params.append('userId', 'pbm123');

    const url = 'http://192.168.56.104:8080/geoserver/rest/log/logInfo';
    const body = Params.toString();
 
    let headers = new HttpHeaders();
    //headers = headers.append("Authorization", "Basic " + btoa("admin:geoserver"));
    //headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
 
    //return this.http.post(url,body, {headers: headers});
    return this.http.post(url,body);
    /*
    .subscribe(response => {
          console.log(response);
    }, err => {
       console.log("User authentication failed!");
    });
    */
 }
}
