const assert = require('assert');
const lookup = require('.');

describe('host lookup', () => {
  it('looks up a single host', async () => {
    let ips = await lookup('localhost:11211');
    assert.ok(ips.includes('127.0.0.1'));
    ips = await lookup('127.0.0.1');
    assert.ok(ips.includes('127.0.0.1'));
    ips = await lookup('localhost');
    assert.ok(ips.includes('127.0.0.1'));
  });

  it('looks up a multiple hosts', async () => {
    let ips = await lookup(['localhost:11211', 'localhost']);
    assert.ok(ips.includes('127.0.0.1'));
    ips = await lookup(['localhost']);
    assert.ok(ips.includes('127.0.0.1'));
    ips = await lookup(['127.0.0.1']);
    assert.ok(ips.includes('127.0.0.1'));
  });

  it('throws when passing URLs', async () => {
    try {
      let ips = await lookup(['http://google.com', 'https://facebook.com']);
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'invalid host');
    }

    try {
      let ips = await lookup('https://google.com');
      assert.fail();
    } catch(err) {
      assert.equal(err.message, 'invalid host');
    }
  });
});
