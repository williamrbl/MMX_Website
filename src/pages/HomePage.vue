<template>
  <q-page>
    <q-img
      :src="fond"
      style="height: 100vh; width: 100vw; position: relative"
      :fit="contain"
    >
      <div
        class="q-py-xl bg-purple"
        style="
          color: #ffffff;
          font-family: 'calibri';
          font-size: larger;
          width: 100%;
        "
      >
        Actualités musicales
      </div>

      <div
        class="text-white"
        style="
          display: flex;
          align-items: center;
          justify-content: center;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
        "
      >
        <HomeCarrousel />
      </div>
    </q-img>

    <div
      class="bg-purple q-pa-lg"
      style="height: 200px; display: flex; align-content: center"
    >
      <div style="color: white; font-family: 'calibri'; font-size: medium">
        Contact :
      </div>
      <div class="row q-pb-md" style="display: flex; align-items: center">
        <q-icon name="eva-email-outline" color="white" class="q-px-lg" />
        <div style="color: white; font-family: 'calibri'; font-size: small">
          musiquemix@edu.devinci.fr
        </div>
      </div>
      <div class="row q-pb-md" style="display: flex; align-items: center">
        <q-icon name="la la-youtube" color="white" class="q-px-lg" />
        <div
          style="color: white; font-family: 'calibri'; font-size: small"
          class="cursor-pointer"
          @click="console.log('ok')"
        >
          https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag
        </div>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import fond from "src/assets/Fond.jpg";
import { ref } from "vue";
import HomeCarrousel from "../components/HomeCarrousel.vue";

defineOptions({
  name: "HomePage",
  components: { HomeCarrousel },
  data() {
    return {
      fond,
    };
  },
});
</script>

<style scoped>
.welcome-text-style {
  font-family: "calibri";
  font-size: 100px;
}
</style>
