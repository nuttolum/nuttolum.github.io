//require ffmpeg
const ffmpeg = require("fluent-ffmpeg");
var ffmpegPath = require("ffmpeg-static");
var ffprobePath = require("ffprobe-static").path;
ffmpeg.setFfmpegPath(ffmpegPath);
ffmpeg.setFfprobePath(ffprobePath);

const sizeInBits = 8 * 1024 * 1024 * 8;
const videoAudioRatio = 0.75;

const videoPath = "./test.mp4";
async function main() {
  ffmpeg.ffprobe(videoPath, function (err, metadata) {
    if (err) throw err;
    const isSmallerThan8mb = metadata.format.size / 1024 / 1024 < 8;
    if (isSmallerThan8mb) {
      console.log("Video is smaller than 8mb");
      return;
    } else {
      const videoDuration = Math.floor(metadata.format.duration);
      const totalBitrate = sizeInBits / videoDuration;
      const videoBitrate = totalBitrate * videoAudioRatio;
      const audioBitrate = totalBitrate - videoBitrate;
      ffmpeg(videoPath)
        .outputOptions([
          "-c:v libx264",
          "-b:v " + videoBitrate,
          "-maxrate " + videoBitrate,
          "-bufsize:v " + videoBitrate / 5,
          "-c:a aac",
          "-b:a " + audioBitrate,
          "-pass 1",
        ])
        .saveToFile("./output.mp4")
        .on("progress", function (progress) {
          //print progress.percent as a percent with 2 decimal places
          console.log(Math.floor(progress.percent * 100) / 100 + "% done");
        });
    }
  });
}

main();
