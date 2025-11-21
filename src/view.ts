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
      <img src="/public/logo.jpg" id="opening-logo" alt="わくわくハッキング">
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

      <button class="explain-btn" onclick="openModal()">[ ? ] 仕組みの解説を見る</button>
    </div>

    <dialog id="explain-dialog">
      <h2 style="margin-top:0; border-bottom: 1px solid #00ff00;">SECRET FILE: TRUTH</h2>
      <p>なぜログインできてしまったのか？</p>
      <p>通常、システムは以下の命令でチェックしています：<br>
      「パスワードが <code>一致する</code> なら通す」</p>
      
      <p>しかし、魔法の言葉 <code>' OR '1'='1</code> を入れると、命令文がこう変わってしまいます：<br>
      「パスワードが空、<strong>または、1と1が同じ</strong> なら通す」</p>
      
      <p>1と1は同じですよね(TRUE)<br>
      そのため、システムは「条件クリア！」と勘違いして、鍵を開けてしまったのです。</p>
      
      <p style="font-size: 0.8rem; color: #88ff88;">※ これが「SQLインジェクション」という有名な攻撃手法です。</p>
      
      <button class="close-btn" onclick="closeModal()">CLOSE FILE</button>
    </dialog>

    <script>
      window.onload = function() {
        setTimeout(() => {
          const opening = document.getElementById('opening-screen');
          const main = document.getElementById('main-terminal');
          opening.style.opacity = '0';
          setTimeout(() => {
            opening.style.display = 'none';
            main.classList.remove('hidden');
            main.classList.add('fade-in');
          }, 500);
        }, 3500);
      };

      function openModal() {
        document.getElementById('explain-dialog').showModal();
      }
      function closeModal() {
        document.getElementById('explain-dialog').close();
      }

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
          resultDiv.style.color = "cyan";
          resultDiv.innerText = ">> SUCCESS!\\n" + data.message + "\\n>> SECRET: " + data.secret;
        } else {
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