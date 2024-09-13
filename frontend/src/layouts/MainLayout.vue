<template>
  <q-layout view="lHh Lpr lFf" class="full-height-layout">
    <q-header
      elevated
      class="text-white"
      style="background-color: primary; height: 10vh"
    >
      <q-toolbar
        class="constrain"
        style="
          display: flex;
          justify-content: space-between;
          height: 100%;
          padding: 0;
        "
      >
        <div
          style="display: flex; align-items: center"
          @click="$router.push('/')"
          class="cursor-pointer"
        >
          <q-avatar size="50px" class="q-ma-lg">
            <img :src="logo" />
          </q-avatar>

          <q-toolbar-title class="q-ma-xs toolbar-title-font">
            Musique Mix
          </q-toolbar-title>
        </div>

        <q-tabs
          v-model="tab"
          no-caps
          class="q-mr-md"
          inline-label
          align="right"
          style="min-width: 200px"
        >
          <q-btn flat icon="eva-home-outline" to="/" />
          <q-route-tab name="photos" label="Photos" to="/photos" />
          <q-route-tab name="locations" label="Locations" to="/locations" />
          <q-route-tab name="demandes" label="Demandes" to="/demandes" />
          <q-route-tab name="studio" label="Studio" to="/studio" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-page-container
      class="bg-purple-3"
      style="flex-grow: 1; min-height: calc(100vh - 15vh - 5vh)"
    >
      <router-view />
    </q-page-container>

    <q-footer
      elevated
      bordered
      class="q-px-lg"
      style="background-color: primary; height: 5vh"
    >
      <div
        style="
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          height: 100%;
        "
      >
        <h6 class="footer-text">
          Association de musique du Pôle Léonard de Vinci
        </h6>
        <div class="row" style="display: flex; align-items: center">
          <div style="opacity: 0.5">Hot Blood, love is gonna get ya</div>
          <div class="q-px-md">
            <q-btn
              flat
              round
              dense
              icon="la la-instagram"
              href="https://www.instagram.com/musiquemix_/"
              target="_blank"
            />
            <q-btn
              flat
              round
              dense
              icon="la la-youtube"
              href="https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag"
              target="_blank"
            />
          </div>
        </div>
      </div>
    </q-footer>
  </q-layout>
</template>

<script>
import logo from "src/assets/Logo.jpg";
import { ref } from "vue";

export default {
  name: "MainLayout",
  data() {
    return {
      logo,
      tab: ref("mails"),
    };
  },
};
</script>

<style lang="sass">
.full-height-layout
  display: flex
  flex-direction: column
  height: 100vh

.toolbar-title-font
  font-size: 25px
  font-family: "CALIBRI"

.q-footer
  display: flex
  align-items: center
  justify-content: left
  height: 5vh

.footer-text
  text-align: center
  font-size: 15px
  font-family: "CALIBRI"
</style>
