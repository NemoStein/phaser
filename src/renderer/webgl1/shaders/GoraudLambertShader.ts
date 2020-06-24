import * as GL_CONST from '../GL_CONST';

import { GORAUD_LAMBERT_FRAG } from '../glsl/GORAUD_LAMBERT_FRAG';
import { GORAUD_LAMBERT_VERT } from '../glsl/GORAUD_LAMBERT_VERT';
import { IShader } from './IShader';
import { Shader } from './Shader';

export class GoraudLambertShader extends Shader implements IShader
{
    constructor ()
    {
        super();

        const config = {
            fragmentShader: GORAUD_LAMBERT_FRAG,
            vertexShader: GORAUD_LAMBERT_VERT,
            attributes: {
                aVertexPosition: { size: 3, type: GL_CONST.FLOAT, normalized: false, offset: 0 },
                aVertexNormal: { size: 3, type: GL_CONST.FLOAT, normalized: false, offset: 12 },
                aTextureCoord: { size: 2, type: GL_CONST.FLOAT, normalized: false, offset: 24 }
            },
            uniforms: {
                uProjectionMatrix: new Float32Array(16),
                uCameraMatrix: new Float32Array(16),
                uNormalMatrix: new Float32Array(16),
                uModelMatrix: new Float32Array(16).fill(0),

                uTexture: 0,
                uShininess: 1.0,
                uLightDirection: [ 0, 0, 0 ],

                uLightAmbient: [ 1, 1, 1, 1 ],
                uLightDiffuse: [ 1, 1, 1, 1 ],
                uLightSpecular: [ 1, 1, 1, 1 ],

                uMaterialAmbient: [ 1, 1, 1, 1 ],
                uMaterialDiffuse: [ 1, 1, 1, 1 ],
                uMaterialSpecular: [ 0, 0, 0, 1 ]
            }
        };

        this.fromConfig(config);
    }
}
