import React, { useEffect, useState } from 'react';
import { continueRender, delayRender } from 'remotion';
import { AbsoluteFill, IFrame, staticFile } from 'remotion';
import { VH, VW, Z } from './root';
import { A } from '../scenes/A';
import { Dd } from '../scenes/D';
import { Ee } from '../scenes/E';
import { LOCALES } from '../data/content';
import { ZhihuPage } from '../content/zhihu';
import { BiliSearch, XSearch, XhsSearch } from '../content/search';
import { ChatPanelHeader, ResourceHeader, ResourceView, SplitView, SearchDialog, AppFrame, ChatComposerBar, ChatHeader, ChatScroll, Composer, GroupLabel, HomeBody, HomeCards, HomeHeader, Main, Markdown, Row, Sidebar, SystemGroup, ThoughtFor, UserMsg, AnswerActions, ROW_PITCH, TREE_TOP } from './app';

// 校对用：同一个浏览器里并排渲染 omnibox-art 导出的原始 HTML（public/omni-ref）和 app.tsx 的组件，逐像素比
// npx remotion still OmniProbe --props='{"state":"home","reference":true}'

const TREE: [string, string, ('closed' | undefined)?][] = [
  ['📁', '工作'], ['📄', '欢迎使用小黑'], ['📁', '阅读', 'closed'], ['📁', '学习笔记'], ['📄', '👏 Hi，欢迎来到小黑 OmniBox'],
];

const Side: React.FC = () => (
  <Sidebar tab={0} space="我的空间" notify={6}>
    <GroupLabel top={308} text="个人" />
    {TREE.map(([ic, s, caret], i) => <Row key={s} top={TREE_TOP + i * ROW_PITCH} icon={ic} text={s} caret={caret} />)}
    <SystemGroup top={TREE_TOP + (TREE.length - 1) * ROW_PITCH + 34 + 8} />
  </Sidebar>
);

/** 调试：把 Shadow DOM 里某些元素的计算样式写在画面上 */
const Debug: React.FC<{ sels: string[] }> = ({ sels }) => {
  const [txt, setTxt] = useState('');
  const [h] = useState(() => delayRender('debug'));
  useEffect(() => {
    const id = setTimeout(() => {
      const hosts = [...document.querySelectorAll('div')].filter((d) => d.shadowRoot);
      const out: string[] = [];
      for (const host of hosts) for (const sel of sels) for (const n of host.shadowRoot!.querySelectorAll(sel)) {
        // 产品像素（相对 .omni-html，扣掉镜头缩放）
        const hr = host.shadowRoot!.querySelector('.omni-html')!.getBoundingClientRect(); const k = VW / hr.width;
        const r = n.getBoundingClientRect();
        const f = (v: number) => (v * k).toFixed(1);
        out.push(`${sel} «${(n.textContent || '').trim().slice(0, 8)}»: ${f(r.x - hr.x)}, ${f(r.y - hr.y)}  ${f(r.width)}×${f(r.height)}`);
      }
      // 第三方网页快照（iframe）：CSS 像素，相对 iframe；quote-lines = 知乎引文每一行的矩形
      for (const fr of document.querySelectorAll('iframe')) {
        const d = fr.contentDocument; if (!d) continue;
        for (const sel of sels) {
          if (sel === 'quote-lines') { const q = d.querySelector('[data-quote]'); if (q) [...q.getClientRects()].forEach((r, i) => out.push(`quote line ${i}: ${r.x.toFixed(1)}, ${r.y.toFixed(1)}  ${r.width.toFixed(1)}×${r.height.toFixed(1)}`)); continue; }
          d.querySelectorAll(sel).forEach((n) => { const r = n.getBoundingClientRect(); out.push(`[iframe] ${sel} «${(n.textContent || '').trim().slice(0, 8)}»: ${r.x.toFixed(1)}, ${r.y.toFixed(1)}  ${r.width.toFixed(1)}×${r.height.toFixed(1)}`); });
        }
      }
      setTxt(out.join('\n'));
      continueRender(h);
    }, 300);
    return () => clearTimeout(id);
  }, []);
  return <pre style={{ position: 'absolute', left: 10, top: 10, zIndex: 9999, background: '#ff0', color: '#000', fontSize: 18, whiteSpace: 'pre-wrap', width: 1880 }}>{txt}</pre>;
};

const SCENES: Record<string, React.FC<{ t: number }>> = {
  A, D: Dd, E: Ee,
  zhihu: () => <ZhihuPage c={LOCALES.zh} w={1500} h={788} />,
  'zhihu-en': () => <ZhihuPage c={LOCALES.en} w={1500} h={788} />,
  bili: () => <div style={{ transform: 'scale(2)', transformOrigin: '0 0' }}><BiliSearch c={LOCALES.zh} /></div>,
  xhs: () => <div style={{ transform: 'scale(2)', transformOrigin: '0 0' }}><XhsSearch c={LOCALES.zh} /></div>,
  x: () => <div style={{ transform: 'scale(2)', transformOrigin: '0 0' }}><XSearch c={LOCALES.zh} /></div>,
};

