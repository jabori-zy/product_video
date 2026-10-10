// 多语言：成片用 <LangCtx.Provider value="en"> 切换语言；场景里用 tr('中文', 'English') 取当前语言的文字
import React, { createContext, useContext } from 'react';
import { FONT } from './fonts';
import { RES as RES_TABLE, type ResKey } from './copy';

export type Lang = 'zh' | 'en';
export const LangCtx = createContext<Lang>('zh');
export const useLang = () => useContext(LangCtx);
/** const tr = useTr(); tr('中文', 'English') */
export const useTr = () => {
  const lang = useLang();
  return <T,>(zh: T, en: T): T => (lang === 'en' ? en : zh);
};

/** 文字宽度（px）：英文比中文宽，开场与结尾的排版按实测宽度计算（字体加载前用估算值） */
let ctx: CanvasRenderingContext2D | null = null;
export const textW = (text: string, size: number, weight = 500): number => {
  if (typeof document === 'undefined') return text.length * size * 0.56;
  ctx = ctx || document.createElement('canvas').getContext('2d');
  if (!ctx) return text.length * size * 0.56;
  ctx.font = `${weight} ${size}px ${FONT}, sans-serif`;
  return ctx.measureText(text).width;
};

export const LangProvider: React.FC<{ lang: Lang; children: React.ReactNode }> = ({ lang, children }) => <LangCtx.Provider value={lang}>{children}</LangCtx.Provider>;

/** const res = useRes(); res('q3') → 当前语言的资源名 */
export const useRes = () => {
  const lang = useLang();
  return (k: ResKey) => (lang === 'en' ? RES_TABLE[k].en : RES_TABLE[k].zh);
};
