import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
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

  private fakeLookupUrl: string = 'api/lookups'; //zilvermeer 2
  private overrideId: string = 'adr-778f549625333e262b0bc23f1e4dde0e'; //zilvermeer 2

  constructor(private http: HttpClient, private oldHttp: Http) { }

  lookup(id: string): Promise<LookupObject[]> {
    console.log('Get lookup', encodeURI(this.lookupUrl + this.lookupQuery + id));
    return this.http
      .get<IlookupResponse>(this.lookupUrl + this.lookupQuery + id)
      .toPromise()
      .then(result => result.response.docs)
      .catch(this.handleError);
  }

  getFakeLookUp(id:string): Promise<LookupObject> {
    const url = `${this.fakeLookupUrl}/${id}`;
    //oldHttp will be overriden with the in-memory-data.service
    return this.oldHttp.get(url)
        .toPromise()
        .then((response) => response.json() as LookupObject);
  }

  updateFakeLookup(lookupObject: LookupObject): Promise<LookupObject> {
    const url = `${this.fakeLookupUrl}/${lookupObject.id}`;
    const json = JSON.stringify(lookupObject);
    return this.oldHttp
      .put(url, json)
      .toPromise()
      .then(() => lookupObject)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
