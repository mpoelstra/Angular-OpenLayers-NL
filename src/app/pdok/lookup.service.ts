import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { LookupObject } from './lookup-object';

interface IlookupResponse {
  response: {
    docs: LookupObject[],
    maxScore: number,
    numFound: number,
    start: number
  }
}

@Injectable()
export class LookupService {
  private lookupUrl: string = 'http://geodata.nationaalgeoregister.nl/locatieserver/v3/lookup';
  private lookupQuery: string = '?id=';

  constructor(private http: HttpClient) { }

  lookup(id: string): Promise<LookupObject[]> {
    console.log('Get lookup', encodeURI(this.lookupUrl + this.lookupQuery + id));
    return this.http
      .get<IlookupResponse>(this.lookupUrl + this.lookupQuery + id)
      .toPromise()
      .then(result => result.response.docs)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
