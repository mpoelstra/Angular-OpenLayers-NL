import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import Map from 'ol/map';
import View from 'ol/view';
import TileLayer from 'ol/layer/tile';
import Zoom from 'ol/control/zoom';
import ZoomSlider from 'ol/control/zoomslider';
import MousePosition from 'ol/control/mouseposition';
import TileImage from 'ol/source/tileimage';
import Xyz from 'ol/source/xyz';
import WmtsSource from 'ol/source/wmts';
import TileGrid from 'ol/tilegrid/tilegrid';
import WmtsGrid from 'ol/tilegrid/wmts';
import Proj from 'ol/proj';
import Projection from 'ol/proj/projection';
import Coordinate from 'ol/coordinate';
import Interaction from 'ol/interaction';
import Extent from 'ol/extent';
import { MapPointerEvent } from '../util/map-pointer-event';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit, OnChanges {
  @Input() center: number[];
  @Input() zoom: number;

  @Output() mapClicked = new EventEmitter();

  public map;
  public debug: object;
  public coordinate: string;
  public backgrounds: string[];
  public backgroundRandom: string;

  constructor() { 
    this.coordinate = `X: , Y: `;

    this.backgrounds = [
      'hearts',
      'blueprint',
      'rainbow',
      'weave',
      'japanesecube',
      'stars'
    ];
    this.backgroundRandom = this.backgrounds[Math.floor(Math.random() * this.backgrounds.length)];
  }

  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    //if (!changes.zoom.firstChange && !changes.center.firstChange) {
      this.mapUpdate();
    //}
  }

  mapUpdate() {
    if (this.map) {
      this.map.getView().setCenter(this.center);
      this.map.getView().setZoom(this.zoom);
    }
  }

  ngOnInit() {
    let proj = Proj;

    //source: https://github.com/bartvde/PDOK-OpenLayers3/blob/master/script.js
    let projectionExtent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
    let resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42]
    let matrixIds = [];
    for (var z = 0; z < 14; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      matrixIds[z] = 'EPSG:28992:' + z;
    }

    console.log(resolutions);
    console.log(matrixIds);


    let url = 'http://geodata.nationaalgeoregister.nl/tms/1.0.0/brtachtergrondkaart/';

    let tileUrlFunction = function(tileCoord, pixelRatio, projection) {
      let zxy = tileCoord;
      let retVal = '';

      
      if (zxy[1] < 0 || zxy[2] < 0) {
        retVal = '';
      }
      retVal = `${url}${zxy[0].toString()}/${zxy[1].toString()}/${zxy[2].toString()}.png`;

      console.log(retVal);
      return retVal;
    };



    let dutchProjection = new Projection({
      code: 'EPSG:28992',
      // The extent is used to determine zoom level 0. Recommended values for a
      // projection's validity extent can be found at https://epsg.io/.
      extent: projectionExtent,
      units: 'm'
    });
    //proj.addProjection(dutchProjection); //really needed??

    this.map = new Map({
      target: 'map',
      interactions: Interaction.defaults({doubleClickZoom :false}),
      layers: [
        new TileLayer({
          //source: new OSM()
          source: new TileImage({
            projection: dutchProjection,
            tileGrid: new TileGrid({
              origin: [-285401.92,22598.08],
              resolutions: resolutions
            }),
            tileUrlFunction: tileUrlFunction
          })
        })
      ],
      controls: [
        new Zoom(),
        new ZoomSlider(),
        new MousePosition({
          className: 'map__mouse-position',
          coordinateFormat: (coordinate) => {
            this.coordinate = `X: ${coordinate[0].toFixed(3)}, Y: ${coordinate[1].toFixed(3)}`;
          }
        })
      ],
      view: new View({
        minZoom: 3,
        maxZoom: 20,
        projection: dutchProjection,        
        center: this.center,
        zoom: 3
      })
    });

    this.map.on('click', (event) => {
      let mapEvent = new MapPointerEvent(event.coordinate, event.map, event.orginalEvent, event.pixel, event.type);
      console.log('clicked on coordinate', event.coordinate);
      console.log('clicked on pixel', event.pixel);
      this.mapClicked.emit(mapEvent);
    });
  }

}