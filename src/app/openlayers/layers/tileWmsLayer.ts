import TileLayer from 'ol/layer/tile';
import TileWmsSource from 'ol/source/tilewms';

export class TileWmsLayer {
    public layer: string;
    public url: string;
    public source;

    constructor(layer, url) {
        this.layer = layer;
        this.url = url;

        this.source = new TileWmsSource({
            url: this.url,
            params: {'LAYERS': this.layer}
        });
    }

    getLayer() {
        let layer = new TileLayer({
            source: this.source
        })

        return layer;
    }

}
