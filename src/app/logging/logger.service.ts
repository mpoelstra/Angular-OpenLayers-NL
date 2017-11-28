import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

@Injectable()
export class LoggerService {

  public logHistory:Object[] = [];

  constructor(private http: HttpClient) { }

  public logInfo(text): void {
    this.log(text, 'info', 'logInfo');
  }

  public logError(text): void {
    this.log(text, 'error', 'logError');
  }

  public logDebug(text): void {
    this.log(text, 'debug', 'logDebug');
  }

  public logWarning(text): void {
    this.log(text, 'warning', 'logWarning');
  }

  private log(text, type, urlEnd) {
    const url = 'http://localhost:8080/geoserver/rest/log/' + urlEnd;
  
    let params = new HttpParams();
    let headers = new HttpHeaders();

    params = params.append('text', text);
    params = params.append('app', 'PBM');
    params = params.append('browser', window.navigator.userAgent);
    params = params.append('userId', 'pbm123');

    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
  
    this.http.post(url,params.toString(), {headers: headers}).subscribe(response => {
      console.log('logging succeeded');
      this.updateLogHistory(text, type, 'succes');
    }, err => {
      console.log('logging failed');
      this.updateLogHistory(text, type, 'failed');
    });
  }

  updateLogHistory(text, type, status): void {
    this.logHistory.push({
      'time': new Date().toLocaleString(),
      'type': type,
      'log': text,
      'sent': status
    });
  }
}
