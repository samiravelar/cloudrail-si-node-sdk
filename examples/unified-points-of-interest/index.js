var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");

const foursquare = new cloudrail.services.Foursquare(null, "[Foursquare Client Identifier]", "[Foursquare Client Secret]");
const googleplaces = new cloudrail.services.GooglePlaces(null, "[Places API Key]");
const yelp = new cloudrail.services.Yelp(null,     "[Yelp Consumer Key]", "[Yelp Consumer Secret]", "[Yelp Token]", "[Yelp Token Secret]");

findPois(foursquare, "Foursquare");
findPois(googleplaces, "Google Places");
findPois(yelp, "Yelp");

var maxResults = 5;


function findPois(poiService, poiServiceName) {
  poiService.getNearbyPOIs(
    49.4872019,
    8.4640987,
    1000,
    "pizza",
    ["restaurant"],
    (error, pois) => {
      if (error) { console.log(error); }
      else {
        console.log(poiServiceName + " found " + pois.length + " results for search term \"pizza\" in category \"restaurant\" within 1000 meters:");
        for (var i = 0; i < pois.length && i < maxResults; i++) {
          console.log(pois[i].name);
        }
        if (pois.length >= maxResults) {
          console.log("+" + (pois.length - maxResults) + " more");
        }
        console.log("");
      }
    }
  );
}
