# 1. ベースのイメージ（Node.js 20）
FROM node:20-alpine

# 2. 作業ディレクトリの設定
WORKDIR /app

# 3. 依存関係ファイルのコピー
COPY package.json package-lock.json ./

# 4. ライブラリのインストール
RUN npm ci

# 5. ソースコードのコピー
COPY . .

# 6. TypeScriptのビルド（HonoをJSに変換）
# ※package.jsonのscriptsに"build"があるか後で確認します
RUN npm run build

# 7. ポート公開
EXPOSE 3000

# 8. 起動コマンド（ビルドされたファイルを実行）
CMD ["node", "dist/index.js"]