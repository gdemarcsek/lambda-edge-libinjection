{
  "targets": [
    {
      "target_name": "is_sqli",
      "sources": [ "is_sqli.cc", 
                  "libinjection/libinjection_sqli.c",
                  "libinjection/libinjection.h",
                  "libinjection/libinjection_sqli_data.h"],
      "include_dirs": ["./libinjection", "<!@(node -p \"require('node-addon-api').include\")"],
      "cflags!": [ "-fno-exceptions" ],
      "cflags_cc!": [ "-fno-exceptions" ],
      "defines": [ 'NAPI_DISABLE_CPP_EXCEPTIONS' ]
    }
  ]
}
