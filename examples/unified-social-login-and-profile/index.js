const cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

const port = 8082; // or any other free port on the local machine

var serviceString = process.argv[2].toLowerCase();
var service;

switch(serviceString) {
  case "facebook":
    service = new cloudrail.services.Facebook(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Facebook Client Identifier]",
      "[Facebook Client Secret]",
      "http://localhost:" + port + "/" + "/",
      "someState"
    );
    break;
  case "github":
    service = new cloudrail.services.GitHub(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[GitHub Client Identifier]",
      "[GitHub Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "googleplus":
    service = new cloudrail.services.GooglePlus(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Google Plus Client Identifier]",
      "[Google Plus Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "heroku":
    service = new cloudrail.services.Heroku(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Heroku Client Identifier]",
      "[Heroku Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "instagram":
    service = new cloudrail.services.Instagram(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Instagram Client Identifier]",
      "[Instagram Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "linkedin":
    service = new cloudrail.services.LinkedIn(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[LinkedIn Client Identifier]",
      "[LinkedIn Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "producthunt":
    service = new cloudrail.services.ProductHunt(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Product Hunt Client Identifier]",
      "[Product Hunt Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "slack":
    service = new cloudrail.services.Slack(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Slack Client Identifier]",
      "[Slack Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "twitter":
    service = new cloudrail.services.Twitter(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Twitter Client Identifier]",
      "[Twitter Client Secret]",
      "http://localhost:" + port + "/"
    );
    break;
  case "microsoftlive":
    service = new cloudrail.services.MicrosoftLive(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Windows Live Client Identifier]",
      "[Windows Live Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
  case "yahoo":
    service = new cloudrail.services.Yahoo(
      cloudrail.RedirectReceivers.getLocalAuthenticator(8082),
      "[Yahoo Client Identifier]",
      "[Yahoo Client Secret]",
      "http://localhost:" + port + "/",
      "someState"
    );
    break;
}

service.login(
  (error) => {
    if (error) {
      console.log(error);
    } else {
      var i = 0;
      service.getFullName((error, result) => {
        console.log("User       " + result);
        service.getEmail((error, result) => {
          console.log("Email      " + result);
          service.getGender((error, result) => {
            console.log("Gender     " + result);
            service.getLocale((error, result) => {
              console.log("Locale     " + result);
              service.getDateOfBirth((error, result) => {
                console.log("Birthday   " + result.day + "." + result.month + "." + result.year);
                service.getIdentifier((error, result) => {
                  console.log("Identifier " + result);
                  process.exit();
                });
              });
            });
          });
        });
      });
    }
  }
);
