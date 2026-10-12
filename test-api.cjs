const {Client} = require('ssh2');
const conn = new Client();
conn.on('ready', () => {
  const payload = {
    message: "Chào bạn",
    provider: "auto",
    model: "gemini-2.5-flash",
    council: false,
    history: [],
    context: {
      clientTime: "21:30:00 08/10/2026",
      source: "Đặng Năm AI Chat",
      today: "Thứ Năm, 08/10/2026"
    },
    answerStyle: "detailed"
  };
  conn.exec(`curl -s -X POST http://localhost:3000/api/multi-ai/chat -H "Content-Type: application/json" -d '${JSON.stringify(payload)}'`, (err, stream) => {
    stream.on('close', () => { conn.end(); })
          .on('data', d => console.log('STDOUT: ' + d.toString()))
          .stderr.on('data', d => console.error('STDERR: ' + d.toString()));
  });
}).connect({host:'104.64.211.29',port:22,username:'root',password:'@Tuanbinh13684'});
