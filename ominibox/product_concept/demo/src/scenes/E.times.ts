// E 段的点击与打字时刻（局部秒，全局 = 18 + t）：画面（E.tsx）和声音事件表（audio/cues.ts）共用
// high_fidelity_v3：去掉了产品里没有的「深度思考」开关和「问答 / 写作」切换；
// 改为点「Agent 2.1 轻」打开思考强度弹层（1.6）→ 点滑条把档位拉到「高」（1.9）→ 再打字
/** 分享前：点侧栏「AI Agent 元年」→ 资源页 → 点「分享」（脚本时间很短，pace.ts 把 11.7–11.8 放慢了约 28 倍） */
export const E_OPEN_ROW = 11.737, E_SHARE = 11.787;
export const E_CLICKS = [1.6, 1.9, 2.9, 4.9, 6.4, 9.15, 9.5, E_OPEN_ROW, E_SHARE]; // 周报不再点「保存」：滚到底直接收进侧栏
/** Q1 开始打字 */
export const E_Q1_AT = 2.0;
