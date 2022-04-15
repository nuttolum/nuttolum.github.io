//require ffmpeg
const ffmpeg = require('fluent-ffmpeg');
var ffmpegPath = require("ffmpeg-static")
var ffprobePath = require("ffprobe-static").path
ffmpeg.setFfmpegPath(ffmpegPath)
ffmpeg.setFfprobePath(ffprobePath)
const { getVideoDurationInSeconds } = require('get-video-duration')
const fileSize = 8
const percentError = .15
function getBitrate(videoLength) {
    const finalFileSize = fileSize - (fileSize * percentError)
   var videoBitRate = (finalFileSize * 0.5)/(videoLength * .0075)
   var audioBitRate = (finalFileSize*0.5)/((videoLength*60) * 2) * 1000
   return {videoBitRate, audioBitRate}
}

async function getVideoLength(path) {
    const timeInSeconds = await getVideoDurationInSeconds(path)
    return timeInSeconds / 60
}
const videoPath = "./test.mp4"
async function main() {
const {videoBitRate, audioBitRate} = getBitrate(await getVideoLength(videoPath))
console.log(videoBitRate, audioBitRate)
var command = ffmpeg(videoPath)
.audioBitrate(audioBitRate)
.videoBitrate(videoBitRate)
.outputOptions([
    `-bufsize ${videoBitRate}k`,
])
var save = command.save('./output.mp4')
save.on("progress", function(progress) {
    console.log(progress.percent + "% done");
  });
    save.on("end", function() {
        console.log("Finished processing");
    });
}

main()