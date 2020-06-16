import { IMatrix4 } from './IMatrix4';
import { Matrix4 } from './Matrix4';

export function Transpose (matrix: IMatrix4, out: Matrix4 = new Matrix4()): IMatrix4
{
    const [ m00, m01, m02, m03, m10, m11, m12, m13, m20, m21, m22, m23, m30, m31, m32, m33 ] = matrix.data;

    return out.set(
        m00,
        m10,
        m20,
        m30,
        m01,
        m11,
        m21,
        m31,
        m02,
        m12,
        m22,
        m32,
        m03,
        m13,
        m23,
        m33
    );
}