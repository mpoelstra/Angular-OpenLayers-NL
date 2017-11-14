import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from "rxjs/observable/forkJoin";

interface IfeatureResponse {
  type: string;
  totalFeatures: string;
  features: Array<any>;
  crs: any
}

@Injectable()
export class FeaturesService {

  constructor(private http: HttpClient) { }

  getFeature(url): Promise<IfeatureResponse> {
    console.log('GetFeature', url);
    return this.http
      .get<IfeatureResponse>(url)
      .toPromise()
      .then(response => {
        return response
      })
      .catch(this.handleError);
  }


  getAllFeatures(features: any[]) {
    //console.log('getAllFeatures', urls);
    let observables: Observable<IfeatureResponse>[] = [];

    for (let feature of features) {
      //url = encodeURI(url);
      observables.push(this.http.get<IfeatureResponse>(feature.url));
    }

    return forkJoin(observables);
    
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error);
    return Promise.reject(error);
  }

}
