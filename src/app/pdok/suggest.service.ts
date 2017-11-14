import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/switchMap';

interface IsearchEntriesResponse {
  response: {
    numFound: number,
    docs: Array<any>,
    maxScore: number,
    start: number
  }
}

@Injectable()
export class SuggestService {
  private suggestUrl: string = 'http://geodata.nationaalgeoregister.nl/locatieserver/v3/suggest';
  private suggestQuery: string = '?q=';
  
  //https://alligator.io/angular/real-time-search-angular-rxjs/

  constructor(private http: HttpClient) { }

  search(terms: Observable<string>) {
    return terms.debounceTime(400)
      .distinctUntilChanged()
      .switchMap(term => this.searchEntries(term));
  }

  searchEntries(term) {
    console.log('Get suggestions', encodeURI(this.suggestUrl + this.suggestQuery + term));
    return this.http.get<IsearchEntriesResponse>(this.suggestUrl + this.suggestQuery + term);
  }

}
