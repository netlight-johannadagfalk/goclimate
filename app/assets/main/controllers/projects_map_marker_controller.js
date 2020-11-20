import { Controller } from 'stimulus';
import proj4 from 'proj4';

/* These markers are overlaid on top of world_epsg_32663.png (projected using
 * the EPSG:32663 coordinate system). This class reads WGS84 (EPSG:4326)
 * coordinates from data attributes and transforms them to EPSG:32663, then
 * percentages of the map image, and finally sets those percentages as absolute
 * positioning. EPSG:32663 has positive values going east and north, so
 * percentages are from left and bottom. */

const transformer = proj4('EPSG:4326', 'PROJCS["WGS 84 / World Equidistant Cylindrical",GEOGCS["WGS 84",DATUM["WGS_1984",SPHEROID["WGS 84",6378137,298.257223563,AUTHORITY["EPSG","7030"]],AUTHORITY["EPSG","6326"]],PRIMEM["Greenwich",0,AUTHORITY["EPSG","8901"]],UNIT["degree",0.01745329251994328,AUTHORITY["EPSG","9122"]],AUTHORITY["EPSG","4326"],AXIS["Latitude",NORTH],AXIS["Longitude",EAST]],UNIT["metre",1,AUTHORITY["EPSG","9001"]],PROJECTION["Equirectangular"]]');

/* Bounds for world_epsg_32663.png (it does not cover the full coordinate system bounds) */
const WORLD_IMAGE_LEFT = -20037508.3428;
const WORLD_IMAGE_BOTTOM = -6620510.8664;
const WORLD_IMAGE_WIDTH = 40075016.6856;
const WORLD_IMAGE_HEIGHT = 15929446.9914;

export default class ProjectsMapMarkerController extends Controller {
  initialize() {
    this.setPosition();
  }

  setPosition() {
    const [x, y] = transformer.forward([
      parseFloat(this.element.dataset.longitude),
      parseFloat(this.element.dataset.latitude)
    ]);
    const imagePercentalX = ((x - WORLD_IMAGE_LEFT) / WORLD_IMAGE_WIDTH) * 100;
    const imagePercentalY = ((y - WORLD_IMAGE_BOTTOM) / WORLD_IMAGE_HEIGHT) * 100;

    this.element.style.left = `${imagePercentalX}%`;
    this.element.style.bottom = `${imagePercentalY}%`;
  }
}
