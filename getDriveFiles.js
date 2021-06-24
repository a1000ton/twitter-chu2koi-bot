const { google } = require("googleapis");
const tweetImage = require("./twitterMethods");

const listFolders = (auth) => {
  const drive = google.drive({ version: "v3", auth });
  var fileId = "1BNOp9IBD_yzRrZ008WGxtLpSWXwqk63_";

  listFiles(drive, fileId);
};

const listFiles = (drive, fileId) => {
  drive.files.list(
    {
      pageSize: 1000,
      fileId: fileId,
      fields: "nextPageToken, files(id, name, parents, mimeType, modifiedTime)",
      q: `'${fileId}' in parents`,
    },
    (err, res) => {
      if (err) {
        console.log("The API returned an error: " + err);
      }

      const files = res.data.files;
      const randomFileNumber = Math.floor(Math.random() * files.length + 0);

      const file = files[randomFileNumber];

      if (file.mimeType === "application/vnd.google-apps.folder") {
        listFiles(drive, file.id);
      } else {
        publishImage(drive, file);
      }
    }
  );
};

const publishImage = (drive, file) => {
  drive.files.get(
    {
      fileId: file.id,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
      encoding: null,
    },
    function (err, response) {
      if (err) console.log(err);
      else {
        var base64 = new Buffer.from(response.data, "utf8").toString("base64");
        tweetImage(base64);
      }
    }
  );
};

module.exports = listFolders;
