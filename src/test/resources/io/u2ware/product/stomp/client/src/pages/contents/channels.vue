<template>
  <v-container class="pa-4" fluid>
    <v-card>
      <v-card-title class="d-flex align-center pe-2">
        <v-icon icon="mdi-video-input-component"></v-icon> &nbsp;
        {{ $t("contents.channels.title") }}&nbsp;
      </v-card-title>

      <v-table style="height: 86vh" fixed-header density="compact">
        <thead>
          <tr>
            <th class="text-left" width="20%">Timestamp</th>
            <th class="text-left" width="20%">Principal</th>
            <th class="text-left">Payload</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in messages" :key="item.timestamp">
            <td>{{ $moment.format(item.timestamp) }}</td>
            <td>{{ item.principal }}</td>
            <td>
              <JsonViewer
                class="m-0 p-0"
                :value="item.payload"
                theme="dark"
              ></JsonViewer>
            </td>
          </tr>
        </tbody>
      </v-table>
    </v-card>
  </v-container>
</template>

<script>
const x = "[/contents/channels]";
import $stompjs from "stompjs";
import $common from "@/assets/apis/common.js";
import $contentsApi from "@/assets/apis/contents.js";
import $contentsStore from "@/assets/stores/contents.js";

export default {
  data: () => ({
    messages: [],
  }),


  mounted(){

    $contentsApi.api.href("/stomp/websocket", "ws").then(r=>{
      console.log(r);
    });
  }
};
</script>
