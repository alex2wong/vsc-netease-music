/**
 * proxy to receive client CROSS ORIGIN request,
 * then request resource and response to client.
 */
var http = require("http");

var strategies = {
    "image": 1,
    "stream": 1,
    "pro": 1,
    'audio': 1,
}

var Proxy = function (req, res) { 
    // just proxy the client request.
    var target = req.url.slice(req.url.indexOf('proxyURI=') + 9)
    // thisPlace should first check localFile if exists, res localFile directly..
    http.get(target, function(response) {  
        console.warn("Proxy got response: " + response.statusCode);
        res.setHeader("Content-Type", response.headers["content-type"]);
        res.setHeader('Access-Control-Allow-Origin', '*');
        // res.setHeader('Access-Control-Allow-Credentials', 'true');
    //     Accept-Ranges: bytes
	// Access-Control-Allow-Credentials: true
	// Access-Control-Allow-Methods: GET, POST, OPTIONS
        var buffer = [];
        response.on('data', (chunk) => {
            // typeof chunk ?? Buffer?
            buffer.push(chunk);                
        });
        response.on('end', () => {
            // Buffer toString. 'ascii'/'base64'
            var buff = Buffer.concat(buffer);
            for(var k in strategies) {
                // ready to save buffer to localFile..
                try {
                    // var fileName = encodeURIComponent(target.replace("/", "_")) + "." + ext;
                    // fs.exists(finalName, function(exists) {
                    //     if (exists) {
                    //         res.sendFile(finalName, {
                    //             root: __dirname
                    //         });
                    //     } else {
                    //         fs.writeFileSync("./Asset/tiles/" + fileName, buff);
                    //         res.sendFile(finalName, {
                    //             root: __dirname
                    //         });
                    //     }
                    // });
                    console.warn('Proxy returned content..');
                    res.end(buff);
                    
                    return;
                } catch (error) {
                    console.error("proxyImage error.");
                    res.end("proxyImage error.");
                }
            }
            res.end(buff.toString());
        });
    }).on('error', function(e) {  
        console.error("Proxy got error: " + e.message);
    });
}

module.exports = Proxy;