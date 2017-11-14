import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import Map from 'ol/map';
import View from 'ol/view';
import Zoom from 'ol/control/zoom';
import ZoomSlider from 'ol/control/zoomslider';
import MousePosition from 'ol/control/mouseposition';
import Proj from 'ol/proj';
import Proj4 from 'proj4';
import Interaction from 'ol/interaction';
import { MapPointerEvent } from '../util/map-pointer-event';
import { OpenlayersService } from '../openlayers.service';
import { TileWmsLayer } from '../layers/tileWmsLayer';

@Component({
  selector: 'app-wmts',
  templateUrl: './wmts.component.html',
  styleUrls: ['./wmts.component.scss']
})
export class WmtsComponent implements OnInit, OnChanges {
  @Input() center: number[];
  @Input() zoom: number;

  @Output() mapClicked = new EventEmitter();

  public map;
  public debug: object;
  public coordinate: object;
  public wmtsLayers;
  public currentLayer;
  public layerGroup;
  public layerLegends;
  public objectKeys = Object.keys;

  private layers;
  private layersHistory;
  private viewProjection;

  constructor(private openlayersService: OpenlayersService) {
    this.wmtsLayers = this.openlayersService.getAvailableWMTSLayers();
    this.currentLayer = this.wmtsLayers[0].value;
    this.layerGroup = this.openlayersService.getLayerGroup();
    this.layersHistory = {};
    this.coordinate = {
      x: 0,
      y: 0
    };
    this.layerLegends = {};
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      this.map.getView().setCenter(this.center);
      this.map.getView().setZoom(this.zoom);
    }
  }

  ngOnInit() {

    this.layers = this.openlayersService.layers;
    let viewConfig = this.openlayersService.viewConfig;
    let controls = this.getMapControls();
    
    this.map = new Map({
      target: 'map',
      interactions: Interaction.defaults({doubleClickZoom :false}),
      layers: this.layers,
      view: new View(viewConfig),
      controls: controls      
    });

    this.viewProjection = this.map.getView().getProjection();
    
    this.addEventListeners();
  }

  addEventListeners(): void {
    this.map.on('click', (event) => {
      //reset features array
      let features = [];

      Object.keys(this.layersHistory).forEach((key) => {
          console.log(key, this.layersHistory[key]);
          let viewResolution = this.map.getView().getResolution();
          let wmsSource = this.layersHistory[key].getSource();
          let url = wmsSource.getGetFeatureInfoUrl(event.coordinate, viewResolution, this.viewProjection,{'INFO_FORMAT': 'application/json'});
          console.log(url);
          let label = this.layerLegends[key].label;
          features.push({
            label: label,
            url: url
          });
      });
      
      //debugger;
      let mapEvent = new MapPointerEvent(event.coordinate, event.map, event.orginalEvent, event.pixel, event.type, features);
      console.log('clicked on coordinate', event.coordinate);
      console.log('clicked on pixel', event.pixel);
      this.mapClicked.emit(mapEvent);
    });
  }

  getMapControls(): any[] {
    return [
      new Zoom(),
      new ZoomSlider(),
      new MousePosition({
        className: 'map__mouse-position',
        coordinateFormat: (coordinate) => {
          this.coordinate['x'] = coordinate[0].toFixed(3);
          this.coordinate['y'] = coordinate[1].toFixed(3);
        }
      })
    ]
  }

  getUserLocation() {
    if (window.navigator.geolocation) {
      window.navigator.geolocation.getCurrentPosition((position) => {
        let NLProjection = '+proj=sterea +lat_0=52.15616055555555 +lon_0=5.38763888888889 +k=0.9999079 +x_0=155000 +y_0=463000 +ellps=bessel +units=m +no_defs';
        let center = Proj4(NLProjection,[position.coords.longitude,position.coords.latitude]);
        this.map.getView().setCenter(center);
        this.map.getView().setZoom(12);
      });
    }
  }

  setSourceLayer(layer) {
    this.currentLayer = layer;
    this.openlayersService.setBaseLayerSource(layer);
  }

  toggleLayer(event, group, layer) {
    //debugger;
    let uniqueKey = `${group.label}.${layer.value}`
    if (this.layersHistory[uniqueKey]) {
      this.map.removeLayer(this.layersHistory[uniqueKey]); 
      delete this.layersHistory[uniqueKey];
      delete this.layerLegends[uniqueKey];
    } else {
      let newLayer = new TileWmsLayer(layer.value, group.url).getLayer();
      this.layersHistory[uniqueKey] = newLayer;
      this.layerLegends[uniqueKey] = layer;
      this.map.addLayer(newLayer);
    }
  }

}
