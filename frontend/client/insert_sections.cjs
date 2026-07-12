const mysql = require('mysql2/promise');
(async () => {
  const conn = await mysql.createConnection({host:'localhost', user:'root', password:'123456', database:'lms_toeic'});
  await conn.query("INSERT IGNORE INTO sections (title, slug, description, order_index, is_active) VALUES ('Từ vựng TOEIC', 'tu-vung-toeic', 'Từ vựng', 1, 1), ('Ngữ pháp TOEIC', 'ngu-phap-toeic', 'Ngữ pháp', 2, 1), ('Luyện Nghe', 'luyen-nghe', 'Listening', 3, 1), ('Luyện Đọc', 'luyen-doc', 'Reading', 4, 1)");
  console.log('Sections inserted');
  process.exit(0);
})();
