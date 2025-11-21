import Database from 'better-sqlite3';

// 1. データベースを起動（メモリ上に作成）
// ':memory:' にすると、アプリを再起動するたびにリセットされるので、
// 誰かにデータを壊されても勝手に直る「最強のハッキング演習環境」になります。
const db = new Database(':memory:');

// 2. テーブル（表）を作る
db.exec(`
  CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT
  )
`);

// 3. 初期データ（管理者）を入れる
// ここがハッキングのターゲットになります！
const stmt = db.prepare('INSERT INTO users (username, password) VALUES (?, ?)');
stmt.run('admin', 'FLAG{YOU_FOUND_SECRET_DATA}'); // 管理者のパスワード（＝宝物）

console.log('データベースの準備完了！管理者を登録しました。');

export default db;