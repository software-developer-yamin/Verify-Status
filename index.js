require("dotenv").config();
const {
  checkBirthPortalStatus,
  checkBankAsiaPortalStatus,
  makeHttpsRequestThroughSocksProxy,
} = require("./thirdPartyApisMethods");

(async () => {
  try {
    let url = process.env.BANK_ASIA_PROXY_URL;
    const [hostname, port] = url.split(":");
    const proxy = {
      host: hostname,
      port: port,
    };
    const status = {};

    const birthResponse = await checkBirthPortalStatus(
      process.env.BIRTH_REGISTRATION_PORTAL_URL
    );
    const bankResponse = await checkBankAsiaPortalStatus(
      process.env.BANK_ASIA_LOGIN_URL,
      proxy
    );
    const nidResponse = await makeHttpsRequestThroughSocksProxy(
      process.env.NID_REGISTRATION_PORTAL_URL,
      proxy
    );
    // Determine if the responses were successful
    status.birth_status = birthResponse.status === 200 ? true : false;
    status.bank_status = bankResponse.status === 200 ? true : false;
    status.nid_status = nidResponse;
    console.log("🚀 ~ checkStatus ~ status:", status);
  } catch (error) {
    console.log("🚀 ~ checkStatus ~ error:", error);
  }
})();
