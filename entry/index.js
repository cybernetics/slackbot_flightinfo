module.exports = function (context, req) {
    
    var https = require('https');

    var input = JSON.stringify(req.body);
    var command = input.split('&')[7].split('=')[1];
    var userquery = input.split('&')[8].split('=')[1];
    var callback = input.split('&')[9].split('=')[1];
    var username = input.split('&')[6].split('=')[1];

    // define function to call other Azure function to get the weather
    function getMetar(icaocode) {

        context.log(`https://dogithub.azurewebsites.net/api/metarSlackbot?icao=${icaocode}&callback=${callback}`);

        https.get(`https://dogithub.azurewebsites.net/api/metarSlackbot?icao=${icaocode}&callback=${callback}`, function (res) {
            var body = ''; // Will contain the final response
            // Received data is a buffer.
            // Adding it to our body
            res.on('data', function (data) {
                body += data;
            });
            // After the response is completed, parse it and log it to the console
            res.on('end', function () {
                var parsed = JSON.parse(body);
                context.log(parsed);
            });
        })
            // If any error has occured, log error to console
            .on('error', function (e) {
                context.log("Got error: " + e.message);
            });
    }

    function getFlightStatus(flightnumber) {
        context.log(`https://dogithub.azurewebsites.net/api/flightStatus?flightnumber=${flightnumber}&callback=${callback}`);
    }

    context.log('Command was %s', command); 
    context.log('Input was %s', userquery);
    
    if (command == '/metar') {

        context.bindings.response = `Hello ${username}, I am getting your weather for ${userquery}, try again if you have not heard back in 20s.`;

        getMetar(userquery);

        context.done();
    }
    else if (command == '/flightstatus') {
        getFlightStatus(userquery);
        context.done();
    }
};