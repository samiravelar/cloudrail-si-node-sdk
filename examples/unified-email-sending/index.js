var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

const mailjet  = new cloudrail.services.MailJet(null, "[Mailjet API Key]", "[Mailjet API Private Key]");
const sendgrid = new cloudrail.services.SendGrid(null, "[SendGrid API Key]");

sendMail(mailjet, "MailJet");
sendMail(sendgrid, "SendGrid");

function sendMail(service, name) {
  service.sendEmail(
    process.argv[2],
    "CloudRail",
    [process.argv[3]],
    "CloudRail is awesome",
    "Hi there,\n\nGo ahead and try it yourself!",
    "<strong>Go ahead and try it yourself!</strong><br/>sent with " + name,
    [],
    [],
    (error) => {
      if (error) { console.log(error); }
    }
  );
}
