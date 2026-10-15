import React from 'react';
import { useRes, useTr } from './i18n';
import { Z } from './omni/root';
import { AppFrame, Composer, GroupLabel, HomeBody, HomeCards, HomeHeader, Main, Row, SIDE, Sidebar, SystemGroup, ROW_PITCH, TREE_TOP, type Recent } from './omni/app';

// OmniBox 网页端（high_fidelity_v3 起为浅色真实 DOM，见 omni/）：这里放场景要用的画布坐标和组合好的整页
// 产品像素 × Z = 画布像素（1440×810 → 1920×1080）

export * from './omni/app';
export { Ic, Omni, Z } from './omni/root';

/** 侧栏底色（--sidebar-background），镜头拉远 / 倾斜时露出的画布底色 */
export const OMNI_BG = '#F2F2F7'; // hsl(240 23.81% 95.88%)
/** 资源树第 i 行 li 的 top（产品像素） */
export const rowTop = (i: number) => TREE_TOP + i * ROW_PITCH;
/** 资源树第 i 行 li 的 top（画布像素） */
export const rowY = (i: number) => rowTop(i) * Z;
/** 资源树第 i 行可见的圆角行框（画布像素）：li 内 my-px，圆角 rounded-md */
export const rowRect = (i: number) => ({ x: 8 * Z, y: rowY(i) + Z, w: 240 * Z, h: 32 * Z, r: 6 * Z });
/** 主区圆角面板（画布像素） */
export const PANEL = { x: (SIDE + 8) * Z, y: 8 * Z, w: (1440 - SIDE - 16) * Z, h: (810 - 16) * Z, r: 16 * Z };
/** 对话页顶栏「分享」按钮中心（画布像素）：E → F 的圆形展开从这里开始 */
export const SHARE = { x: 1342 * Z, y: 32 * Z };

/** 「个人」下的静态资源树 + 「系统」分组；rows = [图标, 名字] */
export const Tree: React.FC<{ rows: [string, string][] }> = ({ rows }) => {
  const tr = useTr();
  return (
    <>
      <GroupLabel top={308} text={tr('个人', 'Personal')} />
      {rows.map(([ic, name], i) => <Row key={name} top={rowTop(i)} icon={ic} text={name} />)}
      <SystemGroup top={rowTop(rows.length - 1) + 34 + 8} />
    </>
  );
};

/** 首页卡片「最近更新」里的三条（资源名跟侧栏同一套） */
export const useRecent = (): Recent[] => {
  const res = useRes(), tr = useTr();
  return [
    ['📕', res('monthly'), tr('4 天前更新', 'Updated 4 days ago')],
    ['📕', res('docker'), tr('4 天前更新', 'Updated 4 days ago')],
    ['🌐', res('zhihuHome'), tr('5 天前创建', 'Created 5 days ago')],
  ];
};

/**
 * 完整网页（侧栏资源树 + 首页），D 段背景和 M1 笔记本里用。
 * homeO：首页内容（小黑、推荐问题、输入框、卡片）的不透明度；0 时只剩侧栏 + 空白主区，与 D 开场一致。
 * tree：替换资源树这一层（D 段逐行做动画时传）
 */
export const WebHome: React.FC<{ rows?: [string, string][]; homeO?: number; tree?: React.ReactNode; overlay?: React.ReactNode }> = ({ rows = [], homeO = 1, tree, overlay }) => {
  const res = useRes(), tr = useTr();
  const recent = useRecent();
  return (
    <AppFrame side={<Sidebar tab={0} space={res('space')}>{tree ?? <Tree rows={rows} />}</Sidebar>} overlay={overlay}>
      <Main header={<HomeHeader />}>
        <div style={{ display: 'flex', flex: 1, minHeight: 0, opacity: homeO, transform: `translateY(${(1 - homeO) * 18}px)` }}>
          <HomeBody tip={tr('列出包含“会议”标签的所有资源', 'List all resources tagged "meeting"')} composer={<Composer />} cards={<HomeCards recent={recent} />} />
        </div>
      </Main>
    </AppFrame>
  );
};
