const target = [75, 0, 130];
const src = [123, 101, 173];

function clamp(val) {
    return Math.min(255, Math.max(0, val));
}

function hue_rotate_mat(deg) {
    const rad = deg * Math.PI / 180;
    const cos = Math.cos(rad);
    const sin = Math.sin(rad);
    return [
        [0.213 + cos*0.787 - sin*0.213, 0.715 - cos*0.715 - sin*0.715, 0.072 - cos*0.072 + sin*0.928],
        [0.213 - cos*0.213 + sin*0.143, 0.715 + cos*0.285 + sin*0.140, 0.072 - cos*0.072 - sin*0.283],
        [0.213 - cos*0.213 - sin*0.787, 0.715 - cos*0.715 + sin*0.715, 0.072 + cos*0.928 + sin*0.072]
    ];
}

function apply_mat(mat, rgb) {
    return [
        mat[0][0]*rgb[0] + mat[0][1]*rgb[1] + mat[0][2]*rgb[2],
        mat[1][0]*rgb[0] + mat[1][1]*rgb[1] + mat[1][2]*rgb[2],
        mat[2][0]*rgb[0] + mat[2][1]*rgb[1] + mat[2][2]*rgb[2]
    ];
}

function apply_saturate(s, rgb) {
    const lum = 0.213*rgb[0] + 0.715*rgb[1] + 0.072*rgb[2];
    return [
        lum + (rgb[0] - lum)*s,
        lum + (rgb[1] - lum)*s,
        lum + (rgb[2] - lum)*s
    ];
}

function apply_brightness(b, rgb) {
    return [rgb[0]*b, rgb[1]*b, rgb[2]*b];
}

function apply_contrast(c, rgb) {
    return [
        (rgb[0] - 127.5)*c + 127.5,
        (rgb[1] - 127.5)*c + 127.5,
        (rgb[2] - 127.5)*c + 127.5
    ];
}

let best_loss = 999999;
let best_params = null;

for (let h = 0; h <= 40; h += 1) {
    const mat = hue_rotate_mat(h);
    for (let s = 0.5; s <= 2.0; s += 0.02) {
        for (let b = 0.5; b <= 1.2; b += 0.02) {
            for (let c = 1.5; c <= 3.5; c += 0.05) {
                const r1 = apply_mat(mat, src);
                const r2 = apply_saturate(s, r1);
                const r3 = apply_brightness(b, r2);
                const r4 = apply_contrast(c, r3);
                
                const out_src = [clamp(r4[0]), clamp(r4[1]), clamp(r4[2])];
                
                const w1 = apply_mat(mat, [255, 255, 255]);
                const w2 = apply_saturate(s, w1);
                const w3 = apply_brightness(b, w2);
                const w4 = apply_contrast(c, w3);
                const out_w = [clamp(w4[0]), clamp(w4[1]), clamp(w4[2])];
                
                const diff_src = (out_src[0]-target[0])**2 + (out_src[1]-target[1])**2 + (out_src[2]-target[2])**2;
                const diff_w = (out_w[0]-255)**2 + (out_w[1]-255)**2 + (out_w[2]-255)**2;
                
                const loss = diff_src + 10.0 * diff_w; // very strict weight on white remaining white
                
                if (loss < best_loss) {
                    best_loss = loss;
                    best_params = [h, s, b, c, out_src, out_w];
                }
            }
        }
    }
}

console.log(`Best Loss: ${best_loss}`);
console.log(`Params: hue-rotate(${best_params[0]}deg) saturate(${Math.round(best_params[1]*100)}%) brightness(${Math.round(best_params[2]*100)}%) contrast(${Math.round(best_params[3]*100)}%)`);
console.log(`Result color: ${best_params[4].map(Math.round)}`);
console.log(`White color: ${best_params[5].map(Math.round)}`);
