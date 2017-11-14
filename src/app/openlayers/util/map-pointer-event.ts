export class MapPointerEvent {
    public coordinate: number[];
    public map: any;
    public orginalEvent: object;
    public pixel: number[];
    public type: string;
    public zoom: number;
    public features: Array<any>;

    constructor(coordinate: number[], map: any, orginalEvent: object, pixel: number[], type: string, features?: Array<any>) {
        this.coordinate = coordinate;
        this.map = map;
        this.orginalEvent = orginalEvent;
        this.pixel = pixel;
        this.type = type;
        this.zoom = this.map.getView().getZoom();
        this.features = features;
    }
  }