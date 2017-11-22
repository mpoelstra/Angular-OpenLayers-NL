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

  private fakeLookupUrl: string = 'api/lookups';

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

  updateFakeLookup(postValue: LookupObject): Promise<LookupObject> {
    if (postValue.type === 'adres') {
      postValue.huis_nlt = `${postValue.huisnummer}${postValue.huisletter ? postValue.huisletter : ''}`;
      postValue.weergavenaam = `${postValue.straatnaam} ${postValue.huis_nlt}, ${postValue.postcode} ${postValue.woonplaatsnaam}`;
    }

    if (postValue.type === 'weg') {
      postValue.straatnaam_verkort = postValue.straatnaam;
      postValue.weergavenaam = `${postValue.straatnaam}, ${postValue.woonplaatsnaam}`;
    }

    if (postValue.type === 'woonplaats') {
      postValue.weergavenaam = `${postValue.woonplaatsnaam}, ${postValue.gemeentenaam}, ${postValue.provincienaam}`
    }

    if (postValue.type === 'gemeente') {
      postValue.weergavenaam = `Gemeente ${postValue.gemeentenaam}`;
    }

    if (postValue.type === 'postcode') {
      postValue.weergavenaam = `${postValue.straatnaam}, ${postValue.postcode}, ${postValue.woonplaatsnaam}`;
    }
    
    const url = `${this.fakeLookupUrl}/${postValue.id}`;
    const json = JSON.stringify(postValue);

    return this.oldHttp
      .put(url, json)
      .toPromise()
      .then(() => postValue)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
