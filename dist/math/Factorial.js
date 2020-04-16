/**
 * @author       Richard Davey <rich@photonstorm.com>
 * @copyright    2020 Photon Storm Ltd.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Calculates the factorial of a given number for integer values greater than 0.
 *
 * @function Phaser.Math.Factorial
 * @since 3.0.0
 *
 * @param {number} value - A positive integer to calculate the factorial of.
 *
 * @return {number} The factorial of the given number.
 */
export default function Factorial(value) {
    if (value === 0) {
        return 1;
    }
    let res = value;
    while (--value) {
        res *= value;
    }
    return res;
}
//# sourceMappingURL=Factorial.js.map