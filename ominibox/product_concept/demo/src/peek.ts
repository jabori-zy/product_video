import React from 'react';

/** 首页小黑从输入框后面探出的进度（0 = 藏在输入框后面，1 = 正常位置）。
 *  E+ 插段末尾在定格的电脑首页里用它做「小黑探头」；E 段本身不包 Provider，默认 1 */
export const CatPeek = React.createContext(1);
