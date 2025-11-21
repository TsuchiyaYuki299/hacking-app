import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { serveStatic } from '@hono/node-server/serve-static' //静的ファイルを配る機能
import db from "./db.js";
import { loginPage } from "./view.js";

const app = new Hono();

// 「/public/〜」というURLへのアクセスがあったら、実際のファイルを探しに行く設定
app.use('/public/*', serveStatic({ root: './'}))

app.get("/", (c) => {
  return c.html(loginPage)
})

app.post("/login", async (c) => {
  // ユーザーが送ってきたデータ（JSON）を受け取る
  const body = await c.req.json();
  const { username, password } = body;

  // わざと危険な書き方をする！
  // ユーザーの入力をそのままガッチャンコしてSQLを作る（普通は絶対やっちゃだめな書き方）
  const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;

  // どんなSQLが実行されるか、ターミナルに表示する（ハッキングの様子が見える！）
  console.log(`実行されるSQL： ${query}`);

  try {
    // データベースで検索を実行
    // prepare(query).get()で、結合された文字列をそのまま実行してしまいます
    const user = db.prepare(query).get();

    if (user) {
      // データが見つかった（ログイン成功！）
      return c.json({
        success: true,
        message: "ACCESS GRANTED: 管理者権限を取得しました。",
        secret: "FLAG{CONGRATULATIONS_YOU_ARE_A_HACKER}", //ご褒美のフラグ
      });
    } else {
      // データが見つからなかった（ログイン失敗！）
      return c.json(
        {
          success: false,
          message: "ACCESS DENIED: パスワードが違います。",
        },
        401
      );
    }
  } catch (error) {
    // SQLの構文エラーなどが起きた場合
    return c.json({ success: false, message: `エラー発生: ${error}` }, 500);
  }
});

const port = parseInt(process.env.PORT || "3000"); // GCPの指定があれば使い、なければ3000を使う
console.log(`Server is running on port ${port}`);

serve({
  fetch: app.fetch,
  port: port,
});
