var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

const nexmo = new cloudrail.services.Nexmo(null, "[Nexmo API Key]","[Nexmo API Secret]");
const twilio = new cloudrail.services.Twilio(null, "[Twilio Account SID]", "[Twilio Auth Token]");
const twizo = new cloudrail.services.Twizo(null, "[Twizo Key]");

sendSms(nexmo, "nexmo");
sendSms(twilio, "twilio");
sendSms(twizo, "twizo");

function sendSms(service, name) {
  console.log("sending from " + name);
  service.sendSMS(
    process.argv[2],
    process.argv[3],
    "CloudRail is awesome\nSent by " + name,
    (error) => {
      if (error) { console.log(error); }
    }
  );
  console.log("\n");
}
