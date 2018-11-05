
let config={

};
if (!__DEV__) {
    config["ekt_host"] = "https://api.ekt8.io";
    config["host_first"] = "http://58.83.148.230:19951";
    config["host_second"] = "http://58.83.148.231:19951";
    config["host_third"] = "http://58.83.148.232:19951";
}else{
    config["ekt_host"] = "https://testapi.ekt8.io";
    config["host_first"] = "http://124.251.0.232:19941";
}


export const API_CONFIG = config;