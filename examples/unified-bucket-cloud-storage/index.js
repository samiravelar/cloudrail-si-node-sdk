var fs = require('fs');
var cloudrail = require("cloudrail-si");
cloudrail.Settings.setKey("[Your CloudRail Key]");
var service;
//service = new cloudrail.services.AmazonS3(null, "[Your S3 Access Key ID]", "[Your S3 Secret Access Key]", "[Your AWS region]");
//service = new cloudrail.services.Backblaze(null, "[Your Backblaze Account ID]", "[Your Backblaze App Key]");
//service = new cloudrail.services.GoogleCloudPlatform(null, "[Your Google Client Email]", "[Your Google Private Key]", "[Your Google Project ID]");
//service = new cloudrail.services.MicrosoftAzure(null, "[Your Azure Account Name]", "[Your Azure Access Key]");
//service = new cloudrail.services.Rackspace(null, "[Your Rackspace User Name]", "[Your Rackspace API Key]", "[Your Rackspace Region]");

var cache = {};
cache.buckets = [];
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
      case "buckets":
        listBuckets();
        break;
      case "open":
        displayBucket(data[1]);
        break;
      case "download":
        downloadFile(data[1], data[2]);
        break;
      case "newBucket":
        createBucket(data[1]);
        break;
      case "deleteBucket":
        deleteBucket(data[1]);
        break;
      case "deleteFile":
        deleteFile(data[1], data[2]);
        break;
      case "":
        break;
      default:
        console.log("command unknown, showing help");
        showHelp();
        break;
    }
}

function showHelp() {
    console.log("Possible commands:");
    console.log("\"help\" displays this help");
    console.log("\"buckets\" displays a numbered list of your buckets");
    console.log("\"open [bucketNumber]\" displays a list of files for this bucket");
    console.log("\"download [bucketNumber] [fileNmae]\" downloads a file");
    console.log("\"newBucket [name]\" creates a new bucket with that name");
    console.log("\"deleteBucket [bucketNumber]\" deletes this bucket");
    console.log("\"deleteFile [bucketNumber] [fileName]\" deletes this file");
    console.log("");
}
function listBuckets() {
    service.listBuckets(
      (error, buckets) => {
        if (error) { console.log(error); }
        else {
          cache.buckets = [];
          for (var i=0; i < buckets.length; i++) {
            var b = buckets[i];
            console.log("bucket " + i + ": " + b.name + "    (" + b.identifier + ")");
            cache.buckets.push(buckets[i]);
          }
          console.log("");
        }
      }
    );
}
function displayBucket(bucketNumber) {
    service.listFiles(
        cache.buckets[bucketNumber],
        (error, files) => {
          if (error) { console.log(error); }
          else {
            for (var i=0; i < files.length; i++) {
              var f = files[i];
              console.log(f.fileName + "    (" + f.size + " bytes)");
            }
            console.log("");
          }
        }
    )
}
function downloadFile(bucketNumber, fileName) {
    service.downloadFile(
      fileName,
      cache.buckets[bucketNumber],
      (error, readStream) => {
        if (error) { console.log(error); }
        else {
          var writeStream = fs.createWriteStream("downloads/" + fileName, { flags : 'w' });
          readStream.pipe(writeStream);
          writeStream.on('close', function () {
            console.log('File ' + fileName + ' downloaded!\n');
          });
          console.log("");
        }
      }
    );
}
function createBucket(bucketName) {
    service.createBucket(
      bucketName,
      (error, result) => {
        if (error) { console.log(error); }
        else {
          console.log("Bucket " + result.name + " with id " + result.identifier + " created");
          listBuckets();
        }
      }
    );
}
function deleteBucket(bucketNumber) {
    service.deleteBucket(
      cache.buckets[bucketNumber],
      (error) => {
        if (error) { console.log(error); }
        else { console.log("bucket deleted\n"); }
      }
    );
}
function deleteFile(bucketNumber, fileName) {
    service.deleteFile(
      fileName,
      cache.buckets[bucketNumber],
      (error) => {
        if (error) { console.log(error); }
        else { console.log("file deleted\n"); }
      }
    );
}
