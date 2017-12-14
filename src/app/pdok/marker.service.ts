import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import 'rxjs/add/operator/toPromise';

import { Marker } from './marker/marker';
import { LoggerService } from '../logging/logger.service';

@Injectable()
export class MarkerService {

  private fakeMarkerUrl: string = 'api/markers';

  constructor(private oldHttp: Http, private http: HttpClient, private logger: LoggerService) { }

  saveFakeMarker(marker: Marker, motivation: string): Promise<Marker> {
    let postValue:any = {};

    postValue = Object.assign({}, marker, {'motivation': motivation});
    
    const url = `${this.fakeMarkerUrl}/${postValue.id}`;
    const json = JSON.stringify(postValue);

    return this.oldHttp
      .put(url, json)
      .toPromise()
      .then(() => {
        this.logger.logInfo(`${marker.type} ${marker.id} is succesvol toegevoegd`);
        return postValue
      })
      .catch((error: any) => {
        this.logger.logError(`${marker.type} ${marker.id} kan niet worden opgeslagen ${error.message}`);
        return Promise.reject(error);
      });
  }

  saveMarker(marker: Marker, motivation: string) {
    const url = 'http://localhost:8080/geoserver/rest/marker/insert';
    
    let params = new HttpParams();
    let headers = new HttpHeaders();

    params = params.append('bron', marker.bron);
    params = params.append('type', marker.type);
    params = params.append('coordinate', marker.coordinate.toString());
    params = params.append('centroide_rd', marker.centroide_rd);
    params = params.append('id', marker.id);
    params = params.append('naam', marker.naam);
    params = params.append('nummer', marker.nummer);
    params = params.append('status', marker.status);
    params = params.append('omschrijving', marker.omschrijving);
    params = params.append('aliassen', marker.aliassen);
    params = params.append('motivatie', motivation);
    params = params.append('userId', 'pbm123');

    headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
  
    return this.http.post(url,params.toString(), {headers: headers});
  }

  getMarkers(): Promise<Marker[]> {
    const url = this.fakeMarkerUrl;

    return this.oldHttp
      .get(url)
      .toPromise()
      .then((response) => {
        this.logger.logInfo(`Markers succesvol opgehaald`);
        return response.json() as Marker[];
      })
      .catch((error: any) => {
        this.logger.logError(`Markers kunnen niet worden opgeslagen ${error.message}`);
        return Promise.reject(error);
      });
  }

}
