const express = require('express')
const request = require('request');
const cheerio = require('cheerio');
const phantom = require('phantom');

const app = express();

app.use(express.static('public'));
app.use(express.static(__dirname + '/node_modules'));

app.get('/weather/:location', function (req, res) {
    const url = `https://www.theweathernetwork.com/ca/search?q=${req.params.location}`

    request(url, function (error, response, html) {
        if (!error) {
            // utilize the cheerio library on the returned html which will essentially give us jQuery functionality
            var $ = cheerio.load(html);
            var exact_match = $('.exact_match');
            if (exact_match.length > 0) {
                var url1 = $($('ul .result')[1]).find('a').attr('href');
            } else {
                var url1 = $($('ul .result')[0]).find('a').attr('href');
            }
            console.log(url1);
        }
        const url_next = `https://www.theweathernetwork.com${url1}`;
        console.log(url_next);

        (async function () {
            const instance = await phantom.create();
            const page = await instance.createPage();
            const status = await page.open(url_next);
            page.evaluate(function () {
                var weatherObj = {};
                var currentDate = new Date();
                var dateTime = currentDate.getDate() + "/" + (currentDate.getMonth() + 1) + "/" + currentDate.getFullYear() + " @ " + currentDate.getHours() + ":" + currentDate.getMinutes() + ":" + currentDate.getSeconds();
                weatherObj.locationName = document.getElementById('h1_title').innerText;
                weatherObj.temparature = document.getElementsByClassName('temperature')[0].textContent;
                weatherObj.icon = document.getElementsByClassName('weather-icon')[0].children[0].src;
                weatherObj.condition = document.getElementsByClassName('condition')[0].textContent;
                var metrics = document.getElementsByClassName('metric');
                weatherObj.humidity = metrics[2].nextSibling.textContent;
                weatherObj.windSpeed = metrics[0].nextSibling.textContent;
                weatherObj.date = dateTime;
                weatherObj.comments = [];
                return weatherObj;
            }).then(function (weather) {
                console.log(JSON.stringify(weather));
                res.send(weather);
                instance.exit();
            });
        })();

    });

});


const port = 8080;
app.listen(process.env.PORT || port, () => {
    console.log(`Running port on ${port}`)
});




