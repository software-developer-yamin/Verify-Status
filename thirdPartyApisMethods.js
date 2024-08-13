const { SocksProxyAgent } = require('socks-proxy-agent');
const axios = require('axios');
const https = require('https');
/**
* Pings a URL and measures the response time.
* @param {string} url - The URL to ping.
* @returns {Promise<object>} - A promise that resolves to an object containing the status and response time in milliseconds.
*/

async function checkBirthPortalStatus(url) {
      const agent = new https.Agent({  
        rejectUnauthorized: false
    });
    const start = Date.now();
    try {
        const response = await axios.get(url,{ httpsAgent: agent });
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
  
  // Example usage
  // const proxyUrl = 'socks5://127.0.0.1:8157';
  // const targetUrl = 'https://192.168.249.10/partner-portal/login';
  
  // makeHttpsRequestThroughSocksProxy(targetUrl, proxyUrl)
  //   .then((success) => {
  //     console.log(`Request successful: ${success}`);
  //   })
  //   .catch((error) => {
  //     console.error(`Request failed: ${error}`);
  //   });
  

// async function pingUrl(url, proxy) {
//     const start = Date.now();
//     try {
//       const response = await axios.get(url, { proxy });
//       const end = Date.now();
//       console.log(`Pinged ${url} successfully. Status: ${response.status}, Response Time: ${end - start} ms`);
//       return {
//         status: response.status,
//         responseTime: end - start
//       };
//     } catch (error) {
//       const end = Date.now();
//       console.error(`Error pinging ${url}. Status: ${error.response ? error.response.status : 'Error'}, Response Time: ${end - start} ms`);
//       return {
//         status: error.response ? error.response.status : 'Error',
//         responseTime: end - start
//       };
//     }
//   }
  
//   // Example usage with SOCKS5 proxy without authentication
//   const proxy = {
//     host: '127.0.0.1',
//     port: 8157,
//     protocol: 'socks5'
//   };
  
//   pingUrl('http://10.88.14.12:8889/emob/f?p=102:825:8327446855900:::825::', proxy)
//     .then(result => {
//       console.log(`Status: ${result.status}, Response Time: ${result.responseTime} ms`);
//     })
//     .catch(err => {
//       console.error('Error pinging URL:', err);
//     });

// /**
//  * Pings a URL through a SOCKS5 proxy and measures the response time.
//  * @param {string} url - The URL to ping.
//  * @param {object} proxy - The SOCKS5 proxy configuration object.
//  * @returns {Promise<object>} - A promise that resolves to an object containing the status and response time in milliseconds.
//  */
// async function pingUrl(url, proxy) {
//   const { host, port } = proxy;
//   const socksAgentOptions = `socks5://${host}:${port}`;
//   const agent = new SocksProxyAgent(socksAgentOptions);

//   const start = Date.now();
//   try {
//     const response = await axios.request({
//       url,
//       method: 'GET',
//       httpAgent: agent,
//       httpsAgent: agent,
//       rejectUnauthorized: false, // Disable SSL certificate verification
//     });
//     const end = Date.now();
//     return {
//       status: response.status,
//       responseTime: end - start,
//     };
//   } catch (error) {
//     const end = Date.now();
//     console.log('---->',error);
//     return {
//       status: error.response ? error.response.status : 'Error',
//       responseTime: end - start,
//     };
//   }
// }

// const proxy = {
//   host: '127.0.0.1',
//   port: 8157,
// };

// pingUrl('http://192.168.249.10/partner-portal/login', proxy)
//   .then(result => {
//     console.log(`Status: ${result.status}, Response Time: ${result.responseTime} ms`);
//   })
//   .catch(err => {
//     console.error('Error pinging URL:', err);
//   });

module.exports = {
    checkBirthPortalStatus,
    checkBankAsiaPortalStatus,
    makeHttpsRequestThroughSocksProxy
};
