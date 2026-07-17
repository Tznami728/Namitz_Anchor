const test = require("node:test");
const assert = require("node:assert/strict");
const { addVideoContainerClass } = require("../src/utils/addVideoContainerClass");

test("adds vedio-container class to YouTube iframes", () => {
  const input = '<p>Example</p><iframe src="https://www.youtube.com/embed/demo"></iframe>';
  const output = addVideoContainerClass(input);

  assert.match(output, /<iframe[^>]*class="vedio-container"/i);
});

test("preserves existing classes and adds the new one", () => {
  const input = '<iframe class="existing-frame" src="https://www.youtube.com/embed/demo"></iframe>';
  const output = addVideoContainerClass(input);

  assert.match(output, /class="existing-frame vedio-container"/i);
});

test("does not modify non-YouTube iframes", () => {
  const input = '<iframe src="https://example.com/embed"></iframe>';
  const output = addVideoContainerClass(input);

  assert.equal(output, input);
});
