var Twit = require("twit");

require("dotenv").config();

var tweet = new Twit({
  consumer_key: process.env.consumer_key,
  consumer_secret: process.env.consumer_secret,
  access_token: process.env.access_token,
  access_token_secret: process.env.access_token_secret,
});

const tweetImage = (base64) => {
  tweet.post(
    "media/upload",
    { media_data: base64 },
    function (err, data, response) {
      if (err) return startBot();

      var mediaIdStr = data.media_id_string;
      var altText =
        "a printscreen from the ANIME Chuunibyou demo Koi ga Shitai";
      var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } };

      tweet.post(
        "media/metadata/create",
        meta_params,
        function (err, data, response) {
          if (err) return startBot();

          var params = {
            status: "#chu2koi #中二病でも恋がしたい",
            media_ids: [mediaIdStr],
          };

          tweet.post("statuses/update", params, function (err, data, response) {
            if (err) return startBot();

            console.log(data);
          });
        }
      );
    }
  );
};

module.exports = tweetImage;
