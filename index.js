// var express = require('express');
// var app = express();
//
// const http = require('http');
// const port = 3000;
//
// const requestHandler = (request, response) => {
//     console.log(request.url);
//
//     response.end('Hello Node.js Server!')
// }
//
// app.get('/random.text', function (req, res) {
//     console.log('here in random');
//     res.send('random.text');
// })
//
// // const server = http.createServer(requestHandler);
//
// server.listen(port, (err) => {
//     if (err) {
//         return console.log('something bad happened', err)
//     }
//
//     console.log(`server is listening on ${port}`)
// })

const express = require('express');
const CiscoSpark = require('ciscospark');
const app = express();
const port = 80;//3500;
var bodyParser = require('body-parser');
// var fs = require('fs');
var htmlFile;
var bundleSpark;
var myWebHook;
var webhookRequests;

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json());

app.get('/test2', (request, response) => {
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("it works");
    response.end();
});

app.get('/createWebhook', (request, response) => {
        ciscospark.webhooks.create({
            resource: 'messages',
            event: 'created',
            filter: 'roomId=' + roomId,
            targetUrl: 'http://MYURL/webhook',
            name: 'Test Webhook'
        }).then((webhook) => {
            myWebHook = webhook;
        });
    }
);

app.post('/webhook', (request, response) => {
    //call from cisco
    console.log('webhook');
    webhookRequests = request;
    console.log(JSON.stringify(request.body));
    response.writeHead(200, {"Content-Type": "text/html"});
    response.write("ok");
    response.end();
});

app.get('/GetRequests', (request, response) => {
    console.log('getRequests: ' + JSON.stringify(request.body));
    //response.writeHead(200, {"Content-Type": "text/html"});
    //response.write(JSON.stringify(webhookRequests[webhookRequests.length - 1].body));
    response.end(JSON.stringify(request.body));
});


// app.get('/test', (request, response) => {
//     // response.send('Hello from Express!')
//     console.log('test reached');
//     fs.readFile('./frontend/index.html', function(err, data) {
//         if (err){
//             throw err;
//         }
//         htmlFile = data;
//     });
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write(htmlFile);
//     response.end();
// });
//
// app.get('/bundleSpark.js', (request, response) => {
//     // response.send('Hello from Express!')
//     console.log('bundlespark reached');
//     fs.readFile('./frontend/bundleSpark.js', function(err, data) {
//         if (err){
//             throw err;
//         }
//         bundleSpark = data;
//     });
//     response.writeHead(200, {"Content-Type": "text/html"});
//     response.write(bundleSpark);
//     response.end();
// });

app.get(`/oauth/redirect`, function(req, res) {
    console.log('redirect reached');
    console.log('req.params = ' + Object.keys(req.params));
    var spark = CiscoSpark.init({
        config: {
            credentials: {
                authorizationString: "https://api.ciscospark.com/v1/authorize?client_id=C2204180a3be71b43d00cc9404b8d373d1c3f44e3eef927261efef3ffb60a122e&response_type=code&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth%2Fredirect&scope=spark-compliance%3Amemberships_read%20spark-admin%3Aresource_groups_read%20spark%3Aall%20spark-compliance%3Amemberships_write%20spark-admin%3Apeople_write%20spark-admin%3Aroles_read%20spark-admin%3Aorganizations_read%20spark-admin%3Aresource_group_memberships_read%20spark-compliance%3Aevents_read%20spark-admin%3Aresource_group_memberships_write%20spark-compliance%3Arooms_read%20spark-compliance%3Ateam_memberships_read%20spark-compliance%3Amessages_write%20spark-compliance%3Ateam_memberships_write%20spark%3Akms%20spark-compliance%3Ateams_read%20spark-admin%3Alicenses_read%20spark-compliance%3Amessages_read%20spark-admin%3Apeople_read&state=set_state_here",
                clientType: 'confidential'
            }
        }
    });
    spark.requestAuthorizationCodeGrant(req.params)
        .then(() => {
            console.log(spark.credentials.supertoken);
            res.redirect('/#' + querystring.stringify(spark.credentials.supertoken.toJSON())).end();
        });
});

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }

    console.log(`server is listening on ${port}`)
});