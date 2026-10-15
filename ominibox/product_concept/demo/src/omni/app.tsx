import React from 'react';
import { staticFile } from 'remotion';
import { Ic, Omni } from './root';

// OmniBox 网页端（浅色）的真实 DOM：结构和 class 逐字取自 omnibox-art 导出的 HTML 状态
// （assets/product/omnibox-ui/*.html，test.omnibox.pro 2026-10-06~10）和 2026-10-15 ego-browser 实拍
// （思考强度弹层、引用角标与悬浮卡、工具调用、待确认卡片、保存提示）。
// 这里的尺寸都是产品像素（视口 1440×810），由 Omni 统一放大到 1920×1080。

// ---------- class（原样） ----------
const MENU_BTN =
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground';
const SPACE_BTN =
  'peer/menu-button flex items-center overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring transition-[width,height,padding] focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground text-sm h-auto w-full gap-1.5 px-1.5';
const TRIGGER =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-7 w-7 text-neutral-400 hover:bg-[#E6E6EC] hover:text-neutral-400 dark:hover:bg-accent';
const ROW_BTN_BASE =
  'peer/menu-button flex w-full items-center overflow-hidden rounded-md p-2 text-left outline-none ring-sidebar-ring focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 hover:text-sidebar-accent-foreground text-sm h-auto gap-1 py-1.5 transition-none bg-transparent group-has-[[data-sidebar=menu-action]]/menu-item:pr-1 data-[active=true]:font-normal data-[active=true]:bg-transparent dark:data-[active=true]:bg-transparent hover:bg-transparent group-hover/sidebar-item:!pr-[30px]';
const ROW_BTN = `${ROW_BTN_BASE} list flex cursor-pointer`;
const CHAT_ROW_BTN = `${ROW_BTN_BASE} flex cursor-pointer items-center pl-7`;
const ROW_ACTION =
  'absolute top-1.5 flex aspect-square items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0 after:absolute after:-inset-2 after:md:hidden peer-data-[size=sm]/menu-button:top-1 peer-data-[size=lg]/menu-button:top-2.5 group-data-[collapsible=icon]:hidden right-2 size-4 cursor-pointer !text-neutral-400 hover:bg-transparent hover:!text-sidebar-foreground focus-visible:outline-none focus-visible:ring-transparent peer-data-[size=default]/menu-button:top-2 pointer-events-none opacity-0 group-hover/sidebar-item:pointer-events-auto group-hover/sidebar-item:opacity-100 cursor-pointer focus-visible:outline-none focus-visible:ring-transparent';
const CARET_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input hover:text-accent-foreground size-5 border-none bg-transparent text-neutral-400 shadow-none hover:bg-transparent';
const TOOL_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 size-[18px] rounded-sm text-[#8F959E] hover:text-[#8F959E] hover:bg-[rgba(23,23,23,0.1)] active:text-[#8F959E] active:bg-[rgba(23,23,23,0.15)] disabled:cursor-not-allowed disabled:text-neutral-300 disabled:bg-transparent dark:text-neutral-300 dark:hover:text-neutral-400 dark:hover:bg-[rgba(255,255,255,0.1)] dark:active:text-[#fafafa] dark:active:bg-[rgba(255,255,255,0.2)] disabled:opacity-100 disabled:pointer-events-none disabled:hover:bg-transparent dark:disabled:bg-transparent dark:disabled:text-neutral-700 dark:disabled:hover:bg-transparent';
const TAB_BTN =
  'inline-flex items-center justify-center whitespace-nowrap px-3 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 relative h-7.5 rounded-full py-0 text-sm font-medium leading-none text-sidebar-tab-foreground shadow-none transition-colors data-[state=active]:bg-transparent data-[state=active]:text-sidebar-tab-active-foreground data-[state=active]:shadow-none';
const FOOT_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 rounded-md text-xs size-8 px-0 hover:bg-[#E8E8EE] hover:text-neutral-400 dark:hover:bg-accent [&_svg]:size-5';
const GHOST =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground';
const CARD_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border hover:text-accent-foreground h-8 rounded-md px-3 text-xs shadow-none bg-white border-neutral-200 hover:bg-neutral-100 active:border-neutral-300 dark:bg-transparent dark:!border-neutral-700 dark:hover:bg-neutral-600 active:bg-neutral-200 dark:active:bg-neutral-700 disabled:opacity-100 disabled:bg-neutral-400 disabled:text-neutral-200 disabled:border-neutral-400 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500 dark:disabled:border-neutral-700 dark:disabled:hover:bg-neutral-700 w-24';
const SEND_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow-none dark:bg-white dark:text-primary-foreground hover:bg-neutral-800 active:bg-neutral-700 dark:active:bg-neutral-300 dark:hover:bg-neutral-100 disabled:opacity-100 disabled:bg-neutral-400 disabled:text-neutral-200 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500 dark:disabled:hover:bg-neutral-700 rounded-full size-8';
const TEXT_LAYER =
  'pointer-events-none absolute inset-0 z-0 overflow-hidden box-border p-0 whitespace-pre-wrap break-words text-base leading-7 tracking-normal [padding-inline-end:0.25em] [font-family:inherit] [font-weight:inherit] [font-kerning:normal] [font-feature-settings:inherit] [font-variation-settings:inherit] [word-break:normal] [overflow-wrap:break-word] md:text-sm';
const TEXTAREA =
  'relative z-10 block min-h-[60px] max-h-[200px] w-full resize-none overflow-y-hidden border-0 bg-transparent text-transparent outline-none box-border p-0 whitespace-pre-wrap break-words text-base leading-7 tracking-normal [padding-inline-end:0.25em] [font-family:inherit] [font-weight:inherit] [font-kerning:normal] [font-feature-settings:inherit] [font-variation-settings:inherit] [word-break:normal] [overflow-wrap:break-word] md:text-sm caret-foreground placeholder:text-[#9CA3AF] selection:bg-[#117bfa]/20 selection:text-transparent dark:placeholder:text-gray-400';
const CODE = 'bg-muted text-muted-foreground border border-border px-1.5 py-0.5 rounded text-xs font-mono';
const ACCORDION_BTN =
  'flex flex-1 items-center justify-between py-4 text-sm font-medium transition-all hover:underline text-left [&[data-state=open]>svg]:rotate-180';
const SELECT =
  'flex w-full items-center justify-between whitespace-nowrap border py-2 ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 h-8 rounded-md border-line bg-transparent px-3 text-sm shadow-none hover:bg-transparent focus:ring-0 focus:ring-transparent focus:outline-none dark:bg-transparent dark:hover:bg-transparent';

const hov = (on?: boolean) => (on ? { 'data-demo-hover': '' } : {});

// ---------- 版式常量（产品像素，按 omnibox-art qa/dom-geometry.json 的 home 状态） ----------
export const SIDE = 248; // --sidebar-width
export const TREE_TOP = 340; // 「个人」下第一行 li 的 top
export const ROW_PITCH = 36; // li 34 + gap-0.5
export const ROW_LI = { x: 8, w: 240, h: 34 };
export const LABEL_TOP = 308; // 「个人」分组标题按钮

// ---------- 资源图标：按资源类型取真实图标 ----------
export const ResIc: React.FC<{ icon: string; name?: string }> = ({ icon, name = '' }) => {
  switch (icon) {
    case '📁': return <Ic n="folder" />;
    case '📕': return <Ic n="res-pdf" />;
    case '🖼': return <Ic n="res-image" />;
    case '🎙': return <Ic n="res-audio" />;
    case '🎬': return <Ic n="res-video" />;
    case '🌐': return /知乎|Zhihu/.test(name) ? <Ic n="res-zhihu" /> : <Ic n="res-link" />;
    case '💬': return <Ic n="message-circle" className="size-4 shrink-0" />;
    default: return <Ic n="file-text" className="scale-110" />;
  }
};

// ---------- 外壳 ----------
/** 整个网页：侧栏 + 主区。open = 侧栏展开比例（0 收起，1 展开），收起时主区顶栏出现展开按钮 */
export const AppFrame: React.FC<{ side: React.ReactNode; open?: number; children: React.ReactNode; overlay?: React.ReactNode; over?: React.ReactNode; style?: React.CSSProperties }> = ({
  side, open = 1, children, overlay, over, style,
}) => (
  <Omni style={style}>
    <div className="flex h-full min-h-0 w-full flex-col overflow-hidden">
      <div className="group/sidebar-wrapper flex h-full overflow-hidden w-full has-[[data-variant=inset]]:bg-sidebar min-h-0 max-h-full" style={{ '--sidebar-width': `${SIDE}px`, '--sidebar-width-icon': '3rem' } as React.CSSProperties} data-ui-shell="">
        <div className="group peer hidden md:block text-sidebar-foreground" data-state="expanded" data-collapsible="" data-variant="sidebar" data-side="left">
          <div className="duration-200 relative h-svh w-[--sidebar-width] bg-transparent transition-[width] ease-linear group-data-[collapsible=offcanvas]:w-0 group-data-[side=right]:rotate-180 group-data-[collapsible=icon]:w-[--sidebar-width-icon]" style={{ width: SIDE * open }} />
          <div className="duration-200 fixed inset-y-0 z-10 hidden h-svh w-[--sidebar-width] transition-[left,right,width] ease-linear md:flex left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)] group-data-[collapsible=icon]:w-[--sidebar-width-icon] group-data-[side=left]:border-r group-data-[side=right]:border-l border-none" style={{ left: -SIDE * (1 - open) }}>
            {side}
          </div>
        </div>
        <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="flex h-full min-h-0 min-w-0 overflow-hidden flex-1">{children}</div>
          {over}
        </div>
      </div>
    </div>
    {overlay}
  </Omni>
);

/** 主区圆角面板 + 顶栏 */
export const Main: React.FC<{ header: React.ReactNode; children?: React.ReactNode }> = ({ header, children }) => (
  <main className="relative flex flex-1 flex-col peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow min-h-0 !min-h-0 max-h-full min-w-0 h-full overflow-hidden bg-white dark:bg-background md:rounded-2xl m-0 rounded-none md:m-[8px] md:h-[calc(100svh-16px)]">
    <header className="rounded-2xl sticky z-[30] top-0 bg-white flex flex-wrap min-h-12 shrink-0 items-center gap-2 dark:bg-background">{header}</header>
    {children}
  </main>
);

const Trigger: React.FC = () => (
  <button className={TRIGGER} data-sidebar="trigger" data-state="closed">
    <Ic n="panel-left" />
    <span className="sr-only">Toggle Sidebar</span>
  </button>
);

/** 首页顶栏：左侧（侧栏收起时）展开按钮，右侧历史 */
export const HomeHeader: React.FC<{ collapsed?: boolean }> = ({ collapsed }) => (
  <>
    <div className="flex min-w-0 flex-1 items-center gap-1 px-3 sm:gap-2">{collapsed && <Trigger />}</div>
    <div className="ml-auto shrink-0 pr-3">
      <div className="flex items-center gap-1 text-sm">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs size-[28px] text-[#585D65] dark:text-white" data-state="closed">
          <Ic n="history" />
        </button>
      </div>
    </div>
  </>
);

/** 对话页顶栏：标题 + 分享 / 新对话 / 更多。shareGlow：E → F 转场前分享按钮的高亮 */
export const ChatHeader: React.FC<{ title: string; collapsed?: boolean; shareGlow?: number; titleO?: number }> = ({ title, collapsed, shareGlow = 0, titleO = 1 }) => (
  <>
    <div className="flex min-w-0 flex-1 items-center gap-1 px-3 sm:gap-2">
      {collapsed && <Trigger />}
      <nav aria-label="breadcrumb" className="min-w-0" style={{ opacity: titleO }}>
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
          <li className="inline-flex items-center gap-1.5 min-w-0">
            <span role="link" className="font-normal text-foreground line-clamp-1">
              <div className="flex items-center gap-0 group">
                <span className="max-w-[400px] line-clamp-1">{title}</span>
              </div>
            </span>
          </li>
        </ol>
      </nav>
    </div>
    <div className="ml-auto shrink-0 pr-3">
      <div className="flex items-center gap-1 text-sm">
        <button className={`${GHOST} size-7`} aria-label="分享" data-state="closed" {...hov(shareGlow > 0)} style={shareGlow > 0 ? { boxShadow: `0 0 0 ${2 * shareGlow}px #3098ff, 0 0 ${18 * shareGlow}px #3098ff` } : undefined}>
          <Ic n="share16" />
        </button>
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs size-[28px]" data-state="closed">
          <Ic n="message-circle-plus" />
        </button>
        <button className={`${GHOST} size-7 data-[state=open]:bg-accent`} data-state="closed">
          <Ic n="ellipsis" className="size-4" />
        </button>
      </div>
    </div>
  </>
);

// ---------- 侧栏 ----------
const NavItem: React.FC<{ children: React.ReactNode; active?: boolean; extra?: string }> = ({ children, active, extra = 'h-8 text-sm flex cursor-pointer items-center gap-2' }) => (
  <li data-sidebar="menu-item" className="group/menu-item relative">
    <div className={`${MENU_BTN} ${extra}`} data-sidebar="menu-button" data-size="default" data-active={active ? 'true' : 'false'}>{children}</div>
  </li>
);

/**
 * 侧栏。tab：资源 0 → 对话 1（胶囊滑块和工具栏跟着走）。
 * children 是资源树 / 对话列表这一层：绝对定位在侧栏坐标里（Row / ChatRow / GroupLabel 自带 top），
 * 场景可以逐行做动画；分组标题和行的 class 都是真实的。home：「小黑」是否高亮（在首页时高亮，进了对话不高亮）
 */
export const Sidebar: React.FC<{ tab: number; space: string; children?: React.ReactNode; notify?: number; home?: boolean }> = ({ tab, space, children, notify = 3, home = true }) => (
  <div data-sidebar="sidebar" className="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow">
    <div data-sidebar="header" className="flex flex-col p-2 gap-2.5 pr-0 pt-4">
      <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1">
        <li data-sidebar="menu-item" className="group/menu-item relative flex items-center justify-between">
          <button data-sidebar="menu-button" data-size="default" data-active="false" className={SPACE_BTN} data-state="closed">
            <div className="flex size-6 flex-shrink-0 items-center justify-center rounded-lg bg-primary text-xs text-primary-foreground dark:bg-neutral-700 dark:text-white">{Array.from(space)[0].toUpperCase()}</div>
            <span className="truncate">{space}</span>
            <Ic n="chevron-down" className="opacity-50" />
          </button>
          <Trigger />
        </li>
      </ul>
      <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1 mb-4">
        <li data-sidebar="menu-item" className="group/menu-item relative group/chat">
          <div className={`${MENU_BTN} text-sm h-auto py-1.5 pr-1 flex cursor-pointer items-center gap-2`} data-sidebar="menu-button" data-size="default" data-active={home ? 'true' : 'false'}>
            <img src={staticFile('omni/nav-logo.svg')} alt="OmniBox Logo" className="size-4" />
            <span className="font-normal">小黑</span>
          </div>
        </li>
        <NavItem>
          <Ic n="bell-dot" className="size-4 text-neutral-400" />
          <span>通知</span>
          {notify > 0 && <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-medium leading-none text-white">{notify}</span>}
        </NavItem>
        <NavItem extra="h-8 text-sm flex items-center gap-2 !text-sidebar-foreground hover:!text-sidebar-accent-foreground">
          <Ic n="users" className="size-4 text-neutral-400" />
          <span>黑友社区</span>
        </NavItem>
        <NavItem>
          <Ic n="gift" className="size-4 text-blue-500" />
          <span className="font-normal">邀请有礼</span>
        </NavItem>
      </ul>
    </div>
    <div data-orientation="horizontal" className="flex min-h-0 flex-1 flex-col">
      <div className="sticky top-0 z-10 shrink-0 bg-sidebar">
        <div role="tablist" className="items-center justify-center relative mx-auto mb-3 mt-2 grid h-7.5 w-sidebar-tabs shrink-0 grid-cols-2 rounded-full bg-sidebar-tab p-0 text-sidebar-tab-foreground" aria-label="资源 / 对话" data-orientation="horizontal">
          <div className="pointer-events-none absolute inset-0 rounded-full border border-sidebar-tab-border" />
          <span className="pointer-events-none absolute inset-y-0 w-sidebar-tab rounded-full bg-sidebar-tab-active shadow-sidebar-tab transition-[left] duration-200 ease-out motion-reduce:transition-none" style={{ left: `${tab * 50}%` }} />
          <button role="tab" data-state={tab < 0.5 ? 'active' : 'inactive'} className={`${TAB_BTN} pl-sidebar-tab-label-inset pr-0`} data-orientation="horizontal">资源</button>
          <button role="tab" data-state={tab >= 0.5 ? 'active' : 'inactive'} className={`${TAB_BTN} pl-0 pr-sidebar-tab-label-inset`} data-orientation="horizontal">对话</button>
        </div>
      </div>
      <div className="relative min-h-5">
        <div className="flex items-center justify-end pl-4 pr-1 min-h-5" style={{ opacity: 1 - tab, position: 'absolute', inset: 0 }}>
          <div className="flex items-center gap-2">
            <span className="inline-flex" data-state="closed"><button className={TOOL_BTN} aria-label="搜索资源"><Ic n="search" className="size-4" /></button></span>
            <span className="inline-flex cursor-not-allowed" data-state="closed"><button className={TOOL_BTN} aria-label="定位" disabled><Ic n="crosshair" className="size-4" /></button></span>
            <span className="inline-flex" data-state="closed"><button className={TOOL_BTN} aria-label="刷新"><Ic n="rotate-cw" className="size-4" /></button></span>
            <span className="inline-flex" data-state="closed"><button className={TOOL_BTN} aria-label="多选"><Ic n="list-check" className="size-4" /></button></span>
          </div>
        </div>
        <div className="flex min-h-5 items-center justify-end pl-4 pr-1" style={{ opacity: tab, position: 'absolute', inset: 0 }}>
          <div className="flex items-center gap-2">
            <span className="inline-flex" data-state="closed"><button className={TOOL_BTN} aria-label="搜索聊天历史"><Ic n="search" className="size-4" /></button></span>
            <span className="inline-flex" data-state="closed"><button className={TOOL_BTN} aria-label="新建对话"><Ic n="message-circle-plus" className="size-4" /></button></span>
          </div>
        </div>
      </div>
      <div className="relative flex min-h-0 flex-1 flex-col bg-sidebar md:-mr-2" />
    </div>
    <div data-sidebar="footer" className="flex p-2 flex-row flex-wrap items-center justify-around gap-6 px-6 pb-2">
      <a className="!text-neutral-400" data-state="closed"><button className={FOOT_BTN}><Ic n="circle-question-mark" /></button></a>
      <a className="!text-neutral-400" data-state="closed"><button className={FOOT_BTN}><Ic n="discord" /></button></a>
      <button className={`${FOOT_BTN} text-neutral-400 [&_svg]:scale-[1.3]`} data-state="closed"><Ic n="wechat" /></button>
      <a className="!text-neutral-400" data-state="closed"><button className={FOOT_BTN}><Ic n="upgrade" /></button></a>
    </div>
    {/* 资源树 / 对话列表层：侧栏坐标 */}
    <div className="text-sm" style={{ position: 'absolute', left: 0, top: 0, width: SIDE, height: '100%', overflow: 'hidden', pointerEvents: 'none' }}>{children}</div>
  </div>
);

/** 分组标题（「个人」「系统」或对话里的日期）；top = 产品像素 */
export const GroupLabel: React.FC<{ top: number; text: string; o?: number; chevron?: boolean }> = ({ top, text, o = 1, chevron = true }) => (
  <div style={{ position: 'absolute', left: 8, width: 240, top, opacity: o }}>
    <button data-sidebar="menu-button" data-size="default" data-active="false" className={`${MENU_BTN} text-sm group/sidebar-header h-8 pb-px pt-0`} data-state="closed">
      <div className="relative size-full">
        <div data-sidebar="group-label" className="duration-200 shrink-0 rounded-md px-2 text-xs outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 mr-4 flex h-full items-center gap-1 font-normal leading-8 text-neutral-400">
          {text}
          {chevron && <Ic n="chevron-right" className="!size-3 shrink-0 dark:text-neutral-500 text-neutral-300 transition-transform rotate-90" />}
        </div>
      </div>
    </button>
  </div>
);

/** 「系统」分组 + 回收站；top = 分组外框（p-2）的 top */
export const SystemGroup: React.FC<{ top: number; o?: number }> = ({ top, o = 1 }) => (
  <div data-sidebar="group" className="relative flex w-full min-w-0 flex-col p-2" style={{ position: 'absolute', left: 0, width: 248, top, opacity: o }}>
    <div data-sidebar="group-label" className="duration-200 flex shrink-0 items-center rounded-md px-2 text-xs outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0 group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 h-8 cursor-pointer select-none gap-1 pl-4 font-normal leading-8 text-neutral-400">
      系统
      <Ic n="chevron-right" className="!size-3 shrink-0 text-neutral-300 transition-transform dark:text-neutral-500 rotate-90" />
    </div>
    <div data-sidebar="group-content" className="w-full text-sm">
      <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-1">
        <li data-sidebar="menu-item" className="group/menu-item relative">
          <button data-sidebar="menu-button" data-size="default" data-active="false" className={`${MENU_BTN} h-8 text-sm`} data-state="closed">
            <Ic n="trash" className="size-4 text-neutral-400" />
            <span>回收站</span>
          </button>
        </li>
      </ul>
    </div>
  </div>
);

/** 对话列表的日期标题（「今天」「过去7天」） */
export const DateLabel: React.FC<{ top: number; text: string; o?: number }> = ({ top, text, o = 1 }) => (
  <div className="flex h-8 items-center px-4" style={{ position: 'absolute', left: 8, width: 240, top, opacity: o }}>
    <p className="text-xs font-normal leading-8 text-neutral-400">{text}</p>
  </div>
);

/**
 * 资源行（真实 li 结构）。top 产品像素；depth 缩进（每级 20）；caret = 文件夹展开箭头（'closed' / 'open'）；
 * hover = 悬停态（底色 + 「…」）；o / dx / s 给场景做进出动画
 */
export const Row: React.FC<{
  top: number; text: string; icon?: string; depth?: number; caret?: 'closed' | 'open'; hover?: boolean; o?: number; dx?: number; s?: number;
}> = ({ top, text, icon = '📄', depth = 0, caret, hover, o = 1, dx = 0, s = 1 }) => (
  <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-0.5" style={{ position: 'absolute', left: ROW_LI.x, width: ROW_LI.w, top, opacity: o, transform: `translateX(${dx}px) scale(${s})`, transformOrigin: 'left center' }}>
    <li data-sidebar="menu-item" className="group/menu-item relative" data-resource-depth={depth}>
      <div data-state={caret === 'open' ? 'open' : 'closed'} className="group/collapsible [&[data-state=open]>span>div>div>button>svg:first-child]:rotate-90">
        <span data-state="closed">
          <div className="group/sidebar-item relative my-px rounded-md hover:bg-sidebar-accent flex items-center" {...hov(hover)}>
            <div className={ROW_BTN} data-sidebar="menu-button" data-size="default" data-active="false" data-state="closed" style={{ opacity: 1, paddingLeft: (caret ? 4 : 28) + 20 * depth }}>
              {caret && <button className={CARET_BTN}><Ic n="caret" className="transition-transform" /></button>}
              <span className="size-4 shrink-0 [&_svg]:size-4 [&_img]:size-4"><ResIc icon={icon} name={text} /></span>
              <span className="flex-1 truncate">{text}</span>
            </div>
            <Ic n="ellipsis" className={ROW_ACTION} />
          </div>
        </span>
      </div>
    </li>
  </ul>
);

/** 对话历史行 */
export const ChatRow: React.FC<{ top: number; text: string; hover?: boolean; active?: boolean; o?: number; dx?: number }> = ({ top, text, hover, active, o = 1, dx = 0 }) => (
  <ul data-sidebar="menu" className="flex w-full min-w-0 flex-col gap-0.5" style={{ position: 'absolute', left: ROW_LI.x, width: ROW_LI.w, top, opacity: o, transform: `translateX(${dx}px)` }}>
    <li data-sidebar="menu-item" className="group/menu-item relative group/sidebar-item">
      <div className={`group/sidebar-item relative my-px rounded-md hover:bg-sidebar-accent flex items-center${active ? ' bg-sidebar-accent' : ''}`} {...hov(hover)}>
        <div className={CHAT_ROW_BTN} data-sidebar="menu-button" data-size="default" data-active={active ? 'true' : 'false'}>
          <span className="flex-1 truncate text-sm font-normal leading-5">{text}</span>
        </div>
        <Ic n="ellipsis" className={ROW_ACTION} />
      </div>
    </li>
  </ul>
);

// ---------- 输入框 ----------
export const LEVELS = ['轻', '中', '高', '最大'] as const;
/** 思考强度弹层（Agent 2.1 按钮上方，右对齐）。value 0–6，3 = 轻（默认） */
export const ThinkPopover: React.FC<{ value: number; o?: number; s?: number }> = ({ value, o = 1, s = 1 }) => {
  const v = Math.round(value);
  const label = LEVELS[Math.max(0, Math.min(3, v - 3))];
  const f = value / 6;
  return (
    <div style={{ position: 'absolute', right: 0, bottom: 'calc(100% + 8px)', zIndex: 50, opacity: o, transform: `scale(${0.95 + 0.05 * s})`, transformOrigin: '100% 100%' }}>
      <div data-side="top" data-align="end" data-state="open" role="dialog" className="z-50 border p-4 text-popover-foreground outline-none w-[240px] max-w-[calc(100vw-32px)] rounded-2xl border-black/10 bg-popover px-3 pb-3 pt-2 shadow-xl dark:border-white/10">
        <div className="relative mb-3 px-6 text-center">
          <button aria-label="模型类型" className="rounded-xl px-1 py-1 hover:bg-accent">
            <span className="flex items-center justify-center gap-1 text-base font-medium text-[#3098ff]">
              Agent 2.1 {label}
              <Ic n="chevron-right" className="size-4" />
            </span>
            <span className="mt-0.5 block text-xs text-muted-foreground">默认</span>
          </button>
          <span className="absolute right-0 top-1" data-state="closed">
            <button aria-label="恢复默认" className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-muted-foreground data-[state=open]:bg-accent">
              <Ic n="rotate-ccw" className="size-4" />
            </button>
          </span>
        </div>
        <div className="thinking-slider relative mx-1 h-6 rounded-full bg-black/10 dark:bg-white/10">
          <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-full">
            <div className="h-full bg-[#3098ff]" style={{ width: `calc(${f * 100}% + ${12 * (1 - 2 * f)}px)` }} />
          </div>
          <div className="pointer-events-none absolute inset-x-3 inset-y-0 flex items-center justify-between">
            {Array.from({ length: 7 }).map((_, i) => <span key={i} className="size-1 rounded-full bg-foreground/30" />)}
          </div>
          {/* 原生滑块的拇指：按 ::-webkit-slider-thumb 的样式画在连续位置上（值在动画里是连续的） */}
          <span style={{ position: 'absolute', top: 0, left: `calc(${f * 100}% - ${24 * f}px)`, width: 24, height: 24, borderRadius: '50%', background: 'rgb(255, 255, 255)', boxShadow: 'rgba(0, 0, 0, 0.133) 0px 1px 4px' }} />
        </div>
      </div>
    </div>
  );
};

/**
 * 输入框（首页与对话页同一个组件）。text 写在镜像层（真实产品的 textarea 文字透明、由镜像层显示）。
 * level：Agent 2.1 后面的档位；think：弹层（undefined 不显示）；ring：对话页的上下文用量环；
 * ph：显示占位文字；ready：发送按钮可点（A 段的文字是场景自己画的，输入框里没有 text）
 */
export const Composer: React.FC<{
  text?: string; caret?: boolean; level?: string; think?: { value: number; o: number; s?: number }; ring?: boolean; agentHover?: boolean; sendHover?: boolean; ph?: boolean; ready?: boolean;
}> = ({ text = '', caret, level = '轻', think, ring, agentHover, sendHover, ph = true, ready }) => (
  <div className="max-w-[766px] w-full mx-auto rounded-2xl p-3 border border-solid border-gray-200 bg-chat-composer dark:bg-chat-composer-dark dark:border-chat-composer-dark">
    <div className="mb-[2px] min-h-[60px] min-w-0">
      <div className="relative min-h-[60px] min-w-0">
        <div className={`${TEXT_LAYER} text-foreground`} style={{ right: 0, zIndex: 11 }}>
          {text}
          {caret && <span style={{ display: 'inline-block', width: 1.5, height: 20, marginLeft: 1, verticalAlign: 'text-bottom', background: 'currentColor' }} />}
        </div>
        <textarea placeholder={text || !ph ? '' : '随便问点什么吧'} className={TEXTAREA} style={{ height: 60, overflowY: 'hidden' }} readOnly value="" />
      </div>
    </div>
    <div className="flex items-center justify-between">
      <fieldset className="flex min-w-0 items-center gap-2">
        <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 size-8 rounded-full text-muted-foreground hover:bg-accent hover:text-muted-foreground data-[state=open]:bg-accent" aria-label="更多" data-state="closed">
          <Ic n="plus" />
        </button>
        <button className="inline-flex h-8 shrink-0 items-center gap-2 rounded-full px-2 text-xs font-normal md:pl-2 md:pr-1 text-muted-foreground hover:bg-accent hover:text-muted-foreground data-[state=open]:bg-accent" data-state="closed">
          <Ic n="hand" className="size-4" />
          <span className="hidden md:block">手动确认</span>
          <Ic n="chevron-down" className="size-4" />
        </button>
      </fieldset>
      <div className="flex items-center gap-2">
        {ring && (
          <span role="img" className="flex size-8 cursor-help items-center justify-center text-muted-foreground" data-state="closed">
            <Ic n="ring" />
          </span>
        )}
        <span style={{ position: 'relative', display: 'inline-flex' }}>
          <button aria-label={`思考强度: Agent 2.1 ${level}`} className="flex h-8 items-center rounded-full px-2 text-xs text-muted-foreground hover:bg-accent hover:text-muted-foreground data-[state=open]:bg-accent" data-state={think && think.o > 0.5 ? 'open' : 'closed'} {...hov(agentHover)}>Agent 2.1 {level}</button>
          {think && think.o > 0 && <ThinkPopover value={think.value} o={think.o} s={think.s ?? 1} />}
        </span>
        <div className="flex items-center">
          <span className={text || ready ? undefined : 'cursor-not-allowed'} data-state="closed">
            <button className={SEND_BTN} disabled={!(text || ready)} {...hov(sendHover)}>
              <Ic n="arrow-up" />
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
);

/** 对话页底部：输入框 + 免责声明 */
export const ChatComposerBar: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative z-20 flex min-h-0 max-h-full min-w-0 shrink-0 justify-center bg-white px-4 dark:bg-background" data-chat-composer="true">
    <div className="min-w-0 w-full max-w-3xl">
      {children}
      <div data-chat-disclaimer="true" className="truncate pt-2 text-center text-xs text-muted-foreground">内容由小黑 AI 生成，仅供参考</div>
    </div>
  </div>
);

/** 待确认的工具调用（真实产品把它放在输入框的位置） */
export const ApprovalCard: React.FC<{ title: string; args: string[]; press?: number }> = ({ title, args, press = 0 }) => (
  <div className="text-card-foreground max-w-[766px] w-full mx-auto rounded-2xl border border-solid border-gray-200 bg-white dark:bg-[#303030] dark:border-[#303030] shadow-none">
    <div className="flex flex-col space-y-1.5 p-3">
      <div className="font-semibold leading-none tracking-tight flex items-center gap-2">
        <div className="flex min-w-0 flex-1 items-center gap-2">
          <div className="truncate text-base">{title}</div>
        </div>
      </div>
      <div className="text-muted-foreground text-xs flex flex-wrap gap-x-2 gap-y-1">
        {args.map((a) => <code key={a} className={CODE}>{a}</code>)}
      </div>
    </div>
    <div className="p-6 space-y-2 px-3 pt-0 pb-3">
      <button className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input h-8 rounded-md px-3 w-full justify-start text-sm font-normal focus-visible:ring-0 shadow-none bg-green-50 dark:bg-green-950/25 hover:bg-green-50 dark:hover:bg-green-950/25 dark:!border-neutral-500 text-green-700 dark:text-green-300 hover:text-green-700 dark:hover:text-green-300" style={{ transform: `scale(${1 - 0.03 * press})` }}>
        <Ic n="check" className="size-4 mr-2" />
        <span>同意</span>
      </button>
      <button className="inline-flex items-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border h-8 rounded-md px-3 w-full justify-start text-sm font-normal focus-visible:ring-0 shadow-none bg-red-50 dark:bg-red-950/25 hover:bg-red-50 dark:hover:bg-red-950/25 border-red-50 dark:!border-red-900/50 text-red-700 dark:text-red-300 hover:text-red-700 dark:hover:text-red-300">
        <Ic n="x" className="size-4 mr-2" />
        <span>拒绝</span>
      </button>
    </div>
  </div>
);

// ---------- 首页 ----------
export type Recent = [string, string, string]; // [图标, 名字, 时间]
export const HomeCards: React.FC<{ recent: Recent[]; o?: number; dy?: number }> = ({ recent, o = 1, dy = 0 }) => (
  <div className="grid grid-cols-1 gap-4 pb-4 md:grid-cols-2" style={{ opacity: o, transform: `translateY(${dy}px)` }}>
    <div className="rounded-xl border bg-card text-card-foreground shadow-none dark:border-none dark:bg-[#303030]">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="tracking-tight text-lg font-medium">上传文档</div>
        <div className="text-base font-medium text-foreground">让知识为你所用</div>
        <div className="text-sm text-muted-foreground">支持文档、网页、音频和视频等多种类型</div>
      </div>
      <div className="p-6 pt-0 flex items-center justify-between">
        <div className="flex flex-wrap gap-2">
          <button className={CARD_BTN} data-state="closed"><Ic n="file-up" className="size-4 text-red-500" />本地上传</button>
          <button className={CARD_BTN} data-state="closed"><Ic n="message-circle" className="size-4 text-green-500" />微信助手</button>
          <button className={CARD_BTN} data-state="closed"><Ic n="puzzle" />安装插件</button>
        </div>
      </div>
    </div>
    <div className="rounded-xl border text-card-foreground border-gray-200 bg-white shadow-none dark:border-none dark:bg-[#303030]">
      <div className="flex flex-col space-y-1.5 p-6 pb-4">
        <div className="tracking-tight text-lg font-medium">最近更新</div>
      </div>
      <div className="p-6 pt-0">
        <div className="no-scrollbar max-h-28 space-y-1 overflow-y-auto pr-1">
          {recent.map(([icon, name, time]) => (
            <div key={name} className="group flex cursor-pointer items-center justify-between rounded-lg p-2 transition-colors hover:bg-accent/50">
              <div className="flex min-w-0 items-center gap-2">
                <div className="[&>svg]:size-4"><ResIc icon={icon} name={name} /></div>
                <div className="min-w-0">
                  <div className="truncate text-sm group-hover:text-foreground">{name}</div>
                  <div className="truncate text-xs text-muted-foreground">{time}</div>
                </div>
              </div>
              <Ic n="chevron-right" className="size-4 text-muted-foreground transition-colors group-hover:text-foreground" />
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

/**
 * 首页主体：小黑 + 推荐问题气泡 + 输入框（垂直居中），下面两张卡片。
 * cat：替换小黑（A 段用会眨眼、会跳的小黑时传 null 并自己画）；chip：推荐问题气泡的出现比例
 */
export const HomeBody: React.FC<{ composer: React.ReactNode; cards: React.ReactNode; tip: string; chip?: number; cat?: React.ReactNode | null; topO?: number }> = ({
  composer, cards, tip, chip = 1, cat, topO = 1,
}) => (
  <div className="flex min-h-0 max-h-full min-w-0 flex-1 flex-col overflow-hidden">
    <div className="flex justify-center flex-1 p-4 overflow-auto">
      <div className="flex flex-col h-full max-w-3xl w-full">
        <div className="flex flex-col justify-center flex-1 mb-8">
          <div className="flex items-end pt-8 min-h-44 gap-8 pl-4 sm:pl-[50px]" style={{ opacity: topO }}>
            <button aria-label="下一个推荐问题" className="shrink-0 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-default -mb-[26px]">
              {cat === undefined ? <Ic n="xiaohei" /> : <div style={{ width: 92, height: 98 }}>{cat}</div>}
            </button>
            <div className="min-w-0 flex-1">
              <button className="group relative mb-4 flex min-h-12 w-fit min-w-recommended-question max-w-recommended-question items-center rounded-full text-left text-sm font-normal leading-recommended-question text-muted-foreground transition-opacity duration-150 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring pl-8 pr-4 py-3" style={{ transform: `scale(${chip})`, transformOrigin: 'left bottom', opacity: Math.min(1, chip * 1.5) }}>
                <Ic n="bubble" />
                <span className="relative z-[1] line-clamp-3 break-all transition-opacity duration-150 motion-reduce:transition-none group-hover:opacity-80">{tip}</span>
              </button>
              <div className="min-h-8" />
            </div>
          </div>
          {composer}
        </div>
        {cards}
      </div>
    </div>
  </div>
);

// ---------- 对话页 ----------
/** 消息列表的外层（居中 max-w-3xl，p-4） */
export const ChatScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="flex min-h-0 max-h-full min-w-0 flex-1 flex-col overflow-hidden">
    <div className="flex min-h-0 max-h-full min-w-0 flex-1 flex-col overflow-hidden">
      <div className="relative flex min-h-0 min-w-0 shrink grow">
        <div className="flex min-h-0 min-w-0 w-full shrink grow justify-center overflow-y-hidden p-4 [scrollbar-gutter:stable_both-edges]">
          <div className="relative h-fit w-full max-w-3xl min-w-0" data-chat-message-list="true">{children}</div>
        </div>
      </div>
    </div>
  </div>
);

export const UserMsg: React.FC<{ text: string; textO?: number }> = ({ text, textO = 1 }) => (
  <div className="scroll-mt-4">
    <div className="group relative flex flex-col items-end">
      <div className="relative flex w-fit sm:max-w-[75%] flex-col gap-2 rounded-lg px-3 py-2 ml-auto bg-secondary text-secondary-foreground dark:bg-[#303030]">
        <span className="break-words [overflow-wrap:anywhere]" style={textO < 1 ? { opacity: textO } : undefined}>{text}</span>
      </div>
      <div className="flex items-center gap-1 opacity-0" style={{ height: 28 }} />
    </div>
  </div>
);

/** 回答完成后的思考时长（「15 秒」折叠行） */
export const ThoughtFor: React.FC<{ sec: number }> = ({ sec }) => (
  <details className="group border-b border-border/60 pb-3">
    <summary className="flex w-fit cursor-pointer list-none items-center gap-1 py-3 text-sm text-muted-foreground hover:text-foreground [&::-webkit-details-marker]:hidden">
      <span>{sec} 秒</span>
      <Ic n="chevron-right" className="size-4 transition-transform group-open:rotate-90" />
    </summary>
  </details>
);

/** 生成中的折叠块：「深度思考」（文字）或「工具调用」（列表）；busy = 标题前的转圈 */
export const Accordion: React.FC<{ title: string; busy?: boolean; spin?: number; children: React.ReactNode }> = ({ title, busy, spin = 0, children }) => (
  <div className="mb-3" data-orientation="vertical">
    <div data-state="open" data-orientation="vertical" className="border-b">
      <h3 data-orientation="vertical" data-state="open" className="flex">
        <button type="button" data-state="open" data-orientation="vertical" className={ACCORDION_BTN}>
          <span>
            {busy && <span><Ic n="loader-circle" className="inline-block size-4" style={{ transform: `rotate(${spin}deg)` }} />&nbsp;</span>}
            {title}
          </span>
          <Ic n="chevron-down" className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200" />
        </button>
      </h3>
      <div data-state="open" role="region" data-orientation="vertical" className="overflow-hidden text-sm">
        <div className="pb-4 pt-0 text-gray-500 dark:text-gray-400">{children}</div>
      </div>
    </div>
  </div>
);

/** 工具调用一行：图标（完成 ✓ / 等待确认）+ 工具名 + 参数 */
export const ToolCall: React.FC<{ name: string; args: string[]; pending?: boolean; o?: number }> = ({ name, args, pending, o = 1 }) => (
  <li className="flex items-center gap-2" style={{ opacity: o }}>
    {pending ? <Ic n="message-circle-warning" className="size-4" /> : <Ic n="check" className="size-4 text-green-600" />}
    <b>{name}</b>
    {args.map((a) => <code key={a} className={CODE}>{a}</code>)}
  </li>
);

/** 引用角标（回答里的段落编号）；hover = 悬停（深底白字） */
export const Cite: React.FC<{ n: number; hover?: boolean; s?: number }> = ({ n, hover, s = 1 }) => (
  <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 text-primary underline-offset-4 px-0 py-0 h-auto align-baseline hover:no-underline" data-state="closed" style={{ transform: `scale(${s})` }}>
    <div className="inline-flex items-center border py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent bg-secondary text-secondary-foreground rounded-full px-1 hover:text-primary-foreground hover:bg-primary dark:hover:bg-primary dark:bg-[#303030]" {...hov(hover)}>{n}</div>
  </button>
);

/** 引用悬浮卡：资源标题、被引片段（原文 markdown）、资源 id。实拍朝下展开（data-side=bottom，离角标 4px）；
 * loading = 刚悬停时「正在加载详情…」，片段还是空的 */
export const CiteCard: React.FC<{ title: string; text: string; id: string; loading?: boolean; o?: number; s?: number }> = ({ title, text, id, loading, o = 1, s = 1 }) => (
  <div data-side="bottom" data-align="center" data-state="open" className="z-50 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none w-80" style={{ opacity: o, transform: `scale(${0.95 + 0.05 * s}) translateY(${-8 * (1 - s)}px)`, transformOrigin: '50% 0' }}>
    <div>
      {loading && <p role="status">正在加载详情…</p>}
      <p className="font-semibold line-clamp-2">{title}</p>
      <div className="text-sm line-clamp-4">{loading ? '' : text}</div>
      <div className="text-muted-foreground text-xs mt-1">@{id}</div>
    </div>
  </div>
);

// ---------- 资源页 + 右侧对话面板（点回答里的引用之后；2026-10-15 test.omnibox.pro 实拍） ----------
const HEAD_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground h-8 rounded-md px-3 text-xs';
const ICON_BTN = `${GHOST} h-7 w-7 shrink-0`;
const PANEL_BTN =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground rounded-md px-3 text-xs size-[28px]';
/** 对话面板宽度（产品像素，实拍 376） */
export const CHAT_PANEL_W = 376;

/** 资源页顶栏：面包屑（父文件夹 › 资源；个人根目录下只有资源名）、更新时间、分享 / 编辑 / 更多 / 评论 / 编辑历史 */
export const ResourceHeader: React.FC<{ crumbs: string[]; updated: string }> = ({ crumbs, updated }) => {
  const parents = crumbs.slice(0, -1);
  const name = crumbs[crumbs.length - 1];
  return (
    <header className="flex min-h-[48px] min-w-0 shrink-0 items-center gap-2 overflow-hidden rounded-[16px] bg-white dark:bg-background">
      <div className="flex min-w-0 flex-1 items-center gap-1 px-3 sm:gap-2">
        <nav aria-label="breadcrumb" className="max-w-full min-w-0 ml-2">
          <ol className="flex items-center break-words text-sm text-muted-foreground min-w-0 flex-nowrap gap-0 overflow-hidden sm:gap-0">
            {parents.map((c) => (
              <React.Fragment key={c}>
                <li className="inline-flex items-center gap-1.5 min-w-0 shrink">
                  <button className="inline-flex items-center gap-2 whitespace-nowrap rounded-md text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent transition-colors hover:text-foreground h-6 max-w-[7rem] justify-start overflow-hidden px-2 py-0 font-normal text-foreground sm:max-w-[240px]">
                    <span className="min-w-0 truncate text-left">{c}</span>
                  </button>
                </li>
                <li role="presentation" aria-hidden="true" className="[&>svg]:w-3.5 [&>svg]:h-3.5 shrink-0"><Ic n="chevron-right" /></li>
              </React.Fragment>
            ))}
            <li className="inline-flex items-center gap-1.5 min-w-0 flex-1 overflow-hidden">
              <span role="link" aria-disabled="true" aria-current="page" className="block min-w-0 truncate pl-2 font-normal text-foreground">{name}</span>
            </li>
          </ol>
        </nav>
      </div>
      <div className="ml-auto flex shrink-0 items-center gap-1 pr-3">
        <div className="flex items-center gap-2 text-sm">
          <div className="hidden font-medium text-muted-foreground md:inline-block">{updated}</div>
          <button className={HEAD_BTN} type="button" data-state="closed"><Ic n="share" />分享</button>
          <button className={HEAD_BTN}><Ic n="pencil" />编辑</button>
          <button className={`${GHOST} size-7 data-[state=open]:bg-accent`} type="button" data-state="closed"><Ic n="ellipsis" className="size-4" /></button>
        </div>
        <button className={ICON_BTN} type="button" aria-label="评论" data-state="closed"><Ic n="message-square-text" className="size-4" /></button>
        <button className={ICON_BTN} aria-label="打开编辑历史" type="button" data-state="closed"><Ic n="file-clock" /></button>
      </div>
    </header>
  );
};

export type ResBlock = { kind: 'p' | 'quote'; text: string };
const MetaRow: React.FC<{ icon: string; label: string; children: React.ReactNode; top?: boolean }> = ({ icon, label, children, top }) => (
  <div className={`flex flex-wrap sm:flex-nowrap ${top ? 'items-start' : 'items-center'} gap-4`}>
    <div className={`${top ? 'min-h-5 ' : ''}flex items-center gap-1.5`}>
      <Ic n={icon} className={`${icon === 'tags' ? 'flex-shrink-0 ' : ''}size-4 text-neutral-400`} />
      <span className="text-neutral-400 min-w-[80px] min-h-6 flex items-center">{label}</span>
    </div>
    {children}
  </div>
);

/**
 * 资源只读页（resource-readonly-page-header + tiptap 只读编辑器）。
 * hl = 被引用的块：产品 CSS 给含 .omnibox-scroll-line-highlight 的顶层块加圆角蓝底（rgba(0,144,255,.2)）。
 * loading = 刚打开、正文还没取回来（实拍里先空一下再出来）
 */
export const ResourceView: React.FC<{ title: string; tags?: string[]; file?: string; created: string; blocks: ResBlock[]; hl?: number; loading?: boolean; hlO?: number }> = ({ title, tags, file, created, blocks, hl, loading, hlO = 1 }) => (
  <div className="no-scrollbar flex min-w-0 flex-1 justify-center overflow-x-hidden overflow-y-auto p-4" data-resource-scroll="true">
    <div className="flex w-full min-w-0 max-w-full flex-col" style={{ maxWidth: '100%' }}>
      <div data-resource-export-content="true">
        <div className="resource-readonly-page-header">
          <h1 className="resource-search-title mb-4 min-w-0 max-w-full break-all text-[34px] font-bold">{title}</h1>
          <div className="space-y-2 mb-6 text-sm">
            <MetaRow icon="tags" label="标签" top>
              <span className="flex flex-wrap items-center text-foreground min-h-6">
                {tags && tags.length ? (
                  <div className="flex gap-2 flex-wrap min-h-6 gap-y-4 cursor-pointer">
                    {tags.map((g) => <div key={g} className="inline-flex items-center border transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm border-neutral-300 text-neutral-500 font-normal rounded-[8px] px-[8px] py-[1px] dark:border-neutral-500 dark:text-neutral-400">{g}</div>)}
                  </div>
                ) : (
                  <div className="flex gap-2 flex-wrap min-h-6 cursor-pointer gap-y-4">
                    <div className="inline-flex items-center border text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-neutral-300 text-neutral-500 font-normal rounded-[8px] px-[8px] py-[2px] dark:border-neutral-500 dark:text-neutral-400">点击添加标签</div>
                  </div>
                )}
              </span>
            </MetaRow>
            {file && (
              <MetaRow icon="file" label="文件">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground hover:bg-sidebar-accent font-normal ml-[-8px] h-auto py-0 px-2 text-neutral-500 dark:text-neutral-400">{file}</button>
              </MetaRow>
            )}
            <MetaRow icon="clock" label="创建时间">
              <span className="text-neutral-500 dark:text-neutral-400">{created}</span>
            </MetaRow>
          </div>
        </div>
        <div className="resource-readonly-editor pb-[30vh]" tabIndex={-1} style={{ overflow: 'inherit' }}>
          <div data-variant="embedded" data-theme="light" className="omnibox-editor-root omnibox-editor-wrapper omnibox-editor-wrapper--embedded" style={{ '--omnibox-editor-content-width': '680px' } as React.CSSProperties}>
            <div className="omnibox-editor-layout omnibox-editor-layout--embedded">
              <div role="presentation" className="omnibox-editor-content" style={{ cursor: 'auto' }}>
                <div className="omnibox-drag-handle-wrapper" style={{ '--drag-handle-main-axis-offset': '16px' } as React.CSSProperties} />
                <div contentEditable={false} translate="no" className="tiptap ProseMirror omnibox-editor" style={{ opacity: loading ? 0 : 1 }}>
                  {blocks.map((b, i) => {
                    const inner = i === hl ? (
                      <>
                        <span data-scroll-line-target="true" aria-hidden="true" className="ProseMirror-widget" style={{ display: 'inline-block', width: 0, height: '1em', pointerEvents: 'none', verticalAlign: 'top' }} />
                        <span data-scroll-line-highlight="true" className={hlO > 0 ? 'omnibox-scroll-line-highlight' : undefined}>{b.text}</span>
                      </>
                    ) : b.text;
                    return b.kind === 'quote' ? <blockquote key={i}><p>{inner}</p></blockquote> : <p key={i}>{inner}</p>;
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/** 右侧对话面板顶栏：收起面板、对话标题、新对话、历史 */
export const ChatPanelHeader: React.FC<{ title: string }> = ({ title }) => (
  <header className="rounded-2xl sticky z-[30] top-0 bg-white flex flex-wrap min-h-12 shrink-0 items-center gap-2 dark:bg-background">
    <div className="flex min-w-0 flex-1 items-center gap-1 px-3 sm:gap-2">
      <button className={ICON_BTN} aria-label="收起右侧边栏" type="button" data-state="closed"><Ic n="panel-right" /></button>
      <nav aria-label="breadcrumb" className="min-w-0">
        <ol className="flex flex-wrap items-center gap-1.5 break-words text-sm text-muted-foreground sm:gap-2.5">
          <li className="inline-flex items-center gap-1.5 min-w-0">
            <span role="link" aria-disabled="true" aria-current="page" className="font-normal text-foreground line-clamp-1">
              <div className="flex items-center gap-0 group">
                <span className="max-w-[400px] line-clamp-1">{title}</span>
              </div>
            </span>
          </li>
        </ol>
      </nav>
    </div>
    <div className="ml-auto shrink-0 pr-3">
      <div className="flex items-center gap-1 text-sm">
        <button className={PANEL_BTN} data-state="closed"><Ic n="message-circle-plus" /></button>
        <button className={`${PANEL_BTN} text-[#585D65] dark:text-white`} data-state="closed"><Ic n="history" /></button>
      </div>
    </div>
  </header>
);

/**
 * 点引用之后的主区：左边资源页，右边对话面板（产品里面板是 fixed、宽 376、离边 8，左边留同宽占位）。
 * split 0→1：占位宽度展开、面板从右侧滑入（产品 200ms ease-linear 的 width / transform 过渡）。叠在 AppFrame 的主区上（over）
 */
export const SplitView: React.FC<{ split: number; header: React.ReactNode; resource: React.ReactNode; panel: React.ReactNode; o?: number }> = ({ split, header, resource, panel, o = 1 }) => (
  // zIndex：盖过下面对话页 sticky 的顶栏（z-[30]）
  <div data-resource-comments-root="true" className="absolute inset-0 flex h-full min-h-0 min-w-0 flex-1 overflow-hidden bg-sidebar" style={{ opacity: o, zIndex: 40 }}>
    <div className="flex min-h-0 min-w-0 flex-1 flex-col">
      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden gap-2 p-2">
        <main className="relative flex flex-1 flex-col peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow h-full min-h-0 min-w-0 overflow-hidden rounded-[16px] bg-white dark:bg-background m-0 md:h-full">
          {header}
          <div data-orientation="horizontal" role="none" className="shrink-0 h-[1px] w-full bg-[#F2F2F2] dark:bg-[#303132]" />
          {resource}
        </main>
        <div aria-hidden="true" className="pointer-events-none shrink-0" style={{ width: CHAT_PANEL_W * split, marginLeft: -8 * (1 - split) }} />
        <div aria-hidden="false" className="absolute bottom-2 right-2 top-2 z-20 flex min-h-0 flex-col" style={{ width: CHAT_PANEL_W, transform: `translateX(${(CHAT_PANEL_W + 8) * (1 - split)}px)` }}>
          <main className="relative flex flex-1 flex-col peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow min-h-0 !min-h-0 max-h-full min-w-0 h-full overflow-hidden bg-white dark:bg-background md:rounded-2xl m-0 rounded-none md:h-full">
            {panel}
          </main>
        </div>
      </div>
    </div>
  </div>
);

/** 回答下方的操作：重新生成、复制、保存、分享 */
export const AnswerActions: React.FC<{ o?: number; saveHover?: boolean; tip?: string }> = ({ o = 1, saveHover, tip }) => (
  <div className="flex items-center gap-1 ml-[-6px] mt-[-10px] " style={{ opacity: o }}>
    <button className={`${GHOST} p-0 w-7 h-7`} data-state="closed"><Ic n="refresh-cw" className="w-4 h-4" /></button>
    <button className={`${GHOST} p-0 w-7 h-7`} data-state="closed"><Ic n="copy" /></button>
    <span style={{ position: 'relative', display: 'inline-flex' }}>
      <button className={`${GHOST} p-0 w-7 h-7`} data-state="closed" {...hov(saveHover)}><Ic n="save" /></button>
      {tip && (
        <div style={{ position: 'absolute', left: '50%', bottom: 'calc(100% + 4px)', transform: 'translateX(-50%)', zIndex: 50 }}>
          <div data-side="top" data-align="center" data-state="delayed-open" className="z-50 rounded-md bg-primary px-3 py-1.5 text-xs text-primary-foreground overflow-visible whitespace-nowrap">
            <p>{tip}</p>
            <span style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translate(-50%, 100%)' }}>
              <svg className="fill-primary" width="10" height="5" viewBox="0 0 30 10" preserveAspectRatio="none" style={{ display: 'block' }}><polygon points="0,0 30,0 15,10" /></svg>
            </span>
          </div>
        </div>
      )}
    </span>
    <button className={`${GHOST} h-7 w-7 p-0`} aria-label="分享" data-state="closed"><Ic n="share16" /></button>
  </div>
);

/** 回答正文（GitHub 风格 markdown 容器，产品原样） */
export const Markdown: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="scroll-mt-4">
    <div className="group markdown-body reset-list" style={{ background: 'transparent' }}>{children}</div>
  </div>
);

// ---------- ⌘J 搜索 ----------
export type Hit = { icon: string; title: string; text: string };
/** 搜索弹窗（cmdk）：输入行 + 资源结果 + 右侧筛选；o / s 给出现动画 */
export const SearchDialog: React.FC<{ query: string; caret?: boolean; hits: Hit[]; hitO?: (i: number) => number; o?: number; s?: number }> = ({ query, caret, hits, hitO = () => 1, o = 1, s = 1 }) => (
  <>
    <div data-state="open" className="fixed inset-0 z-50 bg-black/80" style={{ opacity: o }} />
    <div role="dialog" data-state="open" className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] gap-4 border duration-200 sm:rounded-lg overflow-hidden p-0 w-[calc(100vw-32px)] max-w-[1040px] rounded-2xl border-none bg-white shadow-xl dark:bg-neutral-900 [&>button]:hidden" style={{ opacity: o, transform: `translate(-50%, -50%) scale(${s})`, height: 640 }}>
      {/* height：产品里是内容撑开的 640（min(640px, 100vh − 32px)）；zoom 下 fixed 的 grid 会被拉满视口，这里写死 */}
      <div cmdk-root="" className="flex w-full flex-col overflow-hidden [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 h-[min(640px,calc(100vh-32px))] rounded-2xl bg-white px-5 py-4 text-foreground dark:bg-neutral-900">
        <div className="relative flex h-full flex-col gap-2">
          <div className="flex h-7 items-center gap-3 border-b border-slate-200 pb-3 dark:border-neutral-800">
            <div className="flex items-center h-7 flex-1 border-b-0 px-0" cmdk-input-wrapper="">
              <Ic n="search" className="shrink-0 mr-1 size-4 opacity-70" />
              <div cmdk-input="" className="flex w-full rounded-md bg-transparent outline-none h-7 py-0 text-sm items-center">
                {query || <span className="text-muted-foreground">搜索资源</span>}
                {caret && <span style={{ display: 'inline-block', width: 1.5, height: 16, marginLeft: 1, background: 'currentColor' }} />}
              </div>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-3">
              <div className="flex items-center gap-3">
                <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 py-2 h-[22px] rounded border-none bg-transparent px-2 text-sm font-normal text-muted-foreground shadow-none outline-none ring-0 hover:bg-accent hover:text-muted-foreground focus-visible:ring-0 focus-visible:ring-transparent active:!bg-[#3b82f633] active:text-[#3b82f6] dark:hover:bg-accent">清除</button>
                <span className="h-4 w-px bg-slate-200 dark:bg-neutral-700" />
              </div>
              <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 size-4 rounded-none p-0 text-muted-foreground hover:bg-transparent hover:text-foreground" aria-label="关闭">
                <Ic n="x" className="size-4" />
              </button>
            </div>
          </div>
          <div className="grid min-h-0 flex-1 grid-cols-1 grid-rows-[minmax(0,1fr)_1px_auto] gap-0 lg:grid-cols-[minmax(0,1fr)_1px_320px] lg:grid-rows-1">
            <div className="min-h-0 min-w-0">
              <div cmdk-list="" className="max-h-[300px] relative h-full max-h-none overflow-y-auto overflow-x-hidden pr-2" role="listbox">
                <div cmdk-list-sizer="">
                  {hits.length > 0 && (
                    <div cmdk-group="" className="overflow-hidden text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:text-muted-foreground p-0 !px-0 [&_[cmdk-group-heading]]:!px-0 [&_[cmdk-group-heading]]:py-0 [&_[cmdk-group-heading]]:text-base [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:leading-6" role="presentation" style={{ opacity: hitO(0) }}>
                      <div cmdk-group-heading="">资源</div>
                      <div cmdk-group-items="" role="group">
                        {hits.map((h, i) => (
                          <div key={h.title} cmdk-item="" className="relative flex gap-2 select-none items-center px-2 py-1.5 text-sm outline-none data-[disabled=true]:pointer-events-none data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 my-1 cursor-pointer rounded-lg !px-2 !py-0 data-[selected=true]:bg-accent" role="option" data-disabled="false" data-selected={i === 0 ? 'true' : 'false'} style={{ opacity: hitO(i), transform: `translateY(${(1 - hitO(i)) * 12}px)` }}>
                            <a className="flex min-h-[62px] w-full flex-col items-start rounded-lg px-0 py-2 text-left text-foreground no-underline outline-none">
                              <div className="flex w-full items-center gap-2">
                                <div className="flex size-4 shrink-0 items-center justify-center text-muted-foreground [&>svg]:size-4"><ResIc icon={h.icon} name={h.title} /></div>
                                <div className="min-w-0 flex-1 truncate text-base font-medium leading-6 text-foreground">{h.title}</div>
                              </div>
                              <div className="ml-6 line-clamp-2 text-sm leading-[22px] text-[rgba(26,26,26,0.36)] dark:text-neutral-500">{h.text}</div>
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="h-px bg-slate-200 dark:bg-neutral-800 lg:h-auto lg:w-px" />
            <div className="min-w-0">
              <aside className="flex h-full max-h-[min(320px,40vh)] w-full shrink-0 flex-col overflow-hidden bg-white py-2.5 pl-4 pr-2.5 dark:bg-neutral-900 lg:max-h-none">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <h2 className="text-lg font-semibold leading-[1.4] text-foreground">筛选</h2>
                  <div className="ml-auto flex items-center gap-2">
                    <span className="cursor-default whitespace-nowrap text-xs text-muted-foreground" data-state="closed">条件行剩余：2 / 3</span>
                    <button className="inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground rounded-md px-3 shadow-none dark:bg-white dark:text-primary-foreground hover:bg-neutral-800 active:bg-neutral-700 dark:active:bg-neutral-300 dark:hover:bg-neutral-100 disabled:opacity-100 disabled:bg-neutral-400 disabled:text-neutral-200 dark:disabled:bg-neutral-700 dark:disabled:text-neutral-500 dark:disabled:hover:bg-neutral-700 text-sm h-5">升级</button>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium leading-[1.4] text-foreground">匹配下列条件</p>
                  <button role="combobox" data-state="closed" className="flex items-center justify-between whitespace-nowrap border py-2 ring-offset-background data-[placeholder]:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1 h-8 rounded-md border-line bg-transparent px-3 text-sm shadow-none hover:bg-transparent focus:ring-0 focus:ring-transparent focus:outline-none dark:bg-transparent dark:hover:bg-transparent w-[103px]">
                    <span>全部</span>
                    <Ic n="chevron-down" className="h-4 w-4 opacity-50" />
                  </button>
                </div>
                <div className="mt-4 min-h-0 flex-1 space-y-5 overflow-y-auto pr-1 lg:max-h-96 lg:flex-none">
                  <div className="space-y-2">
                    <div className="flex h-5 items-center justify-between gap-2">
                      <p className="text-sm font-medium leading-5 text-foreground">条件 1</p>
                    </div>
                    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
                      <button role="combobox" data-state="closed" className={`${SELECT} data-[placeholder]:text-foreground`}><span>标题</span><Ic n="chevron-down" className="h-4 w-4 opacity-50" /></button>
                      <button role="combobox" data-state="closed" className={`${SELECT} data-[placeholder]:text-muted-foreground`}><span>包含</span><Ic n="chevron-down" className="h-4 w-4 opacity-50" /></button>
                    </div>
                    <input className="flex w-full border py-1 transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm h-8 rounded-md border-line bg-transparent px-3 text-sm shadow-none hover:bg-transparent focus:ring-0 focus:ring-transparent focus:outline-none dark:bg-transparent dark:hover:bg-transparent focus-visible:ring-0 focus-visible:ring-transparent" placeholder="请输入关键词" readOnly value="" />
                  </div>
                </div>
                <span className="mt-5 inline-flex w-fit" data-state="closed">
                  <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:text-accent-foreground py-2 h-5 w-fit gap-1 px-0 text-sm font-normal hover:bg-transparent">
                    <Ic n="plus" className="size-4" />
                    添加条件
                  </button>
                </span>
              </aside>
            </div>
          </div>
        </div>
      </div>
    </div>
  </>
);
