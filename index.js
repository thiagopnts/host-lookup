const url = require('url');
const dns = require('dns');
const isIP = require('is-ip');
const { promisify } = require('util');
const { flatten } = require('lodash');
const plookup = promisify(dns.lookup);


async function getIPs(host='') {
  // extracts hostname from hostname:port where the host can be an IP
  // url.parse() doesnt work here because it always expects a protocol in the URL
  let hostname = host.match(/([a-z]+|(\d+|\.?)+):?(\d+)?/i)[1];
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
