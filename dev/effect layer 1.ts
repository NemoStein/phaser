import { AddChild, AddChildren } from '../src/display/';
import { BackgroundColor, Parent, Scenes, Size, WebGLRenderer } from '../src/config';
import { EffectLayer, Sprite } from '../src/gameobjects/';

import { Game } from '../src/Game';
import { ImageFile } from '../src/loader/files/ImageFile';
import { Loader } from '../src/loader/Loader';
import { Scene } from '../src/scenes/Scene';
import { Shader } from '../src/renderer/webgl1/shaders/Shader';
import { StaticWorld } from '../src/world/StaticWorld';

const verticalBarsFragmentShader = `
#define SHADER_NAME BARS_FRAG

precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

#define PI 0.01

void main (void)
{
    vec4 color = texture2D(uTexture, vTextureCoord);

    vec2 p = (gl_FragCoord.xy / uResolution.xy) - 0.5;

    float sx = 0.4 * sin(25.0 * p.y - (uTime * 0.001) * 2.0);

    float dy = 2.0 / (5.0 * abs(p.y - sx));

    gl_FragColor = color * vec4((p.x + 0.5) * dy, 0.5 * dy, dy - 1.65, 0.5);
}`;

const vduNoiseFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

float noise(vec2 pos) {
    return fract(sin(dot(pos, vec2(12.9898 - (uTime * 0.001) ,78.233 + (uTime * 0.001)))) * 43758.5453);
}

void main (void)
{
    vec2 normalPos = gl_FragCoord.xy / uResolution.xy;
    float pos = (gl_FragCoord.y / uResolution.y);
    //float mouse_dist = length(vec2((mouse.x - normalPos.x) * (uResolution.x / uResolution.y) , mouse.y - normalPos.y));
    float mouse_dist = 1.0;
    float distortion = clamp(1.0 - (mouse_dist + 0.1) * 3.0, 0.0, 1.0);

    pos -= (distortion * distortion) * 0.1;

    float c = sin(pos * 400.0) * 0.4 + 0.4;
    c = pow(c, 0.2);
    c *= 0.2;

    float band_pos = fract(uTime * 0.0001) * 3.0 - 1.0;
    c += clamp( (1.0 - abs(band_pos - pos) * 10.0), 0.0, 1.0) * 0.1;

    c += distortion * 0.08;
    // noise
    c += (noise(gl_FragCoord.xy) - 0.5) * (0.09);

    vec4 color = texture2D(uTexture, vTextureCoord);

    gl_FragColor = color + vec4( 0.0, c, 0.0, 1.0 );

}`;

const underwaterFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

#define MAX_ITER 4

void main (void)
{
    vec2 v_texCoord = gl_FragCoord.xy / uResolution;

    vec2 p =  v_texCoord * 8.0 - vec2(20.0);
    vec2 i = p;
    float c = 1.0;
    float inten = .05;

    for (int n = 0; n < MAX_ITER; n++)
    {
        float t = (uTime * 0.0001) * (1.0 - (3.0 / float(n+1)));

        i = p + vec2(cos(t - i.x) + sin(t + i.y),
        sin(t - i.y) + cos(t + i.x));

        c += 1.0/length(vec2(p.x / (sin(i.x+t)/inten),
        p.y / (cos(i.y+t)/inten)));
    }

    c /= float(MAX_ITER);
    c = 1.5 - sqrt(c);

    vec4 texColor = vec4(0.0, 0.01, 0.015, 1.0);

    texColor.rgb *= (1.0 / (1.0 - (c + 0.05)));

    gl_FragColor = texture2D(uTexture, vTextureCoord) * texColor;
}`;

const sineWaveFragmentShader2 = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

