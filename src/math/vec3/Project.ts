import { IRectangle } from '../../geom/rectangle/IRectangle';
import { Matrix4 } from '../mat4/Matrix4';
import { Multiply } from '../mat4/Multiply';
import { TransformMat4 } from './TransformMat4';
import { Vec3 } from './Vec3';

const tempMatrix1 = new Matrix4();
const tempMatrix2 = new Matrix4();

export function Project (v: Vec3, world: Matrix4, transform: Matrix4, viewport: IRectangle, out: Vec3 = new Vec3()): Vec3
{
    const { x, y, width, height } = viewport;

    tempMatrix1.set(
        width / 2, 0, 0, 0,
        0, -height / 2, 0, 0,
        0, 0, 0.5, 0,
        x + width / 2, height / 2 + y, 0.5, 1
    );

    Multiply(world, transform, tempMatrix2);
    Multiply(tempMatrix2, tempMatrix1, tempMatrix2);

    return TransformMat4(v, tempMatrix2, out);
}
