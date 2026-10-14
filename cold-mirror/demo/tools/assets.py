# 预览素材准备：读 src/timing.json，把 ../assets 里的原图整理到 public/
#   her/<发色>.jpg   从 model.JPG 抠出头发蒙版，按发色库色卡重新上色。脸和背景逐像素不变，光线扫过时前后完全对齐。
#   her/初恋蓬松短发.jpg  App 截图里真实的换发型结果，按眼睛位置对齐到 model.JPG 的构图
#   lib/<发型>.jpg   发型库原图（别的模特，预览里标 STAND-IN）
#   swatch/<发色>.jpg 发色库色卡（镜面上的发色库卡片）
#   home/<名>.png    首页截图里的字母 N C G H A E 和工具道具（片尾），白底转成透明
#   icon.png         产品图标（白色荔枝）转成黑色 + 透明底
# 这些都只是 animatic 占位，正片由 Higgsfield 生成。
# 用法：python tools/assets.py（需要 numpy + Pillow）
import json, glob, os
import numpy as np
from PIL import Image, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.join(HERE, '..')
A = os.path.join(ROOT, '..', 'assets')
OUT = os.path.join(ROOT, 'public', 'her')
os.makedirs(OUT, exist_ok=True)
T = json.load(open(os.path.join(ROOT, 'src', 'timing.json')))

src = Image.open(os.path.join(A, 'model.JPG')).convert('RGB')
W, H = src.size

# 右下角的小红书水印用正上方的一块盖掉
src.paste(src.crop((850, 1560, 1180, 1660)), (850, 1660))
rgb = np.asarray(src).astype(np.float32) / 255
hsv = np.asarray(src.convert('HSV')).astype(np.float32) / 255
hue, sat, val = hsv[..., 0] * 360, hsv[..., 1], hsv[..., 2]

# 棕发：暖色相、有饱和度、不太亮；暗部阴影也算。先闭运算补洞，再挖掉脸、脖子和胸口
m = (((hue > 5) & (hue < 45) & (sat > 0.25) & (val < 0.8)) | ((val < 0.3) & (sat > 0.15))).astype('uint8') * 255
mi = Image.fromarray(m).filter(ImageFilter.MedianFilter(5))
mi = mi.filter(ImageFilter.MaxFilter(17)).filter(ImageFilter.MinFilter(17))
m = np.asarray(mi).astype(np.float32) / 255
yy, xx = np.mgrid[0:H, 0:W]
face = ((xx - 0.505 * W) / (0.185 * W)) ** 2 + ((yy - 0.40 * H) / (0.165 * H)) ** 2 < 1
neck = (xx > 0.42 * W) & (xx < 0.60 * W) & (yy > 0.52 * H) & (yy < 0.64 * H)
skin = (sat < 0.38) & (val > 0.62) & (hue < 40)   # 皮肤和白上衣：闭运算可能把发丝之间的皮肤也填上
m[face | neck | skin] = 0
mi = Image.fromarray((m * 255).astype('uint8')).filter(ImageFilter.GaussianBlur(5))
mask = np.asarray(mi).astype(np.float32)[..., None] / 255
mi.save(os.path.join(OUT, '_mask.png'))

lum = (rgb @ np.array([0.299, 0.587, 0.114], np.float32))[..., None]
meanL = float((lum * mask).sum() / mask.sum())

def swatch(name):
    # 色卡是背影图：取中间一块的中位色就是发色
    f = glob.glob(os.path.join(A, 'hair_colors', f'*_{name}.png'))[0]
    s = np.asarray(Image.open(f).convert('RGB')).astype(np.float32) / 255
    h, w = s.shape[:2]
    c = s[int(.2 * h):int(.55 * h), int(.38 * w):int(.62 * w)].reshape(-1, 3)
    return np.median(c, axis=0)

def recolor(name):
    t = swatch(name)
    # 浅色（金、灰）把暗部抬起来，否则深棕的阴影会变成一块块黑斑
    lt = float(t @ np.array([0.299, 0.587, 0.114], np.float32))
    k = 0.45 * lt
    rel = np.clip(lum / meanL, 0, 3) ** (0.9 - 0.4 * lt)
    out = np.clip(t * (k + (1 - k) * rel), 0, 1)
    res = rgb * (1 - mask) + out * mask
    Image.fromarray((res * 255).astype('uint8')).save(os.path.join(OUT, f'{name}.jpg'), quality=90)

