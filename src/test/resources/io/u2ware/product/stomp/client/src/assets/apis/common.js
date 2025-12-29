import qs from "qs";
import $axios from "axios";

const name = "[/assets/apis/common.js]";

const $common = {

  ////////////////////////////////////
  // api Utils..
  ////////////////////////////////////
  api : {
    
    execute(options) {
      options["paramsSerializer"] = (p)=>{
        return qs.stringify(p, { arrayFormat: "repeat" });
      },
      options["timestamp"] = new Date().getTime();
      if (options.data) console.log(options.timestamp, options.url, options.data);
      else console.log(options.timestamp, options.url);
      return $axios(options);
    },

    then(r) {
      if (r && r.config) {
        let options = r.config;
        let headers = r.headers;
        if (headers["content-type"].includes("json")) {
          console.log(options.timestamp, options.url, r.status);
        } else {
          console.log(options.timestamp, options.url, "Not JSON");
          throw 404;
        }
      }
      return r.data;
    },

    catch(e) {
      if (e && e.response && e.response.config) {
        let options = e.response.config;
        console.log(options.timestamp, options.url, e.response.status, options);
        throw e.response.status;
      }
      if (e && e.config) {
        let options = e.config;
        console.log(options.timestamp, options.url, "Network Error");
        throw 404;
      }
      throw e;
    },

    headers(headers, token){
      if(token == undefined) {
        return (headers == undefined) ? {} : headers;
      }
      if (headers == undefined) {
        return { Authorization: `Bearer ${token}` };
      } else {
        headers["Authorization"] = `Bearer ${token}`;
        return headers;
      }
    },

    params(params, token){
      if(token == undefined) {
        return (params == undefined) ? {} : params;
      }

      if (params == undefined) {
        return { access_token: `${token}` };
      } else {
        params["access_token"] = `${token}`;
        return params;
      } 
    },

    query(query, token){
      if(token == undefined) {
        return (query == undefined) ? "" : query;
      }
      if (query == undefined) {
        let params = { access_token: `${token}` };
        return qs.stringify(params, { arrayFormat: "repeat" });

      } else {
        let params = qs.parse(query);
        params["access_token"] = `${token}`;
        return qs.stringify(params, { arrayFormat: "repeat" });
      } 
    },

    pageable(data) {
      if (!data) return {};
      const sort = [];
      if (data.sortBy != undefined) {
        data.sortBy.forEach((s, i) => {
          sort.push(s.key + "," + s.order);
        });
      }
      let pageRequest = {
        size: data.itemsPerPage,
        page: data.page - 1,
        sort: sort,
      };
      return pageRequest;
    },
  },



  ////////////////////////////////////
  // Meta Utils..
  ////////////////////////////////////
  meta : {

    env() {

      return $axios({
        method : 'OPTIONS',
        url: "/vite",
      })
      .then((r) => {
        // console.log(1, arguments, r.data);
        let result = {};
        for(let i=0; i < arguments.length; i++) {

          let p = `${arguments[i].toLowerCase()}`;
          p = p.startsWith("vite_") ? p.substr(5) : p;
          p = p.replaceAll('_', '.');

          let value = r.data[p];

          if(value == undefined) {
            let k = `${arguments[i].toUpperCase()}`;
            k = k.startsWith("VITE_") ? k : `VITE_${k}`;
            value = import.meta.env[k];
            // console.log(21, k, value);

          }else{
            // console.log(22, p, value);
          }
          result[arguments[i]] = value;
        }
        return result;
      })
      .catch((e) => {
        // console.log(2, arguments, e);

        let result = {};
        for(let i=0; i < arguments.length; i++) {

          let k = `${arguments[i].toUpperCase()}`;
          k = k.startsWith("VITE_") ? k : `VITE_${k}`;
          value = import.meta.env[k];
          // console.log(21, k, value);
        }
        return result;
      });
    },

    jwt(token){
      let base64Payload = token.split('.')[1];
      let base64 = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
      let decodedJWT = JSON.parse(
            decodeURIComponent(
              window
                .atob(base64)
                .split('')
                .map(function (c) {
                  return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
                })
                .join('')
        )
      );
      return decodedJWT;
    },


    href(pathnames, protocols) {

      if(pathnames == undefined) return undefined;

      console.log(window.location);
      let hostname = window.location.hostname;
      let port = window.location.port;
      let host = window.location.host;
      let protocol = window.location.protocol;

      let origin = window.location.origin;
      let pathname = window.location.pathname;
      let href = window.location.href; 

      // protocol: "https:"
      // hostname: "192.168.75.107"
      // port: "3000"
      // host: "192.168.75.107:3000"
      // origin: "https://192.168.75.107:3000"
      // pathname: "/contents/83151238-fda2-4feb-93bc-a11b94a38f1d/11"
      // href: "https://192.168.75.107:3000/contents/83151238-fda2-4feb-93bc-a11b94a38f1d/11"

      if(protocols == undefined) {
        return `${origin}${pathnames}`;
      }else{
        return `${protocols}://${host}${pathnames}`;
      }
    }
  }
}
export default $common;