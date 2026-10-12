const fetch = require('node-fetch');
(async () => {
  const res = await fetch('http://localhost:3000/api/multi-ai/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "nhiet do hom nay" })
  });
  console.log(await res.json());
})();
