import Projection from 'ol/proj/projection';

export class ProjectionConfig {
    public extent: number[];
    public resolutions: number[];
    public matrixIds: number[];
    public code: string;
    public units: string;
    public projection: Projection;
}
