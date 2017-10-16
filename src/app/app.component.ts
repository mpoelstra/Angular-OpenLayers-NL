import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { SuggestService } from './pdok/suggest.service';
import { LookupService } from './pdok/lookup.service';
import { Suggestion } from './pdok/suggestion';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  
  //needed for child component map
  public mapCenter: number[];
  public mapZoom: number;

  //the searchInput textfield
  public searchInput: string;
  
  //needed to show the suggestions or no results
  public suggestionResults: any[];
  public suggestionCount: number;

  //needed if we want to show the results of the lookUp service, can this be more than 1? Now it's always one.
  public lookupResults: any[];

  //boolen to show/hide stuff in the html
  public searching = false;

  //string array observable
  private searchTerm$ = new Subject<string>();  

  constructor(private suggestService: SuggestService, private lookupService: LookupService) {
    this.suggestionResults = [];
    this.lookupResults = [];
  }

  ngOnInit() {

    //default mapView values
    this.mapCenter = [150000, 450000];
    this.mapZoom = 3;

    //will only go into subscribe method when searchTems&.next is being called
    this.suggestService.search(this.searchTerm$)
    .subscribe(results => {
      //console.log(results);
      this.suggestionResults = results.response.docs;
      this.suggestionCount = results.response.numFound;
    });
  }

  onSearch($event) {
    //this.searchInput is the same as $event.target.value
    this.searching = true;
    this.searchTerm$.next(this.searchInput);
  }

  onSuggestionClicked(suggestion: Suggestion) {
    this.searching = false;

    this.lookupService.lookup(suggestion.id).then(result => {
      console.log(result[0]);
      //this.lookupResults = result;
      this.showOnMap(result[0]);
    });
  }

  onLookupClicked(lookupObject: any) {
    this.showOnMap(lookupObject);
  }

  showOnMap(lookupObject: any) {
    let regExp:RegExp = /\(([^)]+)\)/;
    let matches = regExp.exec(lookupObject.centroide_rd);
    let newZoomLevel: number;

    //will trigger re-render map
    this.mapCenter = matches[1].split(' ').map(function(item) {
        return parseInt(item, 10);
    });

    switch (lookupObject.type) {
      case 'gemeente':
      case 'woonplaats':
        newZoomLevel = 8;
        break;
      default:
        newZoomLevel = 13;
        break;
    }

    //will trigger re-render map
    this.mapZoom = newZoomLevel;

    //update searchInput to the full name of the clicked lookupObject
    this.searchInput = lookupObject.weergavenaam;
    
    console.log('newCenter: ', this.mapCenter);
  }
  
}
