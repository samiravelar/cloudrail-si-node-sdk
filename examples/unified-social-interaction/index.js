const http = require("http");
const cloudrail = require("cloudrail-si");

const port = 8082; // or any other free port on the local machine

cloudrail.Settings.setKey("[Your CloudRail Key]");

const facebook = new cloudrail.services.Facebook(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Facebook Client Identifier]", "[Facebook Client Secret]",
    "http://localhost:" + port + "/", "someState");

const facebookpage = new cloudrail.services.FacebookPage(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Facebook Page Identifier]", "[Facebook Client Identifier]", "[Facebook Client Secret]",
    "http://localhost:" + port + "/", "someState");

const twitter = new cloudrail.services.Twitter(
    cloudrail.RedirectReceivers.getLocalAuthenticator(port),
    "[Twitter Client Identifier]", "[Twitter Client Secret]",
    "http://localhost:" + port + "/");


var service;
const serviceString = process.argv[2];
switch(serviceString) {
  case "twitter":
  case "tw":
    service = twitter;
    break;
  case "facebook":
  case "fb":
    service = facebook;
    break;
  case "facebookpages":
  case "fbpages":
  case "pages":
    service = facebookpages;
    break;
  default:
    service = facebook;
}

var updateString = "";
if (process.argv.length > 3) {
  updateString = process.argv.slice(3).join(" ");
} else {
  updateString = "hello from CloudRail";
}

service.login(
  (error) => {
    if (error) {
      console.log(error);
    } else {
      service.postUpdate(
        updateString,
        (error) => {
          if (error) {
            console.log(error);
          } else {
            console.log("posted update");
            service.logout((error) => { if (error) { console.log(error); }});
          }
        }
      );
    }
  }
);
