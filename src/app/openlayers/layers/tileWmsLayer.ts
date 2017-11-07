import TileLayer from 'ol/layer/tile';
import TileWmsSource from 'ol/source/tilewms';

export class TileWmsLayer {
    public layer: string;
    public url: string;

    constructor(layer, url) {
        this.layer = layer;
        this.url = url;
    }

    getLayer() {
        let layer = new TileLayer({
            source: new TileWmsSource({
                url: this.url,
                params: {'LAYERS': this.layer}
            })
        })

        return layer;
    }

}
