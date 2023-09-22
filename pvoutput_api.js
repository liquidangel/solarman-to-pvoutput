const axios = require('axios');

const BASE_URL = 'https://pvoutput.org/service/r2';

module.exports = {
  addStatus: (ouptutDate, outputTime, energyGeneration, energyConsumption, temperature, voltage, cumulative) => axios({
    method: "POST",
    url: BASE_URL + "/addstatus.jsp",
    headers: {
      "content-type":"application/x-www-form-urlencoded",
      "X-Pvoutput-Apikey":process.env.PVOUTPUT_APIKEY,
      "X-Pvoutput-SystemId":process.env.PVOUTPUT_SYSTEMID
    },
    params: {
      d: ouptutDate,
      t: outputTime,
      v1: energyGeneration,
      v3: energyConsumption,
      v5: temperature,
      v6: voltage,
      c1: cumulative
    }
  })
}