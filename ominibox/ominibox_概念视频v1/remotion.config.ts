import { Config } from '@remotion/cli/config';
import fs from 'fs';
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setCodec('h264');
Config.setCrf(18);
Config.setConcurrency(6);
// 本机网络下载 Chrome Headless Shell 不稳定：若已有 Playwright 的 headless shell 就直接用
const PW = '/Users/maozhengyi/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
if (PW && fs.existsSync(PW)) Config.setBrowserExecutable(PW);