void main (void)
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;
    uv.y += (sin((uv.x + (uTime * 0.0005)) * 10.0) * 0.1) + (sin((uv.x + (uTime * 0.0002)) * 32.0) * 0.01);
    gl_FragColor = texture2D(uTexture, uv);
}`;

const sineWaveFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

void main (void)
{
    vec2 uv = gl_FragCoord.xy / uResolution.xy;

    // Represents the v/y coord(0 to 1) that will not sway.
    float fixedBasePosY = 0.0;

    // Configs for you to get the sway just right.
    float speed = 3.0;
    float verticleDensity = 6.0;
    float swayIntensity = 0.2;

    // Putting it all together.
    float offsetX = sin(uv.y * verticleDensity + (uTime * 0.001) * speed) * swayIntensity;

    // Offsettin the u/x coord.
    uv.x += offsetX * (uv.y - fixedBasePosY);

    gl_FragColor = texture2D(uTexture, uv);
}`;

const pixelateFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

void main (void)
{
    vec2 pixelSize = vec2(4.0, 4.0);
    vec2 size = uResolution.xy / pixelSize;
    vec2 color = floor((vTextureCoord * size)) / size + pixelSize / uResolution.xy * 0.5;

    gl_FragColor = texture2D(uTexture, color);
}`;

const plasmaFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

const float PI = 3.14159265;
float ptime = uTime * 0.0001;
float alpha = 1.0;
float size = 0.03;
float redShift = 0.5;
float greenShift = 0.5;
float blueShift = 0.9;

void main (void)
{
    vec4 tcolor = texture2D(uTexture, vTextureCoord);

    float color1, color2, color;

    color1 = (sin(dot(gl_FragCoord.xy, vec2(sin(ptime * 3.0), cos(ptime * 3.0))) * 0.02 + ptime * 3.0) + 1.0) / 2.0;
    vec2 center = vec2(640.0 / 2.0, 360.0 / 2.0) + vec2(640.0 / 2.0 * sin(-ptime * 3.0), 360.0 / 2.0 * cos(-ptime * 3.0));
    color2 = (cos(length(gl_FragCoord.xy - center) * size) + 1.0) / 2.0;
    color = (color1 + color2) / 2.0;

    float red = (cos(PI * color / redShift + ptime * 3.0) + 1.0) / 2.0;
    float green = (sin(PI * color / greenShift + ptime * 3.0) + 1.0) / 2.0;
    float blue = (sin(PI * color / blueShift + ptime * 3.0) + 1.0) / 2.0;

    gl_FragColor = tcolor * vec4(red, green, blue, alpha);
}`;

const lazerBeamFragmentShader = `
precision highp float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uResolution;

void main (void)
{
    vec4 color = texture2D(uTexture, vTextureCoord);

    vec2 p = (gl_FragCoord.yx / uResolution.yx) - 0.5;

    float sx = 0.3 * (p.x + 0.8) * sin(900.0 * p.x - 1.0 * pow(uTime / 1000.0, 0.55) * 5.0);
    float dy = 4.0 / (500.0 * abs(p.y - sx));

    dy += 1.0 / (25.0 * length(p - vec2(p.x, 0.0)));

    gl_FragColor = color * vec4((p.x + 0.1) * dy, 0.3 * dy, dy, 1.1);
}`;

const redFragmentShader = `
precision highp float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;

void main (void)
{
    vec4 color = texture2D(uTexture, vTextureCoord);

    gl_FragColor = color * vec4(1.0, 0.0, 0.0, 1.0);
}`;

const blurXFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;

void main (void)
{
    vec4 sum = vec4(0.0);
    float blur = 0.001953125;

    sum += texture2D(uTexture, vec2(vTextureCoord.x - 4.0 * blur, vTextureCoord.y)) * 0.05;
    sum += texture2D(uTexture, vec2(vTextureCoord.x - 3.0 * blur, vTextureCoord.y)) * 0.09;
    sum += texture2D(uTexture, vec2(vTextureCoord.x - 2.0 * blur, vTextureCoord.y)) * 0.12;
    sum += texture2D(uTexture, vec2(vTextureCoord.x - blur, vTextureCoord.y)) * 0.15;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
    sum += texture2D(uTexture, vec2(vTextureCoord.x + blur, vTextureCoord.y)) * 0.15;
    sum += texture2D(uTexture, vec2(vTextureCoord.x + 2.0 * blur, vTextureCoord.y)) * 0.12;
    sum += texture2D(uTexture, vec2(vTextureCoord.x + 3.0 * blur, vTextureCoord.y)) * 0.09;
    sum += texture2D(uTexture, vec2(vTextureCoord.x + 4.0 * blur, vTextureCoord.y)) * 0.05;

    gl_FragColor = sum;
}`;

const blurYFragmentShader = `
precision mediump float;

