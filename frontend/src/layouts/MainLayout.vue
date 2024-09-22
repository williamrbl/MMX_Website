<template>
  <q-layout view="lHh Lpr lFf" class="full-height-layout">
    <q-header
      elevated
      class="text-white large-screen-only"
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

        <q-tabs v-model="tab" no-caps class="q-mr-md" style="min-width: 200px">
          <q-route-tab name="home" icon="eva-home-outline" to="/" exact />
          <q-route-tab
            name="photos"
            label="Photos"
            to="/photos"
            style="font-family: Aileron Bold"
          />
          <q-route-tab
            name="locations"
            label="Locations"
            to="/locations"
            style="font-family: Aileron Bold"
          />
          <q-route-tab
            name="demandes"
            label="Demandes"
            to="/demandes"
            style="font-family: Aileron Bold"
          />
          <q-route-tab
            name="studio"
            label="Studio"
            to="/studio"
            style="font-family: Aileron Bold"
          />
          <q-route-tab
            name="bureau"
            label="Espace Bureau"
            to="/bureau"
            exact
            style="font-family: Aileron Bold"
          />
        </q-tabs>
      </q-toolbar>
    </q-header>

    <q-header class="centered small-screen-only">
      <div
        class="row"
        style="
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
        "
      >
        <div
          @click="$router.push('/')"
          style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
          "
        >
          <q-avatar>
            <q-img :src="logo" fit="cover" />
          </q-avatar>
          <div style="font-family: Arupala Grotesk Ultra">Musique Mix</div>
        </div>
      </div>
      <q-btn
        v-if="$route.path !== '/gestionbureau'"
        flat
        dense
        icon="eva-log-in-outline"
        to="/bureau"
        style="
          font-size: 20px;
          position: absolute;
          right: 0;
          top: 50%;
          transform: translateY(-50%);
        "
      />
    </q-header>

    <q-page-container style="background-color: #800b95">
      <router-view />
    </q-page-container>

    <q-footer
      elevated
      bordered
      class="q-px-lg large-screen-only"
      style="background-color: primary; height: 10vh"
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
          <div class="hot-blood">Hot Blood, love is gonna get ya</div>
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

    <q-footer class="small-screen-only" style="height: 10vh">
      <q-tabs
        v-model="tab"
        no-caps
        class="q-mr-md"
        inline-label
        style="
          min-width: 200px;
          width: 100%;
          display: flex;
          justify-content: center;
          border-radius: 5%;
        "
      >
        <q-route-tab
          name="photos"
          label="Photos"
          to="/photos"
          style="font-family: Aileron Bold"
        />
        <q-route-tab
          name="locations"
          label="Locations"
          to="/locations"
          style="font-family: Aileron Bold"
        />
        <q-route-tab
          name="demandes"
          label="Demandes"
          to="/demandes"
          style="font-family: Aileron Bold"
        />
        <q-route-tab
          name="studio"
          label="Studio"
          to="/studio"
          style="font-family: Aileron Bold"
        />
      </q-tabs>
    </q-footer>
  </q-layout>
</template>

<script>
import logo from "src/assets/Logo.jpg";

export default {
  name: "MainLayout",
  data() {
    return {
      logo,
      tab: this.$route.name,
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
  font-family: Arupala Grotesk Ultra

.q-footer
  display: flex
  align-items: center
  justify-content: left
  height: 5vh

.footer-text
  text-align: center
  font-size: 10px
  font-family: Aileron Bold

.hot-blood
  opacity: 0.5
  font-size:15px
  font-family: Arupala Grotesk Ultra
</style>
