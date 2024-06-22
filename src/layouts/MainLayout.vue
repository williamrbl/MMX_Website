<template>
  <q-layout view="lHh Lpr lFf">
    <q-header
      elevated
      bordered
      class="shadow-2 text-white large-screen-only"
      style="background-color: primary"
    >
      <q-toolbar class="constrain">
        <q-avatar size="50px" class="q-ma-lg">
          <img src="src/assets/Logo.jpg" />
        </q-avatar>

        <q-toolbar-title class="q-ma-xs toolbar-title-font">
          Musique Mix
        </q-toolbar-title>

        <q-tabs v-model="tab" indicator-color="transparent" no-caps>
          <q-route-tab name="photos" label="Photos" to="/photos" />
          <q-route-tab
            name="locations"
            label="Location SOUNDBOKS"
            to="/locations"
          />
          <q-route-tab name="devis" label="Devis" to="/devis" />
          <q-route-tab name="links" label="Liens Sympas" to="/links" />
        </q-tabs>

        <q-btn flat icon="eva-home-outline" to="/" />
      </q-toolbar>
    </q-header>

    <q-header
      elevated
      bordered
      class="shadow-2 text-white small-screen-only"
      style="height: 12vh; background-color: primary"
    >
      <div
        class="col"
        style="display: flex; align-content: center; justify-content: center"
      >
        <q-avatar size="40px" class="row" style="display: flex">
          <img src="src/assets/Logo.jpg" />
        </q-avatar>
      </div>
    </q-header>

    <q-footer
      elevated
      class="large-screen-only"
      style="background-color: primary"
    >
      <h6 class="q-ma-lg footer-text">
        Association de musique du Pole Léonard de Vinci
      </h6>
    </q-footer>

    <!-- <q-footer
      elevated
      class="small-screen-only"
      style="background-color: primary"
    >
      <h6 class="q-ma-lg footer-text">dioqshoo</h6>
    </q-footer> -->

    <q-page-container class="bg-purple-3">
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
export default {
  name: "MainLayout",
};
</script>

<style lang="sass">

.q-toolbar
  height:70px

.toolbar-title-font
  font-size:25px
  font-family:"CALIBRI"

.q-footer
  display: flex
  align-items: center
  justify-content: left
  height: 30px

.footer-text
  text-align: center
  font-size:15px
  font-family:"CALIBRI"
</style>
