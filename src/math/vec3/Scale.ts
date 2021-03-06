import { Vec3 } from './Vec3';

export function Scale (a: Vec3, scalar: number, out: Vec3 = new Vec3()): Vec3
{
    return out.set(
        a.x * scalar,
        a.y * scalar,
        a.z * scalar
    );
}
