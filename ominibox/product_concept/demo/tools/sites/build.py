"""第三方网页快照 → public/sites/<站>/（index.html + style.css + assets/）

在 demo/ 下运行：python3 -I tools/sites/build.py [zhihu bili xhs x]
输入 out/sites-raw/<站>/raw.html、sheets.json（tools/sites/export-site.mjs 用 ego-browser 从登录态真实页面导出，
导出前 prepare.js 已经清空内容位、去掉广告和别人的内容）。
这里：
  - 按文档顺序合并全部样式表（读不到的跨域样式表直接下载），url() 转成绝对地址
  - 只保留真正用到的网页字体（X 的 TwitterChirp；知乎 / B 站 / 小红书正文都是系统字体）
  - 用户内容（头像、封面、配图）一律不下载、不保留：只留各站静态资源 CDN 上的界面图片
  - 界面图片、字体下载到 assets/，样式与 HTML 里改成相对路径
  - 去掉 <style> / <link rel=stylesheet>，换成 style.css + ../freeze.css（停掉动画、过渡、光标、滚动条）
"""
import hashlib, json, os, re, sys, urllib.parse, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
RAW = os.path.join(ROOT, 'out', 'sites-raw')
PUB = os.path.join(ROOT, 'public', 'sites')
UA = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/141.0 Safari/537.36'
SITES = {
    'zhihu': {'ref': 'https://zhuanlan.zhihu.com/', 'fonts': []},
    'bili': {'ref': 'https://search.bilibili.com/', 'fonts': []},
    'xhs': {'ref': 'https://www.xiaohongshu.com/', 'fonts': []},
    'x': {'ref': 'https://x.com/', 'fonts': ['TwitterChirp']},
}
# 用户内容所在的域名 / 路径：一律不保留
USER = re.compile(r'pbs\.twimg\.com|video\.twimg\.com|sns-[\w-]+\.xhscdn\.com|ci\.xiaohongshu\.com|hdslb\.com/bfs/(face|archive|cover|banner|garb|new_dyn|article)|picx?\d?\.zhimg\.com|pic\w*\.zhimg\.com|zhimg\.com/v2-|zhimg\.com/\d|zhuanlan\.zhihu\.com/p/|x\.com/search|search\.bilibili\.com/all|xiaohongshu\.com/search')


def get(u, ref):
    req = urllib.request.Request(u, headers={'User-Agent': UA, 'Referer': ref})
    return urllib.request.urlopen(req, timeout=40).read()


def build(k):
    cfg = SITES[k]
    src, out = os.path.join(RAW, k), os.path.join(PUB, k)
    os.makedirs(os.path.join(out, 'assets'), exist_ok=True)
    assets = {}

    def local(u):
        """下载界面资源，返回相对路径；用户内容返回 None"""
        if u.startswith('data:'):
            return u
        if USER.search(u):
            return None
        if u in assets:
            return assets[u]
        ext = os.path.splitext(urllib.parse.urlparse(u).path)[1][:6] or '.bin'
        name = 'assets/' + hashlib.sha1(u.encode()).hexdigest()[:12] + ext
        try:
            open(os.path.join(out, name), 'wb').write(get(u, cfg['ref']))
        except Exception as e:
            print(k, 'skip asset', u[:90], e)
            name = None
        assets[u] = name
        return name

    # ---- 样式 ----
    parts = []
    for s in json.load(open(os.path.join(src, 'sheets.json'))):
        t = s['text']
        if t is None and s['href']:
            try:
                t = get(s['href'], cfg['ref']).decode('utf8', 'replace')
            except Exception as e:
                print(k, 'css fail', s['href'], e)
                t = ''
        base = s['href'] or cfg['ref']
        t = re.sub(r'url\((["\']?)(?!data:)([^"\')]+)\1\)', lambda m: 'url("%s")' % urllib.parse.urljoin(base, m.group(2).strip()), t or '')
        if s.get('media') and s['media'] not in ('', 'all'):
            t = '@media %s {\n%s\n}' % (s['media'], t)
        parts.append(t)
    css = '\n'.join(parts)
    css = re.sub(r'@charset[^;]*;', '', css)

    def font_face(m):
        body = m.group(0)
        fam = re.search(r'font-family:\s*["\']?([^;"\']+)', body)
        return body if fam and fam.group(1).strip() in cfg['fonts'] else ''
    css = re.sub(r'@font-face\s*\{[^}]*\}', font_face, css)

    def css_url(m):
        p = local(m.group(1))
        return 'url("%s")' % p if p else 'none'
    css = re.sub(r'url\("([^"]+)"\)', css_url, css)
    open(os.path.join(out, 'style.css'), 'w').write(css)

    # ---- HTML ----
    html = open(os.path.join(src, 'raw.html')).read()
    html = re.sub(r'<style\b[^>]*>.*?</style>', '', html, flags=re.S)
    html = re.sub(r'<link\b[^>]*rel="stylesheet"[^>]*>', '', html)
    html = re.sub(r'<link\b[^>]*>', '', html)
    html = re.sub(r'<base\b[^>]*>', '', html)

    def img_src(m):
        p = local(m.group(2).replace('&amp;', '&'))
        return '%s="%s"' % (m.group(1), p) if p else '%s="" data-dropped="1"' % m.group(1)
    html = re.sub(r'\b(src|poster)="([^"]+)"', img_src, html)

    def style_url(m):
        u = m.group(1).replace('&amp;', '&')
        p = local(u)
        return 'url(&quot;%s&quot;)' % p if p else 'none'
    html = re.sub(r'url\(&quot;(.*?)&quot;\)', style_url, html)
    html = re.sub(r'\bsrcset="[^"]*"', '', html)

    # <use xlink:href="/…/sprite.svg#id">：根路径相对于站点，下载雪碧图
    def use_href(m):
        p = local(urllib.parse.urljoin(cfg['ref'], m.group(2)))
        return '%s="%s%s"' % (m.group(1), p, m.group(3)) if p else m.group(0)
    html = re.sub(r'(xlink:href|href)="(/[^"#]+)(#[^"]*)"', use_href, html)
    head = '<meta charset="utf-8"><link rel="stylesheet" href="style.css"><link rel="stylesheet" href="../freeze.css">'
    html = re.sub(r'<head\b([^>]*)>', lambda m: '<head%s>%s' % (m.group(1), head), html, count=1)
    left = re.findall(r'(?:src|url\(&quot;)(https?://[^"&]+)', html)
    open(os.path.join(out, 'index.html'), 'w').write(html)
    print(k, 'html KB', len(html) // 1024, 'css KB', len(css) // 1024, 'assets', sum(1 for v in assets.values() if v and not v.startswith('data:')), 'dropped', sum(1 for v in assets.values() if v is None), 'remote left', len(left))


if __name__ == '__main__':
    for k in sys.argv[1:] or SITES:
        build(k)
