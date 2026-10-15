// In-page preparation before export (runs inside the live, logged-in page).
// Marks content slots with data-slot, empties them (the video fills them with its own demo content),
// removes other people's images / ads / extra results. Returns a short report.
(site) => {
  const rep = [];
  const R = (el) => el.getBoundingClientRect();
  const txt = (el, name) => { if (!el) { rep.push('miss ' + name); return; } el.setAttribute('data-slot', name); el.textContent = ''; };
  const img = (el, name) => {
    if (!el) { rep.push('miss ' + name); return; }
    const r = R(el);
    el.setAttribute('data-slot', name);
    el.setAttribute('data-w', Math.round(r.width)); el.setAttribute('data-h', Math.round(r.height));
    el.querySelectorAll('img,picture,video,source,canvas').forEach((n) => n.remove());
    if (el.matches('img')) { const d = document.createElement('div'); for (const a of el.attributes) if (a.name !== 'src' && a.name !== 'srcset' && a.name !== 'alt') d.setAttribute(a.name, a.value); d.style.width = r.width + 'px'; d.style.height = r.height + 'px'; d.style.display = getComputedStyle(el).display === 'inline' ? 'inline-block' : getComputedStyle(el).display; el.replaceWith(d); return; }
    el.style.backgroundImage = 'none';
    el.querySelectorAll('*').forEach((n) => { if (getComputedStyle(n).backgroundImage !== 'none') n.style.backgroundImage = 'none'; });
  };
  const byText = (sel, re, root = document) => [...root.querySelectorAll(sel)].find((e) => re.test(e.textContent || ''));
  const blankImgs = (root) => root.querySelectorAll('img').forEach((i) => { if (!/\.svg|data:image\/svg/.test(i.src)) { i.removeAttribute('src'); i.style.visibility = 'hidden'; } });

  if (site === 'bili') {
    img(document.querySelector('.header-avatar-wrap .bili-avatar') || document.querySelector('.header-avatar-wrap img'), 'me-avatar');
    document.querySelectorAll('.header-avatar-wrap img').forEach((i) => i.remove());
    let cards = [...document.querySelectorAll('.video-list .bili-video-card')];
    for (const c of cards) if (/广告/.test(c.textContent) || c.querySelector('[class*="ad-"],.bili-video-card__info--ad')) { (c.closest('.video-list > *') || c).remove(); rep.push('ad removed'); }
    cards = [...document.querySelectorAll('.video-list .bili-video-card')];
    cards.slice(8).forEach((c) => (c.closest('.video-list > *') || c).remove());
    cards.slice(0, 8).forEach((c, i) => {
      img(c.querySelector('.bili-video-card__image--wrap .v-img') || c.querySelector('.bili-video-card__image--wrap'), `cover-${i}`);
      const st = c.querySelectorAll('.bili-video-card__stats--item');
      st.forEach((s, j) => { const sp = s.querySelector('span') || s; txt(sp, `stat-${i}-${j}`); });
      txt(c.querySelector('.bili-video-card__stats__duration'), `dur-${i}`);
      txt(c.querySelector('.bili-video-card__info--tit'), `title-${i}`);
      c.querySelector('.bili-video-card__info--tit')?.removeAttribute('title');
      txt(c.querySelector('.bili-video-card__info--author'), `up-${i}`);
      txt(c.querySelector('.bili-video-card__info--date') || c.querySelector('.bili-video-card__info--cheese_episode_count'), `date-${i}`); // 课程卡片是「· 共 N 课时」
      c.querySelectorAll('.bili-video-card__info--icon-text, .bili-video-card__info--rcmd').forEach((n) => n.remove());
    });
    rep.push('cards ' + cards.length);
  }

  if (site === 'xhs') {
    const me = byText('.side-bar .channel-list li, .side-bar li', /^\s*我\s*$/);
    if (me) img(me.querySelector('img')?.parentElement || me.querySelector('img'), 'me-avatar');
    const notes = [...document.querySelectorAll('section.note-item')].filter((n) => !n.querySelector('.query-note-item'));
    document.querySelectorAll('a.cover.ld').forEach((a) => a.classList.remove('ld')); // ld = 封面加载中的模糊占位态
    notes.forEach((n, i) => {
      img(n.querySelector('a.cover'), `cover-${i}`);
      txt(n.querySelector('.footer .title span') || n.querySelector('.footer .title'), `title-${i}`);
      img(n.querySelector('.author-avatar'), `avatar-${i}`);
      txt(n.querySelector('.author .name'), `author-${i}`);
      txt(n.querySelector('.time'), `date-${i}`);
      txt(n.querySelector('.like-wrapper .count'), `likes-${i}`);
    });
    const rec = document.querySelector('.query-note-item');
    if (rec) {
      [...rec.querySelectorAll('.item-text')].forEach((e, i) => txt(e, `hot-${i}`));
      rec.querySelectorAll('.item-cover, img').forEach((e) => e.remove());
    }
    rep.push('notes ' + notes.length + ' rec ' + !!rec);
  }

  if (site === 'x') {
    const cells = [...document.querySelectorAll('[data-testid="cellInnerDiv"]')];
    // 选一条和片子里那条帖子结构相同的：带「翻译自」、单张配图、不是视频、不是引用
    const first = cells.find((c) => c.querySelector('[data-testid="tweet"] [data-testid="tweetPhoto"]') && !c.querySelector('[data-testid="videoPlayer"], [data-testid="videoComponent"]') && /翻译自/.test(c.textContent) && c.querySelectorAll('[data-testid="tweetText"]').length === 1)
      || cells.find((c) => c.querySelector('[data-testid="tweet"] [data-testid="tweetPhoto"]') && !c.querySelector('[data-testid="videoPlayer"]'))
      || cells.find((c) => c.querySelector('[data-testid="tweet"]'));
    rep.push('picked cell ' + cells.indexOf(first) + ' of ' + cells.length);
    cells.forEach((c) => { if (c !== first) c.remove(); });
    const t = first.querySelector('[data-testid="tweet"]');
    img(t.querySelector('[data-testid="Tweet-User-Avatar"] [data-testid^="UserAvatar-Container"]'), 'avatar');
    const un = t.querySelector('[data-testid="User-Name"]');
    const spans = [...un.querySelectorAll('span')].filter((s) => s.children.length === 0 && s.textContent.trim());
    const name = spans[0], handle = spans.find((s) => /^@/.test(s.textContent));
    txt(name, 'name'); txt(handle, 'handle'); txt(un.querySelector('time'), 'date');
    const texts = [...t.querySelectorAll('[data-testid="tweetText"]')];
    txt(texts[0], 'text');
    texts.slice(1).forEach((e) => { (e.closest('div[role="link"]') || e).remove(); rep.push('extra tweetText removed'); });
    img(t.querySelector('[data-testid="tweetPhoto"]'), 'media');
    t.querySelectorAll('[data-testid="tweetPhoto"] ~ *').forEach(() => {});
    ['reply', 'retweet', 'like'].forEach((k) => { const b = t.querySelector(`[data-testid="${k}"]`); const s = b && [...b.querySelectorAll('span')].reverse().find((x) => x.children.length === 0 && x.textContent.trim()); if (s) txt(s, 'count-' + k); else rep.push('no count ' + k); });
    const views = t.querySelector('a[href$="/analytics"], [aria-label*="查看"]');
    const vs = views && [...views.querySelectorAll('span')].reverse().find((x) => x.children.length === 0 && x.textContent.trim());
    if (vs) txt(vs, 'count-views'); else rep.push('no views');
    const acct = document.querySelector('[data-testid="SideNav_AccountSwitcher_Button"] [data-testid^="UserAvatar-Container"]') || document.querySelector('[data-testid="AppTabBar_Profile_Link"] [data-testid^="UserAvatar-Container"]');
    img(acct, 'me-avatar');
    blankImgs(first);
    document.querySelectorAll('[data-testid="SideNav_AccountSwitcher_Button"] span').forEach((s) => { if (!s.children.length) s.textContent = ''; });
  }

  if (site === 'zhihu') {
    img(document.querySelector('.AppHeader-profileAvatar') || document.querySelector('.AppHeader-profile img'), 'me-avatar');
    const s = document.querySelector('.AppHeader input'); if (s) { s.setAttribute('data-slot-attr', 'search'); }
    txt(document.querySelector('.Post-Title'), 'title');
    const au = document.querySelector('.Post-Author');
    img(au.querySelector('.AuthorInfo-avatarWrapper img, .AuthorInfo-avatar'), 'author-avatar');
    txt(au.querySelector('.AuthorInfo-name .UserLink-link') || au.querySelector('.AuthorInfo-name'), 'author');
    txt(au.querySelector('.AuthorInfo-badgeText'), 'bio');
    const col = byText('.Post-Header *, .Post-Main *', /^收录于/); if (col) txt([...col.querySelectorAll('*')].filter((e) => !e.children.length && /收录于/.test(e.textContent))[0] || col, 'collect');
    const voters = byText('.Post-Header *, .Post-Main *, .Voters *, button, span', /人赞同了该文章/);
    const vleaf = voters && [voters, ...voters.querySelectorAll('*')].reverse().find((e) => /人赞同了该文章/.test(e.textContent) && ![...e.children].some((k) => /人赞同/.test(k.textContent)));
    txt(vleaf, 'voters');
    const rt = document.querySelector('.Post-RichText'); txt(rt, 'body');
    const side = document.querySelector('.AuthorCard');
    if (side) {
      img(side.querySelector('.AuthorCard-user-avatar'), 'side-avatar');
      txt(side.querySelector('.AuthorCard-user-name .UserLink-link') || side.querySelector('.AuthorCard-user-name'), 'side-name');
      txt(side.querySelector('.AuthorCard-user-headline'), 'side-bio');
      side.querySelectorAll('.NumberBoard-itemValue').forEach((e, i) => txt(e, `stat-${i}`));
    } else rep.push('no side card');
    document.querySelectorAll('.HotSearchCard-item').forEach((it, i) => { txt(it.querySelector('.HotSearchCard-itemText'), `hot-${i}`); txt(it.querySelector('.HotSearchCard-heat'), `heat-${i}`); });
    const vote = document.querySelector('.ContentItem-actions .VoteButton, .RichContent-actions .VoteButton, button.VoteButton');
    if (vote) { const leaf = [...vote.childNodes].reverse().find((n) => n.nodeType === 3 && n.textContent.trim()); if (leaf) { const sp = document.createElement('span'); sp.setAttribute('data-slot', 'upvote'); leaf.replaceWith(sp); } else rep.push('vote text?'); } else rep.push('no vote');
    // 正文下面的打赏、所属专栏、话题、推荐卡片：都带原作者的信息，去掉
    const up = (re, stop) => { let e = byText('.Post-Main *', re); while (e && !stop.test(e.textContent)) e = e.parentElement; return e; };
    for (const [re, stop] of [[/^\s*送礼物\s*$/, /还没有人送礼物/], [/所属专栏/, /订阅/]]) { const e = up(re, stop); if (e) { e.remove(); rep.push('removed ' + re); } }
    document.querySelectorAll('.Post-topicsAndReviewer, .pc-article-answer-card, .Post-Sub').forEach((n) => n.remove());
    { const ad = up(/的广告/, /查看详情/); if (ad) { ad.remove(); rep.push('ad removed'); } }
    { const d = [...document.querySelectorAll('.Post-Main *')].find((e) => !e.children.length && /^编辑于|^发布于/.test(e.textContent.trim())); txt(d, 'date'); }
    { const cb = document.querySelector('.CommentEditorV2, [class*="CommentEditor"], .Comments-container'); const av = cb && cb.closest('.Post-Main, body').querySelector('.Avatar, img.Avatar'); rep.push('comment avatar ' + !!av); }
    document.querySelectorAll('img').forEach((i) => { if (!i.closest('[data-slot]') && !/\.svg/.test(i.src)) { const r = i.getBoundingClientRect(); if (r.width >= 20 && r.width <= 48) img(i, 'me-avatar-2'); } });
  }
  // 去掉带用户信息的属性：埋点、标题、无障碍标签、alt、meta
  document.querySelectorAll('meta[itemprop], meta[name^="og"], meta[property]').forEach((m) => m.remove());
  for (const el of document.querySelectorAll('*')) for (const a of [...el.attributes]) {
    if (/^data-(za|zop|lazy|src|user|track|spm|mod|idx|ext|report|log|exp|aid|bvid|mid|uid|params|e2e|note|id$|index|impressionid|xsec)/.test(a.name) || ['title', 'aria-label', 'alt', 'aria-describedby', 'aria-labelledby'].includes(a.name)) el.removeAttribute(a.name);
  }
  document.title = { zhihu: '知乎', bili: '哔哩哔哩', xhs: '小红书', x: 'X' }[site];
  return rep;
}
