<template>
  <q-layout view="lHh Lpr lFf">
    <!-- LARGE SCREEN -->
    <q-header
      elevated
      bordered
      class="shadow-2 text-white large-screen-only"
      style="background-color: primary; height: 70px"
    >
      <q-toolbar
        class="constrain"
        style="display: flex; justify-content: space-between; height: 100%"
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

        <q-tabs v-model="tab" indicator-color="transparent" no-caps>
          <q-btn flat icon="eva-home-outline" to="/" />
          <q-route-tab name="photos" label="Photos" to="/photos" />
          <q-route-tab
            name="locations"
            label="Location SOUNDBOKS"
            to="/locations"
          />
          <q-route-tab name="devis" label="Devis" to="/devis" />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-footer
      elevated
      class="large-screen-only q-px-lg"
      style="background-color: primary; height: 50px"
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

    <!-- SMALL SCREEN -->
    <q-header
      elevated
      bordered
      class="shadow-2 text-white small-screen-only"
      style="background-color: primary; height: 8vh"
    >
      <div style="display: flex; justify-content: center">
        <q-avatar
          size="40px"
          class="row"
          style="display: flex; align-content: center"
        >
          <img :src="logo" />
        </q-avatar>
      </div>
    </q-header>

    <q-page-container class="bg-purple-3">
      <router-view />
    </q-page-container>
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
.q-toolbar
  height: 70px

.toolbar-title-font
  font-size: 25px
  font-family: "CALIBRI"

.q-footer
  display: flex
  align-items: center
  justify-content: left
  height: 50px

.footer-text
  text-align: center
  font-size: 15px
  font-family: "CALIBRI"
</style>
