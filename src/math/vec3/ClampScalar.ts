import { Clamp as MathClamp } from '../Clamp';
import { Vec3 } from './Vec3';

export function ClampScalar (a: Vec3, min: number, max: number, out: Vec3 = new Vec3()): Vec3
{
    return out.set(
        MathClamp(a.x, min, max),
        MathClamp(a.y, min, max),
        MathClamp(a.z, min, max)
    );
}
