import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';
import Map from 'ol/map';
import View from 'ol/view';
import Zoom from 'ol/control/zoom';
import ZoomSlider from 'ol/control/zoomslider';
import MousePosition from 'ol/control/mouseposition';
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
      layers: this.layers,
      view: new View(viewConfig),
      controls: controls      
    });
    
    this.addEventListeners();
  }

  addEventListeners(): void {
    this.map.on('click', (event) => {
      let mapEvent = new MapPointerEvent(event.coordinate, event.map, event.orginalEvent, event.pixel, event.type);
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
          //this.coordinate
          //this.coordinate.x = coordinate[0].toFixed(3);
          //this.coordinate.y = coordinate[1].toFixed(3);
          this.coordinate['x'] = coordinate[0].toFixed(3);
          this.coordinate['y'] = coordinate[1].toFixed(3);
        }
      })
    ]
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
