require("dotenv").config();
const {
  checkBankAsiaPortalStatus,
  makeHttpsRequestThroughSocksProxy,
} = require("./thirdPartyApisMethods");

(async () => {
 console.log("requesting...")
  try {
    let url = process.env.BANK_ASIA_PROXY_URL;
    const [hostname, port] = url.split(":");
    const proxy = {
      host: hostname,
      port: port,
    };
    const status = {};

    const bankResponse = await checkBankAsiaPortalStatus(
      process.env.BANK_ASIA_LOGIN_URL,
      proxy
    );
    const nidResponse = await makeHttpsRequestThroughSocksProxy(
      process.env.NID_REGISTRATION_PORTAL_URL,
      proxy
    );
    // Determine if the responses were successful
    status.bank_status = bankResponse.status === 200 ? true : false;
    status.nid_status = nidResponse;
    console.log("🚀 ~ checkStatus ~ status:", status);
  } catch (error) {
    console.log("🚀 ~ checkStatus ~ error:", error);
  } finally {
    console.log("request completed");
  }
})();
