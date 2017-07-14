var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

var serviceString = process.argv[2].toLowerCase();
var service;

switch(serviceString) {
  case "paypal":
    service = new cloudrail.services.PayPal(null, true, "[PayPal Client Identifier]", "[PayPal Client Secret]");
    break;
  case "stripe":
    service = new cloudrail.services.Stripe(null, "[Stripe Secret Key]");
    break;
}

showHelp();

var stdin = process.openStdin();
stdin.addListener("data", function(d){ processInput(d); });

function processInput(d) {
    var data = d.toString().trim().split(" ");
    var cmd = data[0].toLowerCase();

    switch(cmd) {
      case "help":
        showHelp();
        break;
      case "charges":
        listCharges();
        break;
      case "subscriptions":
        listSubscriptions();
        break;
      case "refunds":
        listRefunds(data[1]);
        break;
      case "newcharge":
        createCharge(data);
        break;
      case "refund":
        refundCharge(data[1], data[2]);
        break;
      default:
        console.log("Unknown command. Try entering \"help\".\n");
    }
}

function showHelp() {
  console.log("Possible commands:");
  console.log("\"help\" displays this help.");
  console.log("\"charges\" displays a list of charges");
  console.log("\"refunds [chargeId]\" displays a list of refunds for this charge");
  console.log("\"newCharge [amount] [currency]\" creates a new charge");
  console.log("\"refund [chargeId] [amount]\" refunds the specified amount of that charge. Skip [amount] for a full refund.");
  console.log("");
  console.log("");
}

function listCharges() {
  var now = Date.now();
  var oneYearAgo = now - (1000*3600*24*365);

  var c = new cloudrail.types.CreditCard("123", 10, 2020, "4242424242424242", "visa", "Jon", "Doe", new cloudrail.types.Address());
  c = null;

  service.listCharges(
      oneYearAgo,
      now,
      c,
      (error, charges) => {
        if (error) { console.log(error); }
        else {
          for (var i = 0; i < charges.length; i++) {
            var date = new Date(charges[i].created * 1000);
            console.log("charge " + i + ": " + charges[i].id + " " + (charges[i].amount / 100) + charges[i].currency + " on " + date.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
          }
          console.log("");
          console.log("");
        }
      }
  );
}

function listRefunds(chargeId) {
  service.getRefundsForCharge(
    chargeId,
    (error, result) => {
      if (error) { console.log(error); }
      else  {
        if (result.length == 0) { console.log("no refunds for this charge"); }
        for (var i = 0; i < result.length; i++) {
          var refund = result[i];
          var date = new Date(refund.created * 1000);
          console.log("refunded " + (refund.amount/100) + refund.currency + " on " + date.toISOString().replace(/T/, ' ').replace(/\..+/, ''));
        }
        console.log("");
        console.log("");
      }
    }
);
}

function createCharge(data) {
  service.createCharge(
    parseInt(data[1]),
    data[2],
    new cloudrail.types.CreditCard(
        "123",
        12,
        2020,
        "4242424242424242",
        "visa",
        "Jon",
        "Doe",
        new cloudrail.types.Address(
            "Example Street 14",
            "10001",
            "US"
        )
    ),
    (error, result) => {
      if (error) { console.log(error); }
      else {
        console.log("charge created");
        listCharges();
      }
    }
  );
}

function refundCharge(chargeId, amount) {
  if (amount == null) {
    service.refundCharge(
      chargeId,
      (error, result) => {
        if (error) { console.log(error); }
        else { console.log("fully refunded charge"); }
        console.log("");
        console.log("");
      }
    );
  } else {
    service.partiallyRefundCharge(
      chargeId,
      parseInt(amount),
      (error, result) => {
        if (error) { console.log(error); }
        else { console.log("partially refunded charge");
        console.log("");
        console.log("");
        }
      }
    );
  }
}
