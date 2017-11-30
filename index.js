const url = require('url');
const dns = require('dns');
const isIP = require('is-ip');
const { promisify } = require('util');
const { flatten } = require('lodash');
const plookup = promisify(dns.lookup);

async function getIPs(host='') {
  // deletes the port from hostname:port if present
  // url.parse() doesnt work here because it always expects a protocol in the URL
  if (host.match(/^.*:\/\//)) throw new Error('invalid host');
  let hostname = host.replace(/:\d+/i, '');
	if (isIP(hostname)) {
    return hostname;
  }
  const results = await plookup(hostname, { all: true });
  return results.map(result => result.address);
}

module.exports = async function lookup(hosts) {
  if (Array.isArray(hosts)) {
    const ips = await Promise.all(hosts.map(getIPs));
    return flatten(ips);
  }
	return await getIPs(hosts);
};
