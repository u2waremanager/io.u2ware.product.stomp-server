import $common from "@/assets/apis/common.js";
import $caccountsStore from "@/assets/stores/accounts.js";

const name = "[/assets/apis/accounts.js]";

const $accountsApi = {

  api: {

    execute(optionsBuilder) {
      return $common.meta
        .env("VITE_API_ACCOUNTS", "VITE_API_TOKEN")
        .then(optionsBuilder)
        .then((e) => {
          return $common.api.execute(e);
        })
        .then((e) => {
          return $common.api.then(e);
        })
        .catch((e) => {
          throw $common.api.catch(e);
        });
    },

    url(env, data) {
      if (typeof data == "object") {
        return `${data._links.self.href}`;
      } else {
        return `${env["VITE_API_ACCOUNTS"]}${data}`;
      }
    },    

    token(env, token){
      let t = env["VITE_API_TOKEN"];
      // let token = t == undefined ? $commonStore.computed.oauth2.get() : t;
      return t;
    },    

    headers(env, headers) {
      let token = $contentsApi.api.token(env);
      return $common.api.headers(headers, token);
    },

    params(env, params){
      let token = $contentsApi.api.token(env);
      return $common.api.params(params, token);
    },

    query(env, query) {
      let token = $contentsApi.api.token(env);
      return $common.api.query(query, token);
    },    

    pageable(data) {
      return $common.api.pageable(data);
    },

  },


  ////////////////////////////////////
  // APIs (Oath2)
  ////////////////////////////////////  
  oauth2: {
    providers() {
      return $accountsApi.api.execute((e) => ({
        method: "GET",
        url: $accountsApi.api.url(e, "/oauth2/providers")  
      }));
    },

    userinfo() {
      return $accountsApi.api.execute((e) => ({
        method: "GET",
        url: $accountsApi.api.url(e, "/oauth2/userinfo") ,
        headers: $accountsApi.api.headers(e, {}),
      }));
    },

    // login(query){
    //   return $accountsApi.api.execute((uri) => ({
    //     url: `${uri}/oauth2/userinfo`,
    //     headers: $common.api.auth(query, undefined, "headers"),
    //   }))
    //   .then(r=>{
    //     $accountsStore.computed.oauth2.set(query);
    //     return $accountsStore.computed.oauth2.get();
    //   });
    // },

    // logout() {
    //   return $accountsApi.api.execute((uri) => ({
    //     url: `${uri}/oauth2/logout`,
    //     headers: $accountsApi.api.headers(),
    //   }))
    //   .finally((r) => {
    //     $accountsStore.computed.oauth2.set(undefined);
    //   });
    // },
  },

    
}
export default $accountsApi;
