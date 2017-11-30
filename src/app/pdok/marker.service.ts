import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/toPromise';

import { Marker } from './marker/marker';
import { LoggerService } from '../logging/logger.service';

@Injectable()
export class MarkerService {

  private fakeMarkerUrl: string = 'api/markers';

  constructor(private oldHttp: Http, private logger: LoggerService) { }

  saveMarker(marker: Marker, motivation: string): Promise<Marker> {
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

}
