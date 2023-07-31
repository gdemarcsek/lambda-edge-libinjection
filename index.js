// Simple POC lambda function using libinjection to block SQLi

const addon             = require('bindings')('is_sqli');
const querystring       = require('node:querystring'); 
const simdjson          = require('simdjson');
const MAX_JSON_DEPTH    = 5

function denied(accept_header) {
    if (accept_header.toLowerCase() === "application/json") {
        return({status: '403', body: JSON.stringify({"result": "error", "status": "Forbidden"})});
    } else {
        return({status: '403', body: '<html><head><title>Forbidden</title></head><body>Forbidden</body></html>'});
    }
}

function* traverse(obj, f, depth) {
    for (let k in obj) {
      if (typeof obj[k] == "object" && depth < MAX_JSON_DEPTH) {
        yield traverse(obj[k], f, depth + 1);
      } else {
        let result = f(JSON.stringify(obj[k]));
        yield result;
      }
    }
}

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const accept_header = headers.accept[0].value || "text/html";
    
    // Inspect query strings
    const queryParams = querystring.parse(request.querystring);
    for (value of Object.values(queryParams)) {
        if (addon.is_sqli(value)) {
            callback(null, denied(accept_header));
            return;
        }
    }

    // Inspect body
    const body = Buffer.from(request.body.data, 'base64').toString();

    if (body) {
        if (body[0] === '{') {
            const o = simdjson.parse(body);
            let it = traverse(o, (value) => addon.is_sqli(value), 1);
            let result = it.next();
            while (!result.done) {
                if (result.value === true) {
                    callback(null, denied(accept_header));
                    return;
                }
                result = it.next();
            }
        } else {
            const bodyParams = querystring.parse(body);
            for (value of Object.values(bodyParams)) {
                if (addon.is_sqli(value)) {
                    callback(null, denied(accept_header));
                    return;
                }
            }
        }
    }

    callback(null, request);
};