varying vec2 vTextureCoord;
varying float vTextureId;
varying vec4 vTintColor;

uniform sampler2D uTexture;

void main (void)
{
    vec4 sum = vec4(0.0);
    float blur = 0.001953125;

    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y - 4.0 * blur)) * 0.05;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y - 3.0 * blur)) * 0.09;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y - 2.0 * blur)) * 0.12;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y - blur)) * 0.15;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y)) * 0.16;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y + blur)) * 0.15;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y + 2.0 * blur)) * 0.12;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y + 3.0 * blur)) * 0.09;
    sum += texture2D(uTexture, vec2(vTextureCoord.x, vTextureCoord.y + 4.0 * blur)) * 0.05;

    gl_FragColor = sum;
}`;

class Demo extends Scene
{
    constructor ()
    {
        super();

        const loader = new Loader();

        loader.setPath('/phaser4-examples/public/assets/');
        // loader.setPath('/examples/public/assets/');

        loader.add(ImageFile('ayu', 'ayu.png'));
        loader.add(ImageFile('logo', 'logo.png'));
        loader.add(ImageFile('rocket', 'rocket.png'));
        loader.add(ImageFile('farm', 'farm-logo.png'));
        loader.add(ImageFile('star', 'star.png'));
        loader.add(ImageFile('bubble', 'bubble256.png'));

        loader.start(() => this.create());
    }

    create ()
    {
        // const red = new Shader({ fragmentShader: redFragmentShader, batchSize: 1 });
        // const blurX = new Shader({ fragmentShader: blurXFragmentShader, batchSize: 1 });
        // const blurY = new Shader({ fragmentShader: blurYFragmentShader, batchSize: 1 });
        // const lazer = new Shader({ fragmentShader: lazerBeamFragmentShader, batchSize: 1 });
        // const plasma = new Shader({ fragmentShader: plasmaFragmentShader, batchSize: 1 });
        // const pixel = new Shader({ fragmentShader: pixelateFragmentShader, batchSize: 1 });
        // const sine = new Shader({ fragmentShader: sineWaveFragmentShader, batchSize: 1 });
        // const sine2 = new Shader({ fragmentShader: sineWaveFragmentShader2, batchSize: 1 });
        // const underwater = new Shader({ fragmentShader: underwaterFragmentShader, batchSize: 1 });
        // const vdu = new Shader({ fragmentShader: vduNoiseFragmentShader, batchSize: 1 });
        const bars = new Shader({ fragmentShader: verticalBarsFragmentShader, batchSize: 1 });
        // const empty = new Shader({ batchSize: 1 });

        const world = new StaticWorld(this);

        const layer = new EffectLayer();

        // layer.shaders.push(red, blurX, blurY);
        // layer.shaders.push(lazer);
        // layer.shaders.push(plasma);
        // layer.shaders.push(pixel);
        // layer.shaders.push(sine);
        // layer.shaders.push(sine2);
        // layer.shaders.push(underwater);
        // layer.shaders.push(vdu);
        layer.shaders.push(bars);
        // layer.shaders.push(empty);

        const logo = new Sprite(200, 300, 'logo');
        const ayu = new Sprite(600, 300, 'ayu');
        const farm = new Sprite(200, 150, 'farm');
        const rocket = new Sprite(150, 500, 'rocket');
        const bubble = new Sprite(400, 450, 'bubble');
        const star = new Sprite(650, 500, 'star');

        // AddChildren(world, ayu, logo, farm, rocket, bubble, star);

        // AddChildren(layer, ayu, logo);

        AddChildren(layer, ayu, logo, farm, rocket, bubble, star);

        AddChild(world, layer);
    }
}

export default function (): void
{
    new Game(
        WebGLRenderer(),
        Size(800, 600),
        Parent('gameParent'),
        BackgroundColor(0x2d2d2d),
        Scenes(Demo)
    );
}
