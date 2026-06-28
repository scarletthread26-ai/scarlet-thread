import math

# Target RGB: #4b0082 -> (75, 0, 130)
target = [75, 0, 130]

# Original RGB of the purple parts in the logo.
# Let's inspect the exact pixels of the logo if possible, but let's test a few common lilacs:
# e.g., #8a73b9 or #8e7bc2. Let's assume #8a73b9 -> (138, 115, 185)
# Or let's test a few.
src = [138, 115, 185]

# We want to find a CSS filter chain: hue-rotate(H deg) saturate(S%) brightness(B%) contrast(C%)
# that maps src close to target, and maps [255, 255, 255] close to [255, 255, 255] (or at least keeps it very bright).
# Since white is (255, 255, 255), any brightness(B) where B < 100% will reduce it.
# But wait! If we increase contrast(C) where C > 100%, it pushes light colors back to white!
# Let's see if a combination of brightness and contrast can keep white close to 255.
# For example, if we do brightness(B) and then contrast(C),
# a pixel with value x is transformed approximately as:
# x' = (x * B - 128) * C + 128
# We want x' = 255 when x = 255.
# So (255 * B - 128) * C + 128 = 255 => (255 * B - 128) * C = 127 => C = 127 / (255 * B - 128)
# If B = 0.6, then 255 * B - 128 = 153 - 128 = 25. Then C = 127 / 25 = 5.08 (i.e. contrast(508%))
# Let's write a solver to search the parameter space!

best_loss = 999999
best_params = None

def clamp(val):
    return min(255, max(0, val))

# Simple RGB to HSL and back, or we can just simulate the CSS filters in RGB.
# Let's simulate:
# 1. hue-rotate:
# CSS hue-rotate is a matrix multiplication:
# [R', G', B'] = Mat * [R, G, B]
def hue_rotate_mat(deg):
    cos = math.cos(math.radians(deg))
    sin = math.sin(math.radians(deg))
    # Matrix constants for hue-rotate:
    return [
        [0.213 + cos*0.787 - sin*0.213, 0.715 - cos*0.715 - sin*0.715, 0.072 - cos*0.072 + sin*0.928],
        [0.213 - cos*0.213 + sin*0.143, 0.715 + cos*0.285 + sin*0.140, 0.072 - cos*0.072 - sin*0.283],
        [0.213 - cos*0.213 - sin*0.787, 0.715 - cos*0.715 + sin*0.715, 0.072 + cos*0.928 + sin*0.072]
    ]

def apply_mat(mat, rgb):
    return [
        mat[0][0]*rgb[0] + mat[0][1]*rgb[1] + mat[0][2]*rgb[2],
        mat[1][0]*rgb[0] + mat[1][1]*rgb[1] + mat[1][2]*rgb[2],
        mat[2][0]*rgb[0] + mat[2][1]*rgb[1] + mat[2][2]*rgb[2]
    ]

# 2. saturate:
def apply_saturate(s, rgb):
    # s is multiplier (e.g. 1.0 = 100%)
    # Lum weights: 0.213, 0.715, 0.072
    lum = 0.213*rgb[0] + 0.715*rgb[1] + 0.072*rgb[2]
    return [
        lum + (rgb[0] - lum)*s,
        lum + (rgb[1] - lum)*s,
        lum + (rgb[2] - lum)*s
    ]

# 3. brightness:
def apply_brightness(b, rgb):
    return [rgb[0]*b, rgb[1]*b, rgb[2]*b]

# 4. contrast:
def apply_contrast(c, rgb):
    # c is multiplier
    return [
        (rgb[0] - 127.5)*c + 127.5,
        (rgb[1] - 127.5)*c + 127.5,
        (rgb[2] - 127.5)*c + 127.5
    ]

# Search:
# H: 0 to 360 step 5
# S: 0.5 to 5.0 step 0.1
# B: 0.2 to 1.5 step 0.05
# C: 0.5 to 3.0 step 0.1
for h in range(0, 360, 5):
    mat = hue_rotate_mat(h)
    for s_idx in range(5, 50, 2):
        s = s_idx / 10.0
        for b_idx in range(4, 25, 1):
            b = b_idx / 10.0
            for c_idx in range(5, 35, 2):
                c = c_idx / 10.0
                
                # Apply filter to src:
                r1 = apply_mat(mat, src)
                r2 = apply_saturate(s, r1)
                r3 = apply_brightness(b, r2)
                r4 = apply_contrast(c, r3)
                
                out_src = [clamp(r4[0]), clamp(r4[1]), clamp(r4[2])]
                
                # Apply to white:
                w1 = apply_mat(mat, [255, 255, 255])
                w2 = apply_saturate(s, w1)
                w3 = apply_brightness(b, w2)
                w4 = apply_contrast(c, w3)
                out_w = [clamp(w4[0]), clamp(w4[1]), clamp(w4[2])]
                
                # Loss function:
                # 1. Difference of out_src from target
                diff_src = sum((out_src[i] - target[i])**2 for i in range(3))
                # 2. Difference of out_w from white (we want it to remain white, i.e. 255, 255, 255)
                diff_w = sum((out_w[i] - 255)**2 for i in range(3))
                
                loss = diff_src + 1.5 * diff_w
                
                if loss < best_loss:
                    best_loss = loss
                    best_params = (h, s, b, c, out_src, out_w)

print(f"Best Loss: {best_loss}")
print(f"Params: hue-rotate({best_params[0]}deg) saturate({int(best_params[1]*100)}%) brightness({int(best_params[2]*100)}%) contrast({int(best_params[3]*100)}%)")
print(f"Result color: {best_params[4]}")
print(f"White color: {best_params[5]}")
