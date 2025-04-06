// api/webhook.js

import { middleware } from "@line/bot-sdk";
import { handleEvent } from './handlers/events.js'; // ← 実際に返信処理をしている関数
import { channelAccessToken, channelSecret, envName } from '../lib/env.js';

const lineConfig = {
  channelAccessToken,
  channelSecret,
};

const lineMiddleware = middleware(lineConfig);

export const config = {
  api: {
    bodyParser: false,
  },
};

