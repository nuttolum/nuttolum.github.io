const fs = require('fs');
const https = require('https');
const apiKey = fs.readFileSync('apiKey', 'utf8');

console.log(apiKey)

//get
const get = (url, callback) => {
    https.get(url, (res) => {
        let data = '';
        res.on('data', (chunk) => {
            data += chunk;
        });
        res.on('end', () => {
            callback(data);
        });
    });
};




get('https://api.nasa.gov/planetary/apod?api_key=' + apiKey, (returnData) => {
    //write data.hdurl to file as image
    const data = JSON.parse(returnData);
    console.log(data)

});