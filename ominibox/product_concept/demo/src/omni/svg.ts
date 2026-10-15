// 产品图标：从真实网页 DOM 原样取出的 SVG（omnibox-art 导出的 HTML 状态 + 2026-10-15 ego-browser 实拍），按 lucide 名 / 用途命名
// 由一次性脚本生成；不要手改路径
export type SvgDef = { p: Record<string, string>; c: string; h: string };
export const SVG: Record<string, SvgDef> = {
"chevron-down": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-chevron-down",
"h": "<path d=\"m6 9 6 6 6-6\"></path>"
},
"panel-right": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-panel-right",
"h": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M15 3v18\"></path>"
},
"file": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file",
"h": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path>"
},
"panel-left": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-panel-left",
"h": "<rect width=\"18\" height=\"18\" x=\"3\" y=\"3\" rx=\"2\"></rect><path d=\"M9 3v18\"></path>"
},
"history": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-history",
"h": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"></path><path d=\"M3 3v5h5\"></path><path d=\"M12 7v5l4 2\"></path>"
},
"bell-dot": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-bell-dot",
"h": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"></path><path d=\"M11.68 2.009A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673c-.824-.85-1.678-1.731-2.21-3.348\"></path><circle cx=\"18\" cy=\"5\" r=\"3\"></circle>"
},
"users": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-users",
"h": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><path d=\"M16 3.128a4 4 0 0 1 0 7.744\"></path><path d=\"M22 21v-2a4 4 0 0 0-3-3.87\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle>"
},
"gift": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-gift",
"h": "<path d=\"M12 7v14\"></path><path d=\"M20 11v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8\"></path><path d=\"M7.5 7a1 1 0 0 1 0-5A4.8 8 0 0 1 12 7a4.8 8 0 0 1 4.5-5 1 1 0 0 1 0 5\"></path><rect x=\"3\" y=\"7\" width=\"18\" height=\"4\" rx=\"1\"></rect>"
},
"search": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-search",
"h": "<path d=\"m21 21-4.34-4.34\"></path><circle cx=\"11\" cy=\"11\" r=\"8\"></circle>"
},
"message-circle-plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-circle-plus",
"h": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"></path><path d=\"M8 12h8\"></path><path d=\"M12 8v8\"></path>"
},
"crosshair": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-crosshair",
"h": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><line x1=\"22\" x2=\"18\" y1=\"12\" y2=\"12\"></line><line x1=\"6\" x2=\"2\" y1=\"12\" y2=\"12\"></line><line x1=\"12\" x2=\"12\" y1=\"6\" y2=\"2\"></line><line x1=\"12\" x2=\"12\" y1=\"22\" y2=\"18\"></line>"
},
"rotate-cw": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-rotate-cw",
"h": "<path d=\"M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path>"
},
"list-check": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-list-check",
"h": "<path d=\"M16 5H3\"></path><path d=\"M16 12H3\"></path><path d=\"M11 19H3\"></path><path d=\"m15 18 2 2 4-4\"></path>"
},
"chevron-right": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-chevron-right",
"h": "<path d=\"m9 18 6-6-6-6\"></path>"
},
"ellipsis": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round",
"dataSidebar": "menu-action",
"type": "button",
"id": "radix-:r38:",
"ariaHaspopup": "menu",
"ariaExpanded": "false",
"dataState": "closed"
},
"c": "lucide lucide-ellipsis",
"h": "<circle cx=\"12\" cy=\"12\" r=\"1\"></circle><circle cx=\"19\" cy=\"12\" r=\"1\"></circle><circle cx=\"5\" cy=\"12\" r=\"1\"></circle>"
},
"folder": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-folder",
"h": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"></path>"
},
"file-text": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file-text",
"h": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M10 9H8\"></path><path d=\"M16 13H8\"></path><path d=\"M16 17H8\"></path>"
},
"caret": {
"p": {
"width": "16",
"height": "16",
"viewBox": "0 0 16 16",
"fill": "none"
},
"c": "transition-transform",
"h": "<path d=\"M6.33337 5L10.3334 8L6.33337 11L6.33337 5Z\" fill=\"currentColor\" stroke=\"currentColor\" stroke-width=\"1.33333\" stroke-linejoin=\"round\"></path>"
},
"trash": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-trash",
"h": "<path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path><path d=\"M3 6h18\"></path><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>"
},
"message-circle": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-circle",
"h": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"></path>"
},
"circle-question-mark": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-circle-question-mark",
"h": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3\"></path><path d=\"M12 17h.01\"></path>"
},
"discord": {
"p": {
"viewBox": "0 0 24 24",
"width": "24",
"height": "24",
"fill": "currentColor"
},
"c": "remixicon ",
"h": "<path d=\"M8.52062 13.8458C7.48059 13.8458 6.63159 12.9014 6.63159 11.7446 6.63159 10.5879 7.45936 9.64331 8.52062 9.64331 9.57123 9.64331 10.4308 10.5879 10.4096 11.7446 10.4096 12.9014 9.57123 13.8458 8.52062 13.8458ZM15.4941 13.8458C14.454 13.8458 13.604 12.9014 13.604 11.7446 13.604 10.5879 14.4328 9.64331 15.4941 9.64331 16.5447 9.64331 17.4043 10.5879 17.3831 11.7446 17.3831 12.9014 16.5553 13.8458 15.4941 13.8458ZM10.1253 4.32296 9.81655 3.76001 9.18323 3.86556C7.71915 4.10958 6.32658 4.54677 5.02544 5.14604L4.79651 5.25148 4.65507 5.46009C2.0418 9.31441 1.3258 13.1087 1.68032 16.8362L1.71897 17.2425 2.04912 17.4824C3.78851 18.7465 5.47417 19.5189 7.12727 20.0257L7.91657 20.2676 9.03013 17.5506C10.9397 18.0226 13.0592 18.0228 14.969 17.5511L16.0757 20.2683 16.8668 20.0256C18.5173 19.5193 20.2137 18.7472 21.9466 17.4811L22.2726 17.243 22.3131 16.8414C22.7491 12.5213 21.616 8.75773 19.3547 5.45652L19.2128 5.24944 18.9846 5.14504C17.6767 4.54685 16.2852 4.10981 14.8309 3.86573L14.2132 3.76207 13.8987 4.30369C13.8112 4.45445 13.7215 4.62464 13.6364 4.79687 12.5441 4.6847 11.456 4.68446 10.3726 4.79652 10.2882 4.62736 10.2025 4.4638 10.1253 4.32296ZM6.71436 16.6102C6.91235 16.7243 7.11973 16.8358 7.32557 16.9381L6.8764 18.034C5.75585 17.6259 4.61837 17.0637 3.4476 16.2557 3.22313 13.1178 3.86092 9.951 6.01196 6.68626 6.90962 6.29123 7.8535 5.98279 8.83606 5.77295 8.89631 5.89831 8.95235 6.02066 8.99839 6.12917L9.27128 6.77238 9.96259 6.67098C11.3152 6.4726 12.6772 6.47234 14.0523 6.67124L14.7424 6.77106 15.0147 6.12917C15.0621 6.01743 15.1167 5.89547 15.1743 5.77322 16.1525 5.98326 17.098 6.29212 18.0029 6.68812 19.8781 9.50857 20.8241 12.6544 20.5486 16.2552 19.3837 17.0625 18.2422 17.6249 17.1193 18.0335L16.6735 16.939C16.8799 16.8365 17.0879 16.7246 17.2865 16.6102 17.7763 16.328 18.3039 15.976 18.6402 15.6397L17.3606 14.3602C17.1969 14.5239 16.837 14.7808 16.3831 15.0423 15.9388 15.2983 15.498 15.5052 15.2164 15.5983 13.2126 16.2608 10.7883 16.2608 8.78443 15.5983 8.50285 15.5052 8.06205 15.2983 7.61772 15.0423 7.16383 14.7808 6.80392 14.5239 6.64017 14.3602L5.36065 15.6397C5.6969 15.976 6.2245 16.328 6.71436 16.6102Z\"></path>"
},
"wechat": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none"
},
"c": "",
"h": "<path d=\"M7.29163 8.70412C7.41651 8.70412 7.53627 8.65451 7.62456 8.56621C7.71286 8.47792 7.76247 8.35816 7.76247 8.23328C7.76247 8.10841 7.71286 7.98865 7.62456 7.90036C7.53627 7.81206 7.41651 7.76245 7.29163 7.76245C7.16676 7.76245 7.047 7.81206 6.9587 7.90036C6.87041 7.98865 6.8208 8.10841 6.8208 8.23328C6.8208 8.35816 6.87041 8.47792 6.9587 8.56621C7.047 8.65451 7.16676 8.70412 7.29163 8.70412ZM11.2937 8.70412C11.4186 8.70412 11.5383 8.65451 11.6266 8.56621C11.7149 8.47792 11.7646 8.35816 11.7646 8.23328C11.7646 8.10841 11.7149 7.98865 11.6266 7.90036C11.5383 7.81206 11.4186 7.76245 11.2937 7.76245C11.1688 7.76245 11.0491 7.81206 10.9608 7.90036C10.8725 7.98865 10.8229 8.10841 10.8229 8.23328C10.8229 8.35816 10.8725 8.47792 10.9608 8.56621C11.0491 8.65451 11.1688 8.70412 11.2937 8.70412Z\" stroke=\"currentColor\" stroke-width=\"0.941667\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M20.7104 14.2646C20.7104 11.9922 18.3397 10.0986 15.4084 10.0986C12.4772 10.0986 10.1064 11.9922 10.1064 14.2646C10.1064 16.5368 12.4772 18.4305 15.4084 18.4305C16.01 18.4314 16.6089 18.3498 17.1884 18.188L19.1956 19.1878L18.5668 17.6048C19.1869 17.2864 19.7117 16.8097 20.0881 16.2231C20.4646 15.6365 20.6793 14.9609 20.7104 14.2646Z\" stroke=\"currentColor\" stroke-width=\"1.54091\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M13.5302 13.2948C13.655 13.2948 13.7748 13.2452 13.8631 13.1569C13.9514 13.0686 14.001 12.9489 14.001 12.824C14.001 12.6991 13.9514 12.5794 13.8631 12.4911C13.7748 12.4028 13.655 12.3531 13.5302 12.3531C13.4053 12.3531 13.2855 12.4028 13.1972 12.4911C13.1089 12.5794 13.0593 12.6991 13.0593 12.824C13.0593 12.9489 13.1089 13.0686 13.1972 13.1569C13.2855 13.2452 13.4053 13.2948 13.5302 13.2948ZM17.2968 13.2948C17.4217 13.2948 17.5415 13.2452 17.6298 13.1569C17.7181 13.0686 17.7677 12.9489 17.7677 12.824C17.7677 12.6991 17.7181 12.5794 17.6298 12.4911C17.5415 12.4028 17.4217 12.3531 17.2968 12.3531C17.172 12.3531 17.0522 12.4028 16.9639 12.4911C16.8756 12.5794 16.826 12.6991 16.826 12.824C16.826 12.9489 16.8756 13.0686 16.9639 13.1569C17.0522 13.2452 17.172 13.2948 17.2968 13.2948Z\" stroke=\"currentColor\" stroke-width=\"0.941667\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path><path d=\"M15.7871 10.1141C15.7871 7.18278 12.9922 4.81201 9.53833 4.81201C6.08442 4.81201 3.28955 7.16759 3.28955 10.0989C3.31766 10.9422 3.55621 11.7651 3.98349 12.4927C4.41077 13.2203 5.01321 13.8295 5.736 14.2648L4.80434 16.1584L6.96299 14.9237C7.78477 15.2398 8.65777 15.4016 9.53821 15.4011C9.79131 15.3989 10.0441 15.3837 10.2957 15.3555\" stroke=\"currentColor\" stroke-width=\"1.54091\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path>"
},
"upgrade": {
"p": {
"viewBox": "0 0 24 24"
},
"c": "text-blue-500",
"h": "<circle cx=\"12\" cy=\"12\" r=\"12\" fill=\"currentColor\"></circle><path d=\"m16 12-4-4-4 4\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path><path d=\"M12 16V8\" stroke=\"white\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\" fill=\"none\"></path>"
},
"xiaohei": {
"p": {
"width": "94",
"height": "100",
"viewBox": "0 0 94 100",
"fill": "none"
},
"c": "h-[98px] w-[92px]",
"h": "<path d=\"M19.2363 0.844727C20.3266 0.382879 21.4446 0.408713 22.54 0.782227C24.6874 1.51454 26.8 3.59937 28.7256 6.08691C30.6674 8.59544 32.4853 11.6028 34.0195 14.3008C35.475 16.8604 36.6589 19.1061 37.4814 20.4541C47.2378 20.0226 56.227 21.8166 65.5498 24.3154C66.0593 24.0159 66.6647 23.4949 67.2988 22.8975C67.9456 22.288 68.6336 21.5907 69.1885 21.1084C71.2342 19.3304 74.8525 16.11 78.6523 13.5605C80.552 12.286 82.5172 11.1657 84.3711 10.4766C86.2143 9.79142 88.019 9.5054 89.5557 10.001L89.8027 10.0889C91.0181 10.5608 91.9397 11.5314 92.5059 12.7119C93.1408 14.0352 93.4208 15.8461 93.4854 17.8525C93.5503 19.8705 93.3985 22.1387 93.1367 24.4102C92.613 28.9539 91.6406 33.5583 91.0312 36.2842V36.2861L90.1641 40.0918L90.1631 40.0947C90.0967 40.3774 89.971 40.8642 89.8369 41.4414C89.7739 41.7125 89.7164 41.9742 89.6768 42.1855C89.6569 42.2912 89.6424 42.3793 89.6338 42.4473C89.6239 42.5256 89.6261 42.5459 89.625 42.5322L89.6572 42.8643C89.7447 43.6451 89.9103 44.4589 90.0918 45.3018C90.297 46.2544 90.5235 47.2485 90.6611 48.2236L90.6641 48.2393L90.665 48.2549C90.8106 50.1438 90.9462 51.9665 90.9707 54.3574C91.0309 60.2325 91.373 64.593 89.8887 70.9014C88.9879 74.7297 88.2035 77.7796 86.9619 80.6328C85.7161 83.4956 84.0178 86.1449 81.3037 89.1992C77.5228 93.454 70.958 95.9299 65.4287 97.3467C62.6496 98.0588 60.1032 98.5098 58.252 98.7832C57.3261 98.9199 56.5731 99.013 56.0508 99.0713C55.7897 99.1004 55.5861 99.1204 55.4473 99.1338C55.3778 99.1405 55.3242 99.1462 55.2881 99.1494C55.2702 99.151 55.2564 99.1515 55.2471 99.1523C55.2424 99.1527 55.2388 99.1531 55.2363 99.1533C55.2351 99.1534 55.2341 99.1533 55.2334 99.1533L55.2324 99.1543L55.2197 99.1553V99.1543L55.2188 99.1553H55.2031C55.1924 99.1559 55.176 99.1571 55.1553 99.1582C55.1138 99.1604 55.0526 99.1632 54.9727 99.167C54.8121 99.1745 54.5757 99.1847 54.2715 99.1953C53.6629 99.2165 52.7818 99.2395 51.6895 99.2471C49.505 99.2622 46.4721 99.216 43.0791 98.9678C36.3141 98.4728 28.0347 97.1719 22.208 93.9092C16.657 90.8008 11.9887 87.8554 8.3877 84.0195C4.77416 80.1701 2.25373 75.4459 0.948242 68.8105C0.0155353 64.0699 0.688247 58.2003 1.59961 53.4629C2.51229 48.7188 3.68542 45.0162 3.77441 44.6719L3.77539 44.668C4.87576 40.5526 5.81877 38.4774 7.6709 34.7803L7.67773 34.7656L7.68652 34.752C7.88154 34.4194 8.53812 33.3651 9.13281 32.376C9.43466 31.874 9.72523 31.3826 9.94434 30.9883C10.0541 30.7907 10.1436 30.6224 10.207 30.4922C10.2803 30.3418 10.292 30.2932 10.2891 30.3086C10.5905 28.7137 10.9008 26.5835 11.25 24.1904C11.5985 21.8025 11.9848 19.1607 12.4375 16.5596C12.89 13.9592 13.4102 11.3894 14.0283 9.14551C14.6437 6.91145 15.3671 4.95881 16.2412 3.61914C17.1572 2.21522 18.1567 1.30219 19.2363 0.844727Z\" class=\"fill-neutral-950 stroke-black dark:fill-background dark:stroke-white\"></path><g class=\"origin-center\"><path d=\"M29.3589 39.0381C35.7368 38.4335 41.3124 43.4656 41.8774 50.2012C42.4422 56.933 37.7992 62.9361 31.4282 63.5547C25.0417 64.1748 19.4512 59.1404 18.8853 52.3945C18.3195 45.6525 22.977 39.6432 29.3589 39.0381Z\" class=\"fill-[#FEF6EC] stroke-black\"></path><path d=\"M29.1514 44.6738C32.5504 44.0669 35.7207 46.507 36.3037 50.0566C36.8857 53.5998 34.6915 57.0304 31.3135 57.6963C27.8835 58.3723 24.6477 55.9251 24.0576 52.333C23.4689 48.7481 25.7218 45.2863 29.1514 44.6738Z\" class=\"fill-neutral-950 stroke-black dark:fill-background\"></path><path d=\"M61.5522 43.082C67.9041 42.4449 73.4792 47.4367 74.0591 54.1455C74.6383 60.8508 70.019 66.8422 63.6714 67.46C57.3304 68.0772 51.7745 63.0885 51.1958 56.3926C50.6175 49.7004 55.2189 43.7174 61.5522 43.082Z\" class=\"fill-[#FEF6EC] stroke-black\"></path><path d=\"M61.5903 48.375C65.0558 47.9808 68.112 50.6572 68.4829 54.2783C68.8531 57.8954 66.4174 61.205 62.9614 61.6211C59.4829 62.0398 56.4021 59.3588 56.0298 55.7217C55.658 52.0891 58.1165 48.7701 61.5903 48.375Z\" class=\"fill-neutral-950 stroke-black dark:fill-background\"></path></g>"
},
"bubble": {
"p": {
"viewBox": "0 0 327 48"
},
"c": "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
"h": "<path d=\"M31.355 0.5L303.252 0.545C316.092 0.551 326.499 10.962 326.5 23.803L326.5 23.747C326.5 36.535 316.175 46.925 303.386 47.005L3.989 47.459C1.314 47.468 -0.364 44.578 0.967 42.261L4.066 36.869C4.796 35.599 5.165 34.152 5.134 32.686L5.022 27.326L5.022 27.382C4.711 12.624 16.593 0.494 31.355 0.5Z\" class=\"fill-chat-composer stroke-[#E5E5E5] dark:fill-chat-composer-dark dark:stroke-transparent\"></path>"
},
"plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-plus",
"h": "<path d=\"M5 12h14\"></path><path d=\"M12 5v14\"></path>"
},
"hand": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-hand",
"h": "<path d=\"M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2\"></path><path d=\"M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2\"></path><path d=\"M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8\"></path><path d=\"M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15\"></path>"
},
"arrow-up": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-arrow-up",
"h": "<path d=\"m5 12 7-7 7 7\"></path><path d=\"M12 19V5\"></path>"
},
"file-up": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file-up",
"h": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M12 12v6\"></path><path d=\"m15 15-3-3-3 3\"></path>"
},
"puzzle": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none"
},
"c": "",
"h": "<path d=\"M20.5 11H19V7C19 5.9 18.1 5 17 5H13V3.5C13 2.12 11.88 1 10.5 1C9.12 1 8 2.12 8 3.5V5H4C2.9 5 2.01 5.9 2.01 7V10.8H3.5C4.99 10.8 6.2 12.01 6.2 13.5C6.2 14.99 4.99 16.2 3.5 16.2H2V20C2 21.1 2.9 22 4 22H7.8V20.5C7.8 19.01 9.01 17.8 10.5 17.8C11.99 17.8 13.2 19.01 13.2 20.5V22H17C18.1 22 19 21.1 19 20V16H20.5C21.88 16 23 14.88 23 13.5C23 12.12 21.88 11 20.5 11Z\" stroke=\"#3B82F6\" stroke-width=\"2\"></path>"
},
"file-plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file-plus",
"h": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M9 15h6\"></path><path d=\"M12 18v-6\"></path>"
},
"folder-plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-folder-plus",
"h": "<path d=\"M12 10v6\"></path><path d=\"M9 13h6\"></path><path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"></path>"
},
"arrow-up-down": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-arrow-up-down",
"h": "<path d=\"m21 16-4 4-4-4\"></path><path d=\"M17 20V4\"></path><path d=\"m3 8 4-4 4 4\"></path><path d=\"M7 4v16\"></path>"
},
"check": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-check",
"h": "<path d=\"M20 6 9 17l-5-5\"></path>"
},
"bell": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-bell",
"h": "<path d=\"M10.268 21a2 2 0 0 0 3.464 0\"></path><path d=\"M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326\"></path>"
},
"share": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-share",
"h": "<path d=\"M12 2v13\"></path><path d=\"m16 6-4-4-4 4\"></path><path d=\"M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8\"></path>"
},
"pencil": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-pencil",
"h": "<path d=\"M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z\"></path><path d=\"m15 5 4 4\"></path>"
},
"message-square-text": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-square-text",
"h": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\"></path><path d=\"M7 11h10\"></path><path d=\"M7 15h6\"></path><path d=\"M7 7h8\"></path>"
},
"file-clock": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file-clock",
"h": "<path d=\"M16 22h2a2 2 0 0 0 2-2V8a2.4 2.4 0 0 0-.706-1.706l-3.588-3.588A2.4 2.4 0 0 0 14 2H6a2 2 0 0 0-2 2v2.85\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M8 14v2.2l1.6 1\"></path><circle cx=\"8\" cy=\"16\" r=\"6\"></circle>"
},
"tags": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-tags",
"h": "<path d=\"M13.172 2a2 2 0 0 1 1.414.586l6.71 6.71a2.4 2.4 0 0 1 0 3.408l-4.592 4.592a2.4 2.4 0 0 1-3.408 0l-6.71-6.71A2 2 0 0 1 6 9.172V3a1 1 0 0 1 1-1z\"></path><path d=\"M2 7v6.172a2 2 0 0 0 .586 1.414l6.71 6.71a2.4 2.4 0 0 0 3.191.193\"></path><circle cx=\"10.5\" cy=\"6.5\" r=\".5\" fill=\"currentColor\"></circle>"
},
"clock": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-clock",
"h": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 6v6l4 2\"></path>"
},
"square-pen": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-square-pen",
"h": "<path d=\"M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7\"></path><path d=\"M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z\"></path>"
},
"move": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-move",
"h": "<path d=\"M12 2v20\"></path><path d=\"m15 19-3 3-3-3\"></path><path d=\"m19 9 3 3-3 3\"></path><path d=\"M2 12h20\"></path><path d=\"m5 9-3 3 3 3\"></path><path d=\"m9 5 3-3 3 3\"></path>"
},
"message-square-plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-square-plus",
"h": "<path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\"></path><path d=\"M12 8v6\"></path><path d=\"M9 11h6\"></path>"
},
"trash2": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-trash2 lucide-trash-2",
"h": "<path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path><path d=\"M3 6h18\"></path><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>"
},
"folder-open": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-folder-open",
"h": "<path d=\"m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2\"></path>"
},
"message-square-quote": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-square-quote",
"h": "<path d=\"M14 14a2 2 0 0 0 2-2V8h-2\"></path><path d=\"M22 17a2 2 0 0 1-2 2H6.828a2 2 0 0 0-1.414.586l-2.202 2.202A.71.71 0 0 1 2 21.286V5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2z\"></path><path d=\"M8 14a2 2 0 0 0 2-2V8H8\"></path>"
},
"trash-2": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-trash-2",
"h": "<path d=\"M10 11v6\"></path><path d=\"M14 11v6\"></path><path d=\"M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6\"></path><path d=\"M3 6h18\"></path><path d=\"M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2\"></path>"
},
"undo-2": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-undo-2",
"h": "<path d=\"M9 14 4 9l5-5\"></path><path d=\"M4 9h10.5a5.5 5.5 0 0 1 0 11H11\"></path>"
},
"delete": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-delete",
"h": "<path d=\"M10 5a2 2 0 0 0-1.344.519l-6.328 5.74a1 1 0 0 0 0 1.481l6.328 5.741A2 2 0 0 0 10 19h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2z\"></path><path d=\"m12 9 6 6\"></path><path d=\"m18 9-6 6\"></path>"
},
"x": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-x",
"h": "<path d=\"M18 6 6 18\"></path><path d=\"m6 6 12 12\"></path>"
},
"brush-cleaning": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-brush-cleaning",
"h": "<path d=\"m16 22-1-4\"></path><path d=\"M19 14a1 1 0 0 0 1-1v-1a2 2 0 0 0-2-2h-3a1 1 0 0 1-1-1V4a2 2 0 0 0-4 0v5a1 1 0 0 1-1 1H6a2 2 0 0 0-2 2v1a1 1 0 0 0 1 1\"></path><path d=\"M19 14H5l-1.973 6.767A1 1 0 0 0 4 22h16a1 1 0 0 0 .973-1.233z\"></path><path d=\"m8 22 1-4\"></path>"
},
"scroll-text": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-scroll-text",
"h": "<path d=\"M15 12h-5\"></path><path d=\"M15 8h-5\"></path><path d=\"M19 17V5a2 2 0 0 0-2-2H4\"></path><path d=\"M8 21h12a2 2 0 0 0 2-2v-1a1 1 0 0 0-1-1H11a1 1 0 0 0-1 1v1a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v2a1 1 0 0 0 1 1h3\"></path>"
},
"package": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-package",
"h": "<path d=\"M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z\"></path><path d=\"M12 22V12\"></path><polyline points=\"3.29 7 12 12 20.71 7\"></polyline><path d=\"m7.5 4.27 9 5.15\"></path>"
},
"link": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-link",
"h": "<path d=\"M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71\"></path><path d=\"M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71\"></path>"
},
"user-plus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-user-plus",
"h": "<path d=\"M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2\"></path><circle cx=\"9\" cy=\"7\" r=\"4\"></circle><line x1=\"19\" x2=\"19\" y1=\"8\" y2=\"14\"></line><line x1=\"22\" x2=\"16\" y1=\"11\" y2=\"11\"></line>"
},
"minus": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-minus",
"h": "<path d=\"M5 12h14\"></path>"
},
"chevron-left": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-chevron-left",
"h": "<path d=\"m15 18-6-6 6-6\"></path>"
},
"share16": {
"p": {
"fill": "none",
"height": "16",
"viewBox": "0 0 16 16",
"width": "16"
},
"c": "size-4",
"h": "<path d=\"M7.95865 1.52332C7.95864 0.826701 8.76031 0.46845 9.27645 0.875675L9.375 0.967658L15.1315 7.18405C15.558 7.64466 15.558 8.35661 15.1315 8.81723L9.375 15.0336C8.8701 15.5785 7.95864 15.221 7.95865 14.478V10.8212C7.1059 10.8437 6.31337 10.9321 5.45444 11.252C4.3946 11.6468 3.18224 12.4135 1.64652 13.943C1.45306 14.1355 1.18305 14.1701 0.968842 14.0913C0.747236 14.0096 0.547063 13.7884 0.548346 13.4849L0.554916 13.132C0.61868 11.3499 1.11129 9.29885 2.27632 7.63834C3.45265 5.96194 5.2953 4.71682 7.95865 4.54844V1.52332ZM9.20887 5.13413C9.20875 5.50614 8.90286 5.77734 8.56499 5.77802C5.99359 5.78329 4.33712 6.87667 3.2994 8.35543C2.54495 9.43061 2.10715 10.7288 1.91496 11.9944C3.04725 11.0328 4.05666 10.439 5.01893 10.0806C6.29614 9.60496 7.44036 9.5639 8.56405 9.56342C8.91756 9.56327 9.2087 9.84956 9.20887 10.2073L9.20793 13.3742L14.1835 8.00064L9.20793 2.62618L9.20887 5.13413Z\" fill=\"currentColor\"></path>"
},
"copy": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-copy",
"h": "<rect width=\"14\" height=\"14\" x=\"8\" y=\"8\" rx=\"2\" ry=\"2\"></rect><path d=\"M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2\"></path>"
},
"refresh-cw": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-refresh-cw",
"h": "<path d=\"M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8\"></path><path d=\"M21 3v5h-5\"></path><path d=\"M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16\"></path><path d=\"M8 16H3v5\"></path>"
},
"save": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-save",
"h": "<path d=\"M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z\"></path><path d=\"M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7\"></path><path d=\"M7 3v4a1 1 0 0 0 1 1h7\"></path>"
},
"arrow-down": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-arrow-down",
"h": "<path d=\"M12 5v14\"></path><path d=\"m19 12-7 7-7-7\"></path>"
},
"ring": {
"p": {
"viewBox": "0 0 20 20"
},
"c": "size-4 -rotate-90",
"h": "<circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" class=\"opacity-25\"></circle><circle cx=\"10\" cy=\"10\" r=\"8\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"3\" stroke-dasharray=\"50.26548245743669\" stroke-dashoffset=\"49.260172808287955\" stroke-linecap=\"round\"></circle>"
},
"pencil-off": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-pencil-off",
"h": "<path d=\"m10 10-6.157 6.162a2 2 0 0 0-.5.833l-1.322 4.36a.5.5 0 0 0 .622.624l4.358-1.323a2 2 0 0 0 .83-.5L14 13.982\"></path><path d=\"m12.829 7.172 4.359-4.346a1 1 0 1 1 3.986 3.986l-4.353 4.353\"></path><path d=\"m15 5 4 4\"></path><path d=\"m2 2 20 20\"></path>"
},
"rotate-ccw": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-rotate-ccw",
"h": "<path d=\"M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8\"></path><path d=\"M3 3v5h5\"></path>"
},
"loader-circle": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-loader-circle",
"h": "<path d=\"M21 12a9 9 0 1 1-6.219-8.56\"></path>"
},
"message-circle-warning": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-message-circle-warning",
"h": "<path d=\"M2.992 16.342a2 2 0 0 1 .094 1.167l-1.065 3.29a1 1 0 0 0 1.236 1.168l3.413-.998a2 2 0 0 1 1.099.092 10 10 0 1 0-4.777-4.719\"></path><path d=\"M12 8v4\"></path><path d=\"M12 16h.01\"></path>"
},
"ban": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-ban",
"h": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M4.929 4.929 19.07 19.071\"></path>"
},
"res-doc": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-file-text scale-110",
"h": "<path d=\"M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z\"></path><path d=\"M14 2v5a1 1 0 0 0 1 1h5\"></path><path d=\"M10 9H8\"></path><path d=\"M16 13H8\"></path><path d=\"M16 17H8\"></path>"
},
"res-image": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "currentColor"
},
"c": "remixicon scale-125 fill-rose-500",
"h": "<path d=\"M21 7L16 2H3.9934C3.44495 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.556 21 21.0082V7ZM11 9.5C11 10.3284 10.3284 11 9.5 11C8.67157 11 8 10.3284 8 9.5C8 8.67157 8.67157 8 9.5 8C10.3284 8 11 8.67157 11 9.5ZM17.5 17H8L13.5 10L17.5 17Z\"></path>"
},
"res-audio": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "#6567F0"
},
"c": "remixicon scale-125",
"h": "<path d=\"M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM11 12.05C10.8384 12.0172 10.6712 12 10.5 12C9.11929 12 8 13.1193 8 14.5C8 15.8807 9.11929 17 10.5 17C11.8807 17 13 15.8807 13 14.5V10H16V8H11V12.05Z\"></path>"
},
"res-folder": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "currentColor",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-folder",
"h": "<path d=\"M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z\"></path>"
},
"res-pdf": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "#F26D55"
},
"c": "remixicon scale-125",
"h": "<path d=\"M3.9985 2C3.44749 2 3 2.44405 3 2.9918V21.0082C3 21.5447 3.44476 22 3.9934 22H20.0066C20.5551 22 21 21.5489 21 20.9925L20.9997 7L16 2H3.9985ZM10.5 7.5H12.5C12.5 9.98994 14.6436 12.6604 17.3162 13.5513L16.8586 15.49C13.7234 15.0421 10.4821 16.3804 7.5547 18.3321L6.3753 16.7191C7.46149 15.8502 8.50293 14.3757 9.27499 12.6534C10.0443 10.9373 10.5 9.07749 10.5 7.5ZM11.1 13.4716C11.3673 12.8752 11.6043 12.2563 11.8037 11.6285C12.2754 12.3531 12.8553 13.0182 13.5102 13.5953C12.5284 13.7711 11.5666 14.0596 10.6353 14.4276C10.8 14.1143 10.9551 13.7948 11.1 13.4716Z\"></path>"
},
"res-link": {
"p": {
"width": "24",
"height": "24",
"viewBox": "0 0 24 24",
"fill": "none",
"stroke": "#4876ff",
"strokeWidth": "2",
"strokeLinecap": "round",
"strokeLinejoin": "round"
},
"c": "lucide lucide-globe",
"h": "<circle cx=\"12\" cy=\"12\" r=\"10\"></circle><path d=\"M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20\"></path><path d=\"M2 12h20\"></path>"
},
"res-video": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "#FF9100"
},
"c": "remixicon scale-125",
"h": "<path d=\"M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM15.0008 11.667L10.1219 8.41435C10.0562 8.37054 9.979 8.34717 9.9 8.34717C9.6791 8.34717 9.5 8.52625 9.5 8.74717V15.2524C9.5 15.3314 9.5234 15.4086 9.5672 15.4743C9.6897 15.6581 9.9381 15.7078 10.1219 15.5852L15.0008 12.3326C15.0447 12.3033 15.0824 12.2656 15.1117 12.2217C15.2343 12.0379 15.1846 11.7895 15.0008 11.667Z\"></path>"
},
"res-md": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "#8F959E"
},
"c": "remixicon scale-125",
"h": "<path d=\"M3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20V4C2 3.44772 2.44772 3 3 3ZM7 15.5V11.5L9 13.5L11 11.5V15.5H13V8.5H11L9 10.5L7 8.5H5V15.5H7ZM18 12.5V8.5H16V12.5H14L17 15.5L20 12.5H18Z\"></path>"
},
"res-zhihu": {
"p": {
"viewBox": "0 0 24 24",
"width": "24",
"height": "24",
"fill": "#0084FF"
},
"c": "",
"h": "<path d=\"M5.721 0C2.251 0 0 2.25 0 5.719V18.28C0 21.751 2.252 24 5.721 24h12.56C21.751 24 24 21.75 24 18.281V5.72C24 2.249 21.75 0 18.281 0zm1.964 4.078c-.271.73-.5 1.434-.68 2.11h4.587c.545-.006.445 1.168.445 1.171H9.384a58.104 58.104 0 01-.112 3.797h2.712c.388.023.393 1.251.393 1.266H9.183a9.223 9.223 0 01-.408 2.102l.757-.604c.452.456 1.512 1.712 1.906 2.177.473.681.063 2.081.063 2.081l-2.794-3.382c-.653 2.518-1.845 3.607-1.845 3.607-.523.468-1.58.82-2.64.516 2.218-1.73 3.44-3.917 3.667-6.497H4.491c0-.015.197-1.243.806-1.266h2.71c.024-.32.086-3.254.086-3.797H6.598c-.136.406-.158.447-.268.753-.594 1.095-1.603 1.122-1.907 1.155.906-1.821 1.416-3.6 1.591-4.064.425-1.124 1.671-1.125 1.671-1.125zM13.078 6h6.377v11.33h-2.573l-2.184 1.373-.401-1.373h-1.219zm1.313 1.219v8.86h.623l.263.937 1.455-.938h1.456v-8.86z\"></path>"
},
"res-word": {
"p": {
"viewBox": "0 0 24 24",
"width": "16",
"height": "16",
"fill": "#5599F2"
},
"c": "remixicon scale-125",
"h": "<path d=\"M16 2L21 7V21.0082C21 21.556 20.5551 22 20.0066 22H3.9934C3.44476 22 3 21.5447 3 21.0082V2.9918C3 2.44405 3.44495 2 3.9934 2H16ZM14 8V12.989L12 11L10.0108 13L10 8H8V16H10L12 14L14 16H16V8H14Z\"></path>"
}
};
