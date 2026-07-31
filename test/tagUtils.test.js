const test = require('node:test');
const assert = require('node:assert/strict');
const { normalizeTags, makeTagSlug } = require('../src/utils/tagUtils');

test('normalizeTags supports arrays, strings, and hashtag prefixes', () => {
  assert.deepEqual(normalizeTags(['#生活', '工作']), ['生活', '工作']);
  assert.deepEqual(normalizeTags('生活, 工作'), ['生活', '工作']);
  assert.deepEqual(normalizeTags('#生活 #工作'), ['生活', '工作']);
});

test('makeTagSlug creates URL-friendly slugs', () => {
  assert.equal(makeTagSlug('生活記錄'), '生活記錄');
  assert.equal(makeTagSlug('Hello World'), 'hello-world');
});
