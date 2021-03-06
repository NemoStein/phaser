import '../../../config/Size.js';
import '../../BindingQueue.js';
import { GetMaxTextures } from '../../../config/MaxTextures.js';
import '../GL.js';
import '../fbo/CreateFramebuffer.js';
import '../textures/CreateGLTexture.js';
import '../fbo/DeleteFramebuffer.js';
import '../textures/DeleteGLTexture.js';
import '../../../math/pow2/IsSizePowerOfTwo.js';
import '../textures/SetGLTextureFilterMode.js';
import '../textures/UpdateGLTexture.js';
import '../textures/GLTextureBinding.js';
import '../buffers/IndexedBuffer.js';
import '../../../textures/Frame.js';
import '../../../textures/Texture.js';
import '../WebGLRendererInstance.js';
import { SingleTextureQuadShader } from './SingleTextureQuadShader.js';

const fragmentShader = `
#define SHADER_NAME MULTI_QUAD_FRAG

precision highp float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture[%count%];

void main (void)
{
    vec4 color;

    %forloop%

    gl_FragColor = color * vec4(vTintColor.bgr * vTintColor.a, vTintColor.a);
}`;
class MultiTextureQuadShader extends SingleTextureQuadShader {
    constructor(config = { fragmentShader }) {
        super(config);
    }
    createShaders(fragmentShaderSource, vertexShaderSource) {
        const maxTextures = GetMaxTextures();
        let src = '';
        for (let i = 1; i < maxTextures; i++) {
            if (i > 1) {
                src += '\n\telse ';
            }
            if (i < maxTextures - 1) {
                src += `if (vTextureId < ${i}.5)`;
            }
            src += '\n\t{';
            src += `\n\t\tcolor = texture2D(uTexture[${i}], vTextureCoord);`;
            src += '\n\t}';
        }
        fragmentShaderSource = fragmentShaderSource.replace(/%count%/gi, `${maxTextures}`);
        fragmentShaderSource = fragmentShaderSource.replace(/%forloop%/gi, src);
        super.createShaders(fragmentShaderSource, vertexShaderSource);
    }
    bind(projectionMatrix, cameraMatrix) {
        if (!this.program) {
            return false;
        }
        const renderer = this.renderer;
        const gl = renderer.gl;
        const uniforms = this.uniforms;
        gl.useProgram(this.program);
        gl.uniformMatrix4fv(uniforms.uProjectionMatrix, false, projectionMatrix);
        gl.uniformMatrix4fv(uniforms.uCameraMatrix, false, cameraMatrix);
        gl.uniform1iv(uniforms.uTexture, renderer.textures.textureIndex);
        gl.uniform1f(uniforms.uTime, performance.now());
        gl.uniform2f(uniforms.uResolution, renderer.width, renderer.height);
        this.bindBuffers(this.buffer.indexBuffer, this.buffer.vertexBuffer);
        return true;
    }
}

export { MultiTextureQuadShader };
