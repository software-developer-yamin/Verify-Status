const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
const https = require('https');
/**
* Pings a URL and measures the response time.
* @param {string} url - The URL to ping.
* @returns {Promise<object>} - A promise that resolves to an object containing the status and response time in milliseconds.
*/

async function checkBankAsiaPortalStatus(url, proxy) {
    const { host, port } = proxy;
    const socksAgentOptions = `socks5://${host}:${port}`;
    const agent = new SocksProxyAgent(socksAgentOptions);

    const start = Date.now();
    try {
        const response = await axios.get(url, { httpAgent: agent, httpsAgent: agent });
        const end = Date.now();
        return {
            status: response.status,
            responseTime: end - start
        };
    } catch (error) {
        const end = Date.now();
        return {
            status: error.response ? error.response.status : 'Error',
            responseTime: end - start
        };
    }
}
async function makeHttpsRequestThroughSocksProxy(url, proxyUrl) {
    try {
      url =url + '/login'
      const { host, port } = proxyUrl;
      const socksAgentOptions = `socks5://${host}:${port}`;
      const agent = new SocksProxyAgent(socksAgentOptions);
      const options = {
        hostname: new URL(url).hostname,
        port: 443,
        path: new URL(url).pathname,
        method: 'GET',
        agent: agent,
        rejectUnauthorized: false
      };
  
      const response = await new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
          res.on('data', (chunk) => {
            console.log(`Body: ${chunk}`);
          });
  
          res.on('end', () => {
            console.log('No more data in response.');
            resolve(res);
          });
        });
  
        req.on('error', (e) => {
          console.error(`problem with request: ${e.message}`);
          reject(e);
        });
  
        req.end();
      });
  
      return response.statusCode === 200;
    } catch (error) {
      console.error(`Error: ${error.message}`);
      return false;
    }
  }

module.exports = {
    checkBankAsiaPortalStatus,
    makeHttpsRequestThroughSocksProxy
};
