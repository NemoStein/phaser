import { GetMaxTextures, SetMaxTextures } from '../../../config/MaxTextures';

import { CheckShaderMaxIfStatements } from '../shaders/CheckShaderMaxIfStatements';
import { IRenderPass } from './IRenderPass';
import { gl } from '../GL';

//  As per the WebGL spec, the browser should always support at least 8 texture units

export function CreateTempTextures (renderPass: IRenderPass): void
{
    let maxGPUTextures: number = CheckShaderMaxIfStatements(gl.getParameter(gl.MAX_TEXTURE_IMAGE_UNITS));

    const maxConfigTextures = GetMaxTextures();

    if (maxConfigTextures === 0 || (maxConfigTextures > 0 && maxConfigTextures > maxGPUTextures))
    {
        //  Insert gpu limit into config value
        SetMaxTextures(maxGPUTextures);
    }
    else if (maxConfigTextures > 0 && maxConfigTextures < maxGPUTextures)
    {
        //  Limit to config setting, or 8, whichever is higher
        maxGPUTextures = Math.max(8, maxConfigTextures);
    }

    const tempTextures = renderPass.tempTextures;

    if (tempTextures.length)
    {
        tempTextures.forEach(texture =>
        {
            gl.deleteTexture(texture);
        });
    }

    const index = [];

    //  Create temp textures to stop WebGL errors on mac os
    for (let texturesIndex: number = 0; texturesIndex < maxGPUTextures; texturesIndex++)
    {
        const tempTexture = gl.createTexture();

        gl.activeTexture(gl.TEXTURE0 + texturesIndex);

        gl.bindTexture(gl.TEXTURE_2D, tempTexture);

        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([ 0, 0, 255, 255 ]));

        tempTextures[texturesIndex] = tempTexture;

        index.push(texturesIndex);
    }

    renderPass.maxTextures = maxGPUTextures;

    renderPass.textureIndex = index;

    //  ID Zero is reserved for FBO Textures
    renderPass.currentActiveTexture = 1;
}
