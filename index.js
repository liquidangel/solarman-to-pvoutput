const mqtt = require('mqtt');
const PVOutputAPI = require('./pvoutput_api');
const moment = require('moment');

const host = process.env.MQTT_HOST;
const port = process.env.MQTT_PORT;
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 1000
});

const topic = 'solarmanpv/inverter/attributes';
client.on('connect', () => {
  console.log('connected');
  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
});

client.on('message', (topic, payload) => {
  var JSONpayload = JSON.parse(payload.toString());
  console.log('Received Message:',topic, JSONpayload);  
  var dateStr = JSONpayload["System_Time"];
  var outputDateTime = moment(dateStr, "YY-MM-DD HH:mm:ss");
  var outputDate = outputDateTime.format('YYYYMMDD');
  var outputTime = outputDateTime.format('HH:mm');
  var energyGeneration = JSONpayload["Cumulative_Production_(Active)"] * 1000;
  var energyConsumption = JSONpayload["Cumulative_Consumption"] * 1000;
  var temperature = JSONpayload["AC_Temperature"];
  var voltage = JSONpayload["DC_Voltage_PV1"] + JSONpayload["DC_Voltage_PV2"];
  var cumulative = 1; 
    // 1-energyGeneration and energyConsumption are lifetime energy values
    // 2-only energyGeneration is lifetime energy values
    // 3-only energyConsumption is lifetime energy values
  
  const asyncAPICall = async () => {
    const response = await PVOutputAPI.addStatus(outputDate, outputTime,energyGeneration,energyConsumption,temperature,voltage,cumulative);
    console.log("response:", response.data);
  }
  asyncAPICall();
});