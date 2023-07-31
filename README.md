# lambda-edge-libinjection

This might be crazy, but I am curious how this would perform.

A simple NodeJS L@E attempting to detect SQLi using libinjection in:
 * Query parameters
 * Request body (form)
 * Request body (JSON)

It's just a POC, do not use anywhere in production.

To build and run:

```
docker build -t gdemarcsek:libinject-lambda . && docker run -p 9000:8080 gdemarcsek:libinject-lambda
```

In a separate terminal:

```
curl -XPOST "http://localhost:9000/2015-03-31/functions/function/invocations" -d @viewer-request.json
{"statusCode":403,"body":"<html><head><title>Forbidden</title></head><body>Forbidden</body></html>"}⏎
```

To deploy, you will need to create a ZIP archive of the lambda inside the container and deploy that because L@E does not support Docker images. 

