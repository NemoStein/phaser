/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */

import { Distance } from '../../math/vec2/Distance';
import { ICircle } from '../circle/ICircle';

/**
 * Checks if two Circles intersect.
 *
 * @function Phaser.Geom.Intersects.CircleToCircle
 * @since 3.0.0
 *
 * @param {Phaser.Geom.Circle} circleA - The first Circle to check for intersection.
 * @param {Phaser.Geom.Circle} circleB - The second Circle to check for intersection.
 *
 * @return {boolean} `true` if the two Circles intersect, otherwise `false`.
 */
export function CircleToCircle (circleA: ICircle, circleB: ICircle): boolean
{
    return (Distance(circleA, circleB) <= (circleA.radius + circleB.radius));
}
