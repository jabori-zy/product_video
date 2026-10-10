import { Config } from '@remotion/cli/config';
import fs from 'fs';
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(85);
Config.setCodec('h264');
Config.setCrf(23);
Config.setConcurrency(6);
const PW = '/Users/maozhengyi/Library/Caches/ms-playwright/chromium_headless_shell-1243/chrome-headless-shell-mac-arm64/chrome-headless-shell';
if (fs.existsSync(PW)) Config.setBrowserExecutable(PW);
