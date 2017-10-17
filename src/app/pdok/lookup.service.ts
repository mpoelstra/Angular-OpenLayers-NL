import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { LookupObject } from './lookup-object';

@Injectable()
export class LookupService {
  private lookupUrl: string = 'http://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup';
  private lookupQuery: string = '?id=';

  constructor(private http: Http) { }

  lookup(id: string): Promise<LookupObject[]> {
    console.log('Get lookup', encodeURI(this.lookupUrl + this.lookupQuery + id));
    return this.http
      .get(this.lookupUrl + this.lookupQuery + id)
      .toPromise()
      .then(response => response.json().response.docs as LookupObject[])
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
