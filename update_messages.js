const fs = require('fs');

const zhPath = 'messages/zh.json';
const zh = JSON.parse(fs.readFileSync(zhPath, 'utf8'));
zh.Navigation.campaign = "有奖征稿";
zh.Home.campaign_banner = "🔥 最新活动：分享你的“非完美数据”或失败实验，最高赢取 200 USD 奖励！点击查看详情 👉";
fs.writeFileSync(zhPath, JSON.stringify(zh, null, 2));

const enPath = 'messages/en.json';
const en = JSON.parse(fs.readFileSync(enPath, 'utf8'));
en.Navigation.campaign = "Call for Papers";
en.Home.campaign_banner = "🔥 New Event: Share your imperfect data or failed experiments to win up to 200 USD! Click to learn more 👉";
fs.writeFileSync(enPath, JSON.stringify(en, null, 2));

const jaPath = 'messages/ja.json';
const ja = JSON.parse(fs.readFileSync(jaPath, 'utf8'));
ja.Navigation.campaign = "懸賞論文募集";
ja.Home.campaign_banner = "🔥 新着イベント：「不完全なデータ」や失敗した実験を共有して、最高 200 USD の賞金を獲得しよう！詳細はこちら 👉";
fs.writeFileSync(jaPath, JSON.stringify(ja, null, 2));

console.log("Updated messages.");
