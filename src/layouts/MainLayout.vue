<template>
  <q-layout view="lHh Lpr lFf">

    <q-header elevated bordered class="shadow-2 bg-purple-9 text-white">
      <q-toolbar class="constrain">

          <q-avatar size="50px" class="q-ma-lg">
            <img src="https://www.devinci.fr/wordpress/wp-content/uploads/2021/07/musiqueMix.png">
          </q-avatar>


          <q-toolbar-title class="q-ma-xs toolbar-title-font">
            Musique Mix
          </q-toolbar-title>

          <q-tabs
            v-model="tab"
            indicator-color="transparent"
            no-caps
            >
              <q-route-tab name="photos" label="Photos" to="/photos"/>
              <q-route-tab name="locations" label="Location" to="/locations"/>
              <q-route-tab name="devis" label="Devis" to="/devis"/>
          </q-tabs>

          <q-btn flat icon="eva-home-outline" to="/" />

      </q-toolbar>
    </q-header>

    <q-footer elevated class="bg-purple-9">
      <h6 class="q-ma-lg footer-text">Association de musique du Pole Léonard de Vinci</h6>
    </q-footer>

    <q-page-container class="bg-purple-3">
      <router-view />
    </q-page-container>

  </q-layout>
</template>

<script>
  export default{
    name:"MainLayout",
  }

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
