#include <assert.h>
#include <napi.h>

#include "libinjection/libinjection.h"
#include "libinjection/libinjection_sqli.h"

// A super thin N-API wrapper for libinjection

Napi::Boolean Method(const Napi::CallbackInfo &info)
{
  Napi::Env env = info.Env();
  if (info.Length() < 1)
  {
    Napi::TypeError::New(env, "Wrong number of arguments").ThrowAsJavaScriptException();
    return Napi::Boolean::New(env, false);
  }

  std::string arg0 = info[0].As<Napi::String>().Utf8Value();
  struct libinjection_sqli_state state;
  libinjection_sqli_init(&state, arg0.c_str(), arg0.length(), FLAG_SQL_MYSQL);
  if (libinjection_is_sqli(&state))
  {
    return Napi::Boolean::New(env, true);
  }
  else
  {
    return Napi::Boolean::New(env, false);
  }
}

Napi::Object Init(Napi::Env env, Napi::Object exports)
{
  exports.Set(Napi::String::New(env, "is_sqli"), Napi::Function::New(env, Method));
  return exports;
}

NODE_API_MODULE(is_sqli, Init)