export const Probe: React.FC<{ state: string; reference?: boolean; debug?: string[]; t?: number }> = ({ state, reference: isRef, debug, t = 0 }) => {
  if (debug) {
    const S = SCENES[state];
    return <>{S ? <S t={t} /> : <Probe state={state} />}<Debug sels={debug} /></>;
  }
  if (isRef) {
    return (
      <AbsoluteFill style={{ background: '#fff' }}>
        <IFrame
          src={staticFile(`omni-ref/${state}.html`)}
          style={{ width: VW, height: VH, border: 0, zoom: Z } as React.CSSProperties}
          onLoad={(e) => {
            // 量真实 DOM 的几何（产品像素），打到渲染日志里
            const d = (e.target as HTMLIFrameElement).contentDocument!;
            const pick = (sel: string) => [...d.querySelectorAll(sel)].map((n) => { const r = n.getBoundingClientRect(); return [sel.slice(0, 40), (n.textContent || '').trim().slice(0, 12), Math.round(r.x * 100) / 100, Math.round(r.y * 100) / 100, Math.round(r.width * 100) / 100, Math.round(r.height * 100) / 100].join(' | '); });
            const sels = ['li[data-resource-depth]', '[data-sidebar=group-label]', '[data-sidebar=group] li', 'main', 'textarea', 'button[aria-label^="思考强度"]', 'button[aria-label="更多"]', '[data-chat-composer] button[disabled], main button[disabled]', 'button[aria-label="下一个推荐问题"]', 'main header button', '.markdown-body', '.markdown-body h2', '[data-chat-message-list] .bg-secondary', 'details', '.lucide-save', 'div[role=tablist]', '[data-sidebar=footer] button', '.rounded-xl.border'];
            console.log('GEOM ' + state + '\n' + sels.flatMap(pick).join('\n'));
          }}
        />
      </AbsoluteFill>
    );
  }
  if (state === 'resource-results') {
    return (
      <AppFrame side={<Side />} overlay={<SearchDialog query="欢迎" hits={[{ icon: '📄', title: '欢迎使用小黑', text: '欢迎使用小黑 OmniBox。 把常用的文件和文档保存下来，按主题放进文件夹。 需要时，可以搜索资源，也可以把资源添加到对话框，让小黑结合内容回答问题。' }, { icon: '📄', title: '👏 Hi，欢迎来到小黑 OmniBox', text: '**小黑 OmniBox —— 随时随地，万物变成记忆，记忆变成万物。** # 一、随时随地 通过浏览器插件、移动端 App、微信 / QQ 助手、RSS 和 Open API，随手保存网页、文件、图片、录音、视频与聊天消息，选择一个最...' }]} />}>
        <Main header={<HomeHeader />}>
          <HomeBody tip="帮我创建一个名为“阅读”的文件夹并整理文档" composer={<Composer />} cards={<HomeCards recent={[['📄', '欢迎使用小黑', '大约 4 小时前更新'], ['📄', '如何整理知识库', '大约 4 小时前创建'], ['📄', '👏 Hi，欢迎来到小黑 OmniBox', '1 天前创建']]} />} />
        </Main>
      </AppFrame>
    );
  }
  // 点引用之后：资源页 + 右侧对话面板（public/omni-ref/resource-split.html 是 2026-10-15 实拍，正文是图片 + 转圈，只比顶栏、标题、属性行、面板外框）
  if (state === 'resource-split') {
    return (
      <AppFrame
        side={<Side />}
        over={
          <SplitView
            split={1}
            header={<ResourceHeader crumbs={['ppt', '从医生角度解析高血压案例-终版.ppt']} updated="9 个月前更新" />}
            resource={<ResourceView title="从医生角度解析高血压案例-终版.ppt" tags={['健康', '心血管疾病', '高血压']} file="从医生角度解析高血压案例-终版.ppt" created="2025-11-28 17:33:48" blocks={[{ kind: 'p', text: '从医生角度解析高血压案例' }]} hl={0} />}
            panel={
              <>
                <ChatPanelHeader title="高血压案例要点及出处" />
                <ChatScroll><div className="space-y-4"><UserMsg text="我收藏的高血压案例里讲了哪些要点？请注明出处" /></div></ChatScroll>
                <ChatComposerBar><Composer ring /></ChatComposerBar>
              </>
            }
          />
        }
      >
        <Main header={<HomeHeader />} />
      </AppFrame>
    );
  }
  if (state === 'home') {
    return (
      <AppFrame side={<Side />}>
        <Main header={<HomeHeader />}>
          <HomeBody
            tip="帮我创建一个名为“阅读”的文件夹并整理文档"
            composer={<Composer />}
            cards={<HomeCards recent={[['📄', '欢迎使用小黑', '大约 4 小时前更新'], ['📄', '如何整理知识库', '大约 4 小时前创建'], ['📄', '👏 Hi，欢迎来到小黑 OmniBox', '1 天前创建']]} />}
          />
        </Main>
      </AppFrame>
    );
  }
  // chat-open
  return (
    <AppFrame side={<Side />}>
      <Main header={<ChatHeader title="如何整理知识库" />}>
        <ChatScroll>
          <div className="space-y-4">
            <UserMsg text="如何整理知识库" />
            <ThoughtFor sec={15} />
            <Markdown>
              <p>整理知识库可以从这几个层面入手：</p>
              <h2>1. 建立文件夹结构</h2>
              <ul>
                <li>在左侧资源列表的「个人」或「团队」区域菜单中<strong>创建文件夹</strong>，按项目/主题/来源搭建层级</li>
                <li>文件、文件夹都可以<strong>重命名</strong>（双击名称即可）和<strong>移动到</strong>其他位置</li>
              </ul>
              <AnswerActions />
            </Markdown>
          </div>
        </ChatScroll>
        <ChatComposerBar><Composer ring /></ChatComposerBar>
      </Main>
    </AppFrame>
  );
};