src.save(os.path.join(OUT, '原色.jpg'), quality=90)
for name in T['herColors']:
    recolor(name)
    print('color', name)

# 真实 App 结果：换发型大图预览里的「初恋蓬松短发」，缩放平移到 model.JPG 的眼睛位置
shot = Image.open(glob.glob(os.path.join(A, 'screenshot', '换发型大图预览*'))[0]).convert('RGB')
# 左上角的发型名标签用下方的路面盖掉；照片底边（y=3023）以下用镜像补齐
shot.paste(shot.crop((306, 972, 700, 1076)), (306, 864))
photo_bottom = 3023
pad = shot.crop((0, photo_bottom - 400, shot.width, photo_bottom)).transpose(Image.FLIP_TOP_BOTTOM)
shot.paste(pad, (0, photo_bottom))
# 两眼瞳孔（像素，手工量）：model.JPG (475,610)/(705,600)，截图 (925,1670)/(1240,1660)
s = 230 / 315
cx, cy = 1082 - 590 / s, 1665 - 605 / s
crop = shot.crop((round(cx), round(cy), round(cx + W / s), round(cy + H / s))).resize((W, H), Image.LANCZOS)
crop.save(os.path.join(OUT, '初恋蓬松短发.jpg'), quality=90)
print('style 初恋蓬松短发')

def save_small(src_path, dst, width):
    im = Image.open(src_path).convert('RGB')
    im.resize((width, round(im.height * width / im.width)), Image.LANCZOS).save(dst, quality=88)

for d in ('lib', 'swatch', 'home'):
    os.makedirs(os.path.join(ROOT, 'public', d), exist_ok=True)
for name in T['libStyles']:
    save_small(os.path.join(A, 'hairstyles_woman', f'{name}.png'), os.path.join(ROOT, 'public', 'lib', f'{name}.jpg'), 768)
for name in T['grid']:
    f = glob.glob(os.path.join(A, 'hair_colors', f'*_{name}.png'))[0]
    save_small(f, os.path.join(ROOT, 'public', 'swatch', f'{name}.jpg'), 320)

def white_to_alpha(im):
    # 把「画在浅色底上」的图还原成带透明度的图：底色取裁切框四边的中位色，比底色暗多少就有多不透明
    a = np.asarray(im).astype(np.float32) / 255
    border = np.concatenate([a[0], a[-1], a[:, 0], a[:, -1]])
    bg = np.median(border, axis=0)
    alpha = np.clip(((bg - a) / np.maximum(bg, 1e-3)).max(axis=2), 0, 1)
    alpha = np.clip((alpha - 0.03) / 0.97, 0, 1)
    col = np.where(alpha[..., None] > 1e-3, (a - bg * (1 - alpha[..., None])) / np.maximum(alpha[..., None], 1e-3), 0)
    out = np.dstack([np.clip(col, 0, 1), alpha])
    return Image.fromarray((out * 255).astype('uint8'))

# 首页截图（2160×3840）里的元素框，片尾用
home = Image.open(os.path.join(A, 'screenshot', 'home 页.png')).convert('RGB')
BOX = {
    'N': (330, 520, 845, 1060), 'C': (860, 1075, 1210, 1445), 'G': (1650, 945, 2125, 1425),
    'H': (1395, 1760, 1850, 2215), 'A': (390, 1950, 825, 2470), 'E': (1440, 2505, 1955, 3150),
    'scissors': (1030, 345, 1745, 745), 'dryer': (220, 1220, 530, 1875),
    'comb': (1330, 1330, 1660, 1660), 'clipper': (870, 2185, 1470, 2495),
}
for k, b in BOX.items():
    white_to_alpha(home.crop(b)).save(os.path.join(ROOT, 'public', 'home', f'{k}.png'))
print('home', ' '.join(BOX))

# 图标：白色荔枝在黑底上 → 亮度当透明度，颜色填黑
icon = np.asarray(Image.open(os.path.join(A, 'cold-mirror-icon.png')).convert('L')).astype(np.uint8)
Image.fromarray(np.dstack([np.zeros_like(icon)] * 3 + [icon])).save(os.path.join(ROOT, 'public', 'icon.png'))
print('icon')
