export class MapPointerEvent {
    public coordinate: number[];
    public map: any;
    public orginalEvent: object;
    public pixel: number[];
    public type: string;
    public zoom: number;

    constructor(coordinate: number[], map: any, orginalEvent: object, pixel: number[], type: string) {
        this.coordinate = coordinate;
        this.map = map;
        this.orginalEvent = orginalEvent;
        this.pixel = pixel;
        this.type = type;
        this.zoom = this.map.getView().getZoom();
    }
  }