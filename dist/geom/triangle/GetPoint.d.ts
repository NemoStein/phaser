/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
import ITriangle from './ITriangle';
import Vec2 from '../../math/vec2/Vec2';
/**
 * Returns a Point from around the perimeter of a Triangle.
 *
 * @function Phaser.Geom.Triangle.GetPoint
 * @since 3.0.0
 *
 * @generic {Phaser.Geom.Point} O - [out,$return]
 *
 * @param {Phaser.Geom.Triangle} triangle - The Triangle to get the point on its perimeter from.
 * @param {number} position - The position along the perimeter of the triangle. A value between 0 and 1.
 * @param {(Phaser.Geom.Point|object)} [out] - An option Point, or Point-like object to store the value in. If not given a new Point will be created.
 *
 * @return {(Phaser.Geom.Point|object)} A Point object containing the given position from the perimeter of the triangle.
 */
export default function GetPoint(triangle: ITriangle, position: number, out?: Vec2): Vec2;
//# sourceMappingURL=GetPoint.d.ts.map