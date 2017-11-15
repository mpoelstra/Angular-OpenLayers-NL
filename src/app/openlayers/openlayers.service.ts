import { Injectable } from '@angular/core';
import Proj from 'ol/proj';
import Projection from 'ol/proj/projection';
import Extent from 'ol/extent';
import TileLayer from 'ol/layer/tile';
import WmtsSource from 'ol/source/wmts';
import TileWmsSource from 'ol/source/tilewms';
import WmtsGrid from 'ol/tilegrid/wmts';

import { ProjectionConfig} from './util/projection-config';
import { ViewConfig } from './util/view-config';


@Injectable()
export class OpenlayersService {
  public baseLayerSourceLayer:string;
  public viewConfig: ViewConfig;
  public layers: any[];

  private baseLayerSourceOptions;
  private projectionConfig: ProjectionConfig;


  constructor() { 
    this.baseLayerSourceLayer = 'brtachtergrondkaart';
    this.layers = [];

    this.setProjectionConfig();
    this.setBaseLayers();
    this.setViewConfig();
  }

  private setProjectionConfig(): void {
    let extent = [-285401.92,22598.08,595401.9199999999,903401.9199999999];
    let resolutions = [3440.64, 1720.32, 860.16, 430.08, 215.04, 107.52, 53.76, 26.88, 13.44, 6.72, 3.36, 1.68, 0.84, 0.42];
    let code = 'EPSG:28992';
    let units = 'm';

    let matrixIds = [];
    for (var z = 0; z < 14; ++z) {
      // generate resolutions and matrixIds arrays for this WMTS
      matrixIds[z] = 'EPSG:28992:' + z;
    }

    this.projectionConfig = {
      extent: extent,
      resolutions: resolutions,
      code: code,
      units: units,
      matrixIds: matrixIds,
      projection: new Projection({
          code: code,
          // The extent is used to determine zoom level 0. Recommended values for a
          // projection's validity extent can be found at https://epsg.io/.
          extent: extent,
          units: units
      })
    }

    //Proj.addProjection(this.projectionConfig.projection); //really needed??
  }

  private setBaseLayers() {
    this.baseLayerSourceOptions = {
      url: 'http://geodata.nationaalgeoregister.nl/tiles/service/wmts',
      layer: this.baseLayerSourceLayer,
      matrixSet: this.projectionConfig.code,
      format: 'image/png',
      tileGrid: new WmtsGrid({
        origin: Extent.getTopLeft(this.projectionConfig.extent),
        resolutions: this.projectionConfig.resolutions,
        matrixIds: this.projectionConfig.matrixIds
      }),
      style: 'default',
      wrapX: true
    };

    let source = new WmtsSource(this.baseLayerSourceOptions);

    this.layers.push(
      new TileLayer({
        source: source
      })
    )

    //https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms?request=GetCapabilities
    /*
    let test = new TileLayer({
      source: new TileWmsSource({
        url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
        params: {'LAYERS': 'gemeenten'}
      })
    });
    this.layers.push(test);
    */
  }

  private setViewConfig() {
    this.viewConfig = {
      minZoom: 3,
      maxZoom: 20,
      projection: this.projectionConfig.projection,
      center: Extent.getCenter(this.projectionConfig.extent),
      zoom: 3
    }
  }

  public getAvailableWMTSLayers() {
    //todo get these dynamic with http://geodata.nationaalgeoregister.nl/tiles/service/wmts?REQUEST=GetCapabilities
    //example on openlayers site
    return [
      {
        label: 'Normaal',
        value: 'brtachtergrondkaart'
      },
      {
        label: 'Grijs',
        value: 'brtachtergrondkaartgrijs'
      },
      {
        label: 'Pastel',
        value: 'brtachtergrondkaartpastel'
      },
      {
        label: 'Bodem',
        value: 'bodemkaart50000'
      },
      {
        label: 'BAG',
        value: 'bag'
      },
      {
        label: 'Luchtfoto',
        value: '2016_ortho25'
      }
    ]
  }

