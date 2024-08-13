const { checkBirthPortalStatus, checkBankAsiaPortalStatus , makeHttpsRequestThroughSocksProxy} = require('./thirdPartyApisMethods');


(async () => {
  try {
    const [
      BANK_ASIA_PROXY_URL,
      BIRTH_REGISTRATION_PORTAL_URL,
      BANK_ASIA_LOGIN_URL,
      NID_REGISTRATION_PORTAL_URL,
    ] = process.argv.slice(2);

    const [hostname, port] = BANK_ASIA_PROXY_URL.split(":");
    const proxy = {
      host: hostname,
      port: port,
    };
    const status = {};

    const birthResponse = await checkBirthPortalStatus(
      BIRTH_REGISTRATION_PORTAL_URL
    );
    const bankResponse = await checkBankAsiaPortalStatus(
      BANK_ASIA_LOGIN_URL,
      proxy
    );
    const nidResponse = await makeHttpsRequestThroughSocksProxy(
      NID_REGISTRATION_PORTAL_URL,
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
