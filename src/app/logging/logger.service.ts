import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoggerService {

  constructor(private http: HttpClient) { }

  log(type, text): Observable<Object> {

    const url = 'http://192.168.56.104:8080/geoserver/rest/log/logInfo';
    const body = JSON.stringify({
      text: text,
      app: 'PBM',
      browser: window.navigator.userAgent,
      userId: 'pbm123'
    });
 
    let headers = new HttpHeaders();
    headers = headers.append("Authorization", "Basic " + btoa("admin:geoserver"));
    headers = headers.append("Content-Type", "application/x-www-form-urlencoded");
 
    return this.http.post(url,body, {headers: headers});
    /*
    .subscribe(response => {
          console.log(response);
    }, err => {
       console.log("User authentication failed!");
    });
    */
 }
}
