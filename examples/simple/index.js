var cloudrail = require("cloudrail-si");

cloudrail.Settings.setKey("57d17803ba5899023b15c136");

var googlePlaces = new cloudrail.services.GooglePlaces(null, "AIzaSyBO1nbR0ZaDct5po9vwXapteN7gsQkCEGQ"); // replace "xxx" with a valid API key

googlePlaces.getNearbyPOIs(49.4557091, 8.5279138, 3000, "sparkasse", ["bank"], (err, pois) => {
    if (err) console.log(err);
    else console.log("Amount of locations called 'sparkasse' in a 3km radius around the given coordinates, tagged with category 'bank': " + pois.length);
});