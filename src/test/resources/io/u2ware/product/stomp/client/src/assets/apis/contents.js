import $common from "@/assets/apis/common.js";
import $contentsStore from "@/assets/stores/contents.js";

const name = "[/assets/apis/contents.js]";

const $contentsApi = {
  api: {

    execute(optionsBuilder) {
      return $common.meta
        .env("VITE_API_CONTENTS", "VITE_API_TOKEN")
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
        return `${env["VITE_API_CONTENTS"]}${data}`;
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

    href(pathnames, protocols){
      return $common.meta.env("VITE_API_TOKEN")
      .then(env=>{
        let href = $common.meta.href(pathnames, protocols);
        let token = $contentsApi.api.token(env);
        let query = $common.api.query(undefined, token);
        return `${href}?${query}`;
      })
    },
  },

  /////////////////////////////////////
  //
  /////////////////////////////////////
  oauth2: {
    info(roles) {
      return $contentsApi.api.execute((e) => ({
        method: "GET",
        url: $contentsApi.api.url(e, "/api/oauth2/userinfo"),
        headers: $contentsApi.api.headers(e, {}),        
      })).then(r => {
        $contentsStore.computed.userinfo.set(r);
        if(roles == undefined) return r;

        let hasRole = false;
        for (let role of roles) {
          if (r.roles.includes(role)) {
            hasRole = true;
            break;
          }
        }
        if (hasRole) {
          return r;
        }
        throw r;
      });
    },
  },

  /////////////////////////////////////
  //
  /////////////////////////////////////
  users: {
    search(data, params) {
      return $contentsApi.api
        .execute((e) => ({
          method: "POST",
          url: $contentsApi.api.url(e, "/api/users/search"),
          headers: $contentsApi.api.headers(e, {}),
          params: $contentsApi.api.pageable(params),
          data: data,
        }))
        .then((r) => {
          r.entitiesTotal = r.page.totalElements;
          r.entities = r._embedded.users;
          return r;
        });
    },
    create(data) {
      return $contentsApi.api.execute((e) => ({
        method: "POST",
        url: $contentsApi.api.url(e, "/api/users"),
        headers: $contentsApi.api.headers(e, {}),
        data: data,
      }));
    },
    read(data) {
      return $contentsApi.api.execute((e) => ({
        method: "POST",
        url: $contentsApi.api.url(e, data),
        headers: $contentsApi.api.headers(e, {}),
      }));
    },
    update(data) {
      return $contentsApi.api.execute((e) => ({
        method: "PUT",
        url: $contentsApi.api.url(e, data),
        headers: $contentsApi.api.headers(e, {}),
        data: data,
      }));
    },
    delete(data) {
      return $contentsApi.api.execute((e) => ({
        method: "DELETE",
        url: $contentsApi.api.url(e, data),
        headers: $contentsApi.api.headers(e, {}),
      }));
    },
  },


};

export default $contentsApi;