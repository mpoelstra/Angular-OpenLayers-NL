import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

@Injectable()
export class SuggestService {
  private suggestUrl: string = 'http://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest';
  private suggestQuery: string = '?q=';
  
  //https://alligator.io/angular/real-time-search-angular-rxjs/

  constructor(private http: Http) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    console.log('Get suggestions', encodeURI(this.suggestUrl + this.suggestQuery + term));
    return this.http
        .get(this.suggestUrl + this.suggestQuery + term)
        .map(res => res.json());
  }

}
