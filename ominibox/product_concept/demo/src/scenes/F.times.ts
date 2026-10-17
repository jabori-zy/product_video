// F 段分享弹窗里的点击时刻（局部秒，全局 = 30 + t）：画面（F.tsx）和声音事件表（audio/cues.ts）共用
// pace.ts 把 30.7–31.95 放慢到 4.5×，所以这里的间隔很小
// 过期时间弹层：顶部 Tab（永不过期 / 指定日期 / 倒计时），点「指定日期」Tab 出日历（倒计时 Tab 只展示、不点）
export const F_K = { login: 0.75, exp: 0.9, pick: 1.06, day: 1.22, expSave: 1.34, pw: 1.48, pwSave: 1.8, copy: 1.92 };
export const F_CLICKS = [0.3, F_K.login, F_K.exp, F_K.pick, F_K.day, F_K.expSave, F_K.pw, F_K.pwSave, F_K.copy];
/** 开关 / 选中时的轻响 */
export const F_TICKS = [F_K.login, F_K.pick, F_K.day, F_K.pw];
