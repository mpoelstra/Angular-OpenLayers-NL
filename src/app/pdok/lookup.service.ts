import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { LookupObject } from './lookup-object';
import { LoggerService } from '../logging/logger.service';

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

  constructor(private http: HttpClient, private oldHttp: Http, private logger: LoggerService) { }

  lookup(id: string): Promise<LookupObject[]> {
    console.log('Get lookup', encodeURI(this.lookupUrl + this.lookupQuery + id));
    return this.http
      .get<IlookupResponse>(this.lookupUrl + this.lookupQuery + id)
      .toPromise()
      .then(result => { 
        this.logger.log('info', 'lookup succesvol voor ' + id).subscribe(response => {
          console.log('logging succeed');
        }, err => {
          console.log('logging failed');
        });
        return result.response.docs;
      })
      .catch(this.handleError);
  }

  getFakeLookUp(id:string): Promise<LookupObject> {
    const url = `${this.fakeLookupUrl}/${id}`;
    //oldHttp will be overriden with the in-memory-data.service
    return this.oldHttp.get(url)
        .toPromise()
        .then((response) => response.json() as LookupObject);
  }

  updateFakeLookup(lookupObject: LookupObject, motivation: string): Promise<LookupObject> {
    let postValue:any = {};

    if (lookupObject.type === 'adres') {
      lookupObject.huis_nlt = `${lookupObject.huisnummer}${lookupObject.huisletter ? lookupObject.huisletter : ''}`;
      lookupObject.weergavenaam = `${lookupObject.straatnaam} ${lookupObject.huis_nlt}, ${lookupObject.postcode} ${lookupObject.woonplaatsnaam}`;
    }

    if (lookupObject.type === 'weg') {
      lookupObject.straatnaam_verkort = lookupObject.straatnaam;
      lookupObject.weergavenaam = `${lookupObject.straatnaam}, ${lookupObject.woonplaatsnaam}`;
    }

    if (lookupObject.type === 'woonplaats') {
      lookupObject.weergavenaam = `${lookupObject.woonplaatsnaam}, ${lookupObject.gemeentenaam}, ${lookupObject.provincienaam}`
    }

    if (lookupObject.type === 'gemeente') {
      lookupObject.weergavenaam = `Gemeente ${lookupObject.gemeentenaam}`;
    }

    if (lookupObject.type === 'postcode') {
      lookupObject.weergavenaam = `${lookupObject.straatnaam}, ${lookupObject.postcode}, ${lookupObject.woonplaatsnaam}`;
    }

    postValue = Object.assign({}, lookupObject, {'motivation': motivation});
    
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
