import assert from 'node:assert/strict';
const nativeFetch = globalThis.fetch;
const calls = [];
// Dummy keys guarantee this test never needs a user's credentials; all provider HTTP calls are mocked.
process.env.FREE_MODELS_ONLY = 'false';
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.GEMINI_API_KEY = '';
process.env.GROQ_API_KEY = '';
process.env.OPENROUTER_API_KEY = '';
process.env.DEEPSEEK_API_KEY = '';
process.env.QWEN_API_KEY = '';
process.env.GROK_API_KEY = '';
process.env.MISTRAL_API_KEY = '';
process.env.PORT = process.env.PORT || '31987';
globalThis.fetch = async (url, options = {}) => {
  const target = String(url);
  if (target.startsWith('https://api.openai.com/')) {
    const body = JSON.parse(options.body || '{}');
    calls.push({ provider: 'openai', url: target, body });
    if (process.env.MOCK_OPENAI_FAIL === '1') return new Response(JSON.stringify({ error: { message: 'Invalid API key provided.' } }), { status: 503 });
    return new Response(JSON.stringify({ output_text: 'mock-openai-ok' }), { status: 200 });
  }
  if (target.startsWith('https://api.anthropic.com/')) {
    calls.push({ provider: 'claude', url: target, body: JSON.parse(options.body || '{}') });
    return new Response(JSON.stringify({ content: [{ type: 'text', text: 'mock-claude-ok' }] }), { status: 200 });
  }
  return nativeFetch(url, options);
};
await import('../server.js');
await new Promise(resolve => setTimeout(resolve, 300));
const api = payload => nativeFetch(`http://127.0.0.1:${process.env.PORT}/api/multi-ai/chat`, {
  method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(payload)
});
try {
  let response = await api({ provider: 'openai', model: 'gpt-6-astra', message: 'routing test' });
  let data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.provider, 'openai'); assert.equal(data.model, 'gpt-6-astra');
  assert.equal(calls.at(-1).url, 'https://api.openai.com/v1/responses'); assert.equal(calls.at(-1).body.model, 'gpt-6-astra');
  response = await api({ provider: 'claude', model: 'claude-sonnet-5-5', message: 'routing test' });
  data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.provider, 'claude');
  assert.equal(calls.at(-1).url, 'https://api.anthropic.com/v1/messages'); assert.equal(calls.at(-1).body.model, 'claude-sonnet-5-5');
  process.env.MOCK_OPENAI_FAIL = '1';
  const previousCount = calls.length;
  response = await api({ provider: 'openai', model: 'gpt-6-astra', message: 'must not fallback' });
  data = await response.json();
  assert.equal(response.status, 500); assert.equal(calls.length, previousCount + 1);
  assert.match(data.error, /ChatGPT Pro API key/); assert.doesNotMatch(data.error, /Gemini/);
  assert.deepEqual((data.attempts || []).map(x => x.provider), ['openai']);
  process.env.MOCK_OPENAI_FAIL = '1';
  const beforeAuto = calls.length;
  response = await api({ provider: 'auto', message: 'ordinary request' });
  data = await response.json();
  assert.equal(response.status, 200); assert.equal(data.provider, 'claude');
  const autoCalls = calls.slice(beforeAuto);
  assert.deepEqual(autoCalls.map(x => x.provider), ['openai', 'claude']);
  assert.equal(autoCalls[0].body.model, 'gpt-6.1-sol');
  assert.equal(autoCalls[1].body.model, 'claude-opus-5-5');
  console.log("PASS: Responses API; Anthropic adapter; explicit provider errors retain correct brand; Auto fallback uses provider-specific model IDs.");
} finally { process.exit(0); }
