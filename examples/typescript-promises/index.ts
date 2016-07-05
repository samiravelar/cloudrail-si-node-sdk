/**
 * Demonstrates how simple a non-OAuth service can be used. Uses the bundled d.ts file for Typescript
 *
 * (mode == 0) shows how to do it the classical way with callbacks
 * (mode == 1) shows the more modern approach with Promises
 * (mode == 2) shows cutting-edge async-await (supported by TS for ES6 targets as of v1.8)
 *
 * Feel free to change mode to see that all three do the same thing
 */

/// <reference path="node_modules/cloudrail-si/index.d.ts" />
/// <reference path="bluebird.d.ts" />

import {Foursquare} from "cloudrail-si/services/Foursquare";
import {POI} from "cloudrail-si/types/POI";
import {Location} from "cloudrail-si/types/Location";
import {PointsOfInterest} from "cloudrail-si/interfaces/PointsOfInterest";
import * as Promise from "bluebird";

const mode = 2;

switch (mode) {
    case 0: callbackBased(); break;
    case 1: promiseBased(); break;
    case 2: asyncAwait(); break;
    default: console.log("Please set 'mode' to a valid value");
}

function callbackBased():void {
    let service:PointsOfInterest = new Foursquare(undefined, "xxx", "xxx"); // Replace "xxx" with valid credentials

    service.getNearbyPOIs(49.4557091, 8.5279138, 3000, "sparkasse", ["bank"], (err:Error, pois:POI[]) => {
        if (err) console.log(err);
        else {
            printPOIs(pois);
            service.getNearbyPOIs(49.4557091, 8.5279138, 800, null, ["restaurant"], (err:Error, pois:POI[]) => {
                if (err) console.log(err);
                else printPOIs(pois);
            });
        }
    });
}

function promiseBased():void {
    let service:any = new Foursquare(undefined, "xxx", "xxx"); // Replace "xxx" with valid credentials

    Promise.promisifyAll(service);

    service.getNearbyPOIsAsync(49.4557091, 8.5279138, 3000, "sparkasse", ["bank"]).then((pois:POI[]) => {
        printPOIs(pois);
        return service.getNearbyPOIsAsync(49.4557091, 8.5279138, 800, null, ["restaurant"]);
    }).then((pois:POI[]) => {
        printPOIs(pois);
    }).catch((err:Error) => {
        console.log(err);
    });
}

async function asyncAwait():Promise<void> {
    let service:any = new Foursquare(undefined, "xxx", "xxx"); // Replace "xxx" with valid credentials

    Promise.promisifyAll(service);

    try {
        let pois:POI[] = await service.getNearbyPOIsAsync(49.4557091, 8.5279138, 3000, "sparkasse", ["bank"]);
        printPOIs(pois);
        pois = await service.getNearbyPOIsAsync(49.4557091, 8.5279138, 800, null, ["restaurant"]);
        printPOIs(pois);
    } catch(err) {
        console.log(err);
    }
}

function printPOIs(pois:POI[]):void {
    pois.forEach((poi:POI) => {
        let location:Location = poi.location;
        console.log(poi.name + " at " + location.longitude + "/" + location.latitude);
    });
}