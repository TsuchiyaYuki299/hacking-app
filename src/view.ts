import { html } from 'hono/html'

export const loginPage = html`
  <!DOCTYPE html>
  <html lang="ja">
  <head>
    <meta charset="UTF-8">
    <title>わくわくハッキング！ // LOGIN</title>
    <link rel="stylesheet" href="/public/style.css">
  </head>
  <body>
    <div id="opening-screen">
      <img src="/public/logo.png" id="opening-logo" alt="わくわくハッキング">
    </div>

    <div class="terminal hidden" id="main-terminal">
      <h1>SYSTEM LOGIN</h1>
      <p>SECURITY LEVEL: HIGH</p>
      
      <div>
        <label>USER:</label><br>
        <input type="text" id="username" placeholder="Enter Username"><br>
        <label>PASS:</label><br>
        <input type="text" id="password" placeholder="Enter Password"><br>
        <button onclick="hackLogin()">LOGIN</button>
      </div>

      <div id="result">
        Waiting for input...<br>
        <span style="font-size: 0.8em; opacity: 0.7;">
          &gt; HINT: Try password <strong>' OR '1'='1</strong>
        </span>
      </div>
    </div>

    <script>
      // 画面が読み込まれたらスタート
      window.onload = function() {
        setTimeout(() => {
          const opening = document.getElementById('opening-screen');
          const main = document.getElementById('main-terminal');
          
          // ふわっと消す
          opening.style.opacity = '0';
          
          // 完全に消えたらメイン画面を表示
          setTimeout(() => {
            opening.style.display = 'none';
            main.classList.remove('hidden');
            main.classList.add('fade-in');
          }, 500);
        }, 3500); // 3.5秒待機
      };

      // ログイン処理
      async function hackLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const resultDiv = document.getElementById('result');

        resultDiv.innerText = "CONNECTING...";

        const response = await fetch('/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        
        if (data.success) {
          // 成功時
          resultDiv.style.color = "cyan";
          resultDiv.innerText = ">> SUCCESS!\\n" + data.message + "\\n>> SECRET: " + data.secret;
        } else {
          // 失敗時（ここがさっき直したところ！）
          resultDiv.style.color = "red";
          resultDiv.innerHTML = 
            ">> FAILED.<br>" + 
            data.message + 
            "<br><br>" + 
            "<span style='font-size: 0.8em; opacity: 0.7; color: #ffaaaa;'>" + 
            "&gt; HINT: Try password <strong>' OR '1'='1</strong>" + 
            "</span>";
        }
      }
    </script>
  </body>
  </html>
`