  //?request=GetCapabilities
  public getLayerGroup() {
    let layerGroup = [
      {
        label: 'BAG',
        url: 'https://geodata.nationaalgeoregister.nl/bag/wms',
        type: 'wms',
        layers: [
          {
            label: 'Panden',
            value: 'pand',
            legend: 'https://geodata.nationaalgeoregister.nl/bag/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=ligplaats'
          },
          {
            label: 'Verblijfsobject',
            value: 'verblijfsobject',
            legend: 'https://geodata.nationaalgeoregister.nl/bag/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=verblijfsobject'
          },
          {
            label: 'Woonplaats',
            value: 'woonplaats',
            legend: 'https://geodata.nationaalgeoregister.nl/bag/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=woonplaats'
          }
        ]
      },
      {
        label: 'Bestuurlijke grenzen',
        url: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/wms',
        type: 'wms',
        layers: [
          {
            label: 'Gemeentegrenzen',
            value: 'gemeenten',
            legend: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=gemeenten'
          },
          {
            label: 'Landsgrens',
            value: 'landsgrens',
            legend: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=landsgrens'
          },
          {
            label: 'Provinciegrenzen',
            value: 'provincies',
            legend: 'https://geodata.nationaalgeoregister.nl/bestuurlijkegrenzen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=provincies'
          }
        ]
      },
      {
        label: 'CBG Gebiedsindelingen',
        url: 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/wms',
        type: 'wms',
        layers: [
          {
            label: 'Brandweerregio 2010 gegeneraliseerd',
            value: 'cbsgebiedsindelingen:cbs_brandweerregio_2010_gegeneraliseerd',
            legend: 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=cbsgebiedsindelingen%3Acbs_brandweerregio_2010_gegeneraliseerd'
          },
          {
            label: 'Brandweerregio 2010 labelpoint',
            value: 'cbsgebiedsindelingen:cbs_brandweerregio_2010_labelpoint',
            legend: 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=cbsgebiedsindelingen%3Acbs_brandweerregio_2010_labelpoint'
          },
          {
            label: 'Buurt 2017 gegeneraliseerd',
            value: 'cbsgebiedsindelingen:cbs_buurt_2017_gegeneraliseerd',
            legend: 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=cbsgebiedsindelingen%3Acbs_buurt_2017_gegeneraliseerd'
          },
          {
            label: 'Buurt 2017 labelpoint',
            value: 'cbsgebiedsindelingen:cbs_buurt_2017_labelpoint',
            legend: 'https://geodata.nationaalgeoregister.nl/cbsgebiedsindelingen/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=cbsgebiedsindelingen%3Acbs_buurt_2017_labelpoint'
          }
        ]
      },
      {
        label: 'Nationale parken',
        url: 'https://geodata.nationaalgeoregister.nl/nationaleparken/wms',
        type: 'wms',
        layers: [
          {
            label: 'Nationale parken',
            value: 'nationaleparken',
            legend: 'https://geodata.nationaalgeoregister.nl/nationaleparken/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=nationaleparken'
          }
        ]
      },
      {
        label: 'Weggegevens',
        url: 'https://geodata.nationaalgeoregister.nl/weggeg/wms',
        type: 'wms',
        layers: [
          {
            label: 'Aantal rijbanen',
            value: 'weggegaantalrijbanen',
            legend: 'https://geodata.nationaalgeoregister.nl/weggeg/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=weggegaantalrijbanen'
          },
          {
            label: 'Maximum snelheid',
            value: 'weggegmaximumsnelheden',
            legend: 'https://geodata.nationaalgeoregister.nl/weggeg/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=weggegmaximumsnelheden'
          }
        ]
      },
      {
        label: 'Windsnelheden 100m hoogte',
        url: 'https://geodata.nationaalgeoregister.nl/windkaart/wms',
        type: 'wms',
        layers: [
          {
            label: 'Windsnelheden',
            value: 'windsnelheden100m',
            legend: 'https://geodata.nationaalgeoregister.nl/windkaart/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=windsnelheden100m'
          }
        ]
      },
      {
        label: 'Drone no-fly zones',
        url: 'https://geodata.nationaalgeoregister.nl/dronenoflyzones/wms',
        type: 'wms',
        layers: [
          {
            label: 'Landingsite',
            value: 'landingsite',
            legend: 'https://geodata.nationaalgeoregister.nl/dronenoflyzones/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=landingsite'
          },
          {
            label: 'Luchtvaartgebieden',
            value: 'luchtvaartgebieden',
            legend: 'https://geodata.nationaalgeoregister.nl/dronenoflyzones/ows?service=WMS&request=GetLegendGraphic&format=image%2Fpng&width=20&height=20&layer=luchtvaartgebieden'
          }
        ]
      }
    ]

    return layerGroup;
  }

  public setBaseLayerSource(layer) {
    this.baseLayerSourceOptions = Object.assign(this.baseLayerSourceOptions, {
      'layer': layer
    });

    this.layers[0].setSource(new WmtsSource(this.baseLayerSourceOptions));
  }

}
