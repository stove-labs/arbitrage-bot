import {add, subtract} from '../src/math-tools';

var assert = require('assert');

describe('math-tools', function () {
  context('smoke test', function () {
    it('add should add two numbers together', function (done) {
      assert.strictEqual(add(100,200),300);
      done();
    });
    it('subtract should subtract one number from another', function (done) {
      assert.strictEqual(subtract(100,200),-100);
      done();
    });
  });
});