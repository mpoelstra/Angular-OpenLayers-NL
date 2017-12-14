export class Marker {
    public bron: string;
    public type: string;
    public coordinate: number[];
    public centroide_rd: string;

    public id: string;
    public naam: string;
    public nummer: string;
    public status: string;
    public omschrijving: string;
    public aliassen: string;
    

    constructor(bron: string, type: string, coordinate: number[]) {
        this.bron = bron;
        this.type = type;

        this.resetMarker(coordinate);
    }

    private uuidv4():string {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    }

    private setId() {
        var prefix;
        switch(this.type) {
            case 'weegbrug':
                prefix = 'wgb-';
            break;
            default:
                prefix = 'obj-';
            break;
        }

        this.id = prefix + this.uuidv4();
    }

    public resetMarker(coordinate: number[]) {
        this.coordinate = coordinate;
        this.centroide_rd = `POINT(${coordinate[0].toFixed(3)},${coordinate[1].toFixed(3)})`;
        this.setId();
    }
  }
  
  