import { DeleteGLBuffer } from './DeleteGLBuffer';
import { IVertexBuffer } from './IVertexBuffer';
import { IVertexBufferConfig } from './IVertexBufferConfig';
import { gl } from '../GL';

export class VertexBuffer implements IVertexBuffer
{
    /**
     * Maximum number of entries per batch before a flush takes place.
     *
     * @type {number}
     */
    batchSize: number;

    /**
     * The size, in bytes, per entry in the array buffer.
     *
     * @type {number}
     */
    dataSize: number;

    /**
     * The amount of elements / floats a single vertex consists of.
     *
     * The default is 6:
     *
     * position (x,y - 2 floats)
     * texture coord (x,y - 2 floats)
     * texture index (uint)
     * packed color (uint)
     *
     * @type {number}
     */
    vertexElementSize: number;

    /**
     * The size, in bytes, of a single vertex in the array buffer.
     *
     * This is `vertexElementSize * dataSize`.
     *
     * @type {number}
     */
    vertexByteSize: number;

    /**
     * The size, in bytes, of a single entry in the array buffer.
     *
     * This is `vertexByteSize * 4` for a quad.
     *
     * @type {number}
     */
    entryByteSize: number;

    /**
     * The size, in bytes, of the Array Buffer.
     *
     * This is `batchSize * entryByteSize`
     *
     * @type {number}
     */
    bufferByteSize: number;

    /**
     * The Array Buffer.
     *
     * @type {ArrayBuffer}
     */
    data: ArrayBuffer;

    /**
     * Float32 View of the Array Buffer.
     *
     * @type {Float32Array}
     */
    vertexViewF32: Float32Array;

    /**
     * Uint32 View of the Array Buffer.
     *
     * @type {Uint32Array}
     */
    vertexViewU32: Uint32Array;

    /**
     * The data array buffer.
     *
     * @type {WebGLBuffer}
     */
    vertexBuffer: WebGLBuffer;

    indexed: boolean = false;

    isDynamic: boolean = false;

    /**
     * The total number of entries added to the buffer so far.
     *
     * @type {number}
     */
    count: number = 0;

    /**
     * The current buffer offset.
     *
     * @type {number}
     */
    offset: number = 0;

    elementsPerEntry: number;

    constructor (config: IVertexBufferConfig = {})
    {
        const {
            batchSize = 1,
            dataSize = 4,
            isDynamic = true,
            elementsPerEntry = 4,
            vertexElementSize = 6
        } = config;

        this.batchSize = batchSize;
        this.dataSize = dataSize;
        this.vertexElementSize = vertexElementSize;
        this.isDynamic = isDynamic;
        this.elementsPerEntry = elementsPerEntry;

        //  Derive the remaining values
        this.vertexByteSize = vertexElementSize * dataSize;
        this.entryByteSize = this.vertexByteSize * elementsPerEntry;
        this.bufferByteSize = batchSize * this.entryByteSize;

        this.create();
    }

    create (): void
    {
        const data = new ArrayBuffer(this.bufferByteSize);

        this.data = data;

        this.vertexViewF32 = new Float32Array(data);
        this.vertexViewU32 = new Uint32Array(data);

        this.vertexBuffer = gl.createBuffer();

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);

        const type = (this.isDynamic) ? gl.DYNAMIC_DRAW : gl.STATIC_DRAW;

        gl.bufferData(gl.ARRAY_BUFFER, data, type);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    }

    add (count: number): void
    {
        this.count += count;
        this.offset += (this.vertexElementSize * count);
    }

    canContain (count: number): boolean
    {
        return ((this.count + count) <= this.batchSize);
    }

    free (): number
    {
        return Math.max(0, 1 - (this.count / this.batchSize));
    }

    bind (): void
    {
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    }

    destroy (): void
    {
        DeleteGLBuffer(this.vertexBuffer);

        this.data = null;
        this.vertexViewF32 = null;
        this.vertexViewU32 = null;
        this.vertexBuffer = null;
    }
}
