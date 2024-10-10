<template>
  <div class="row q-px-lg">
    <div class="section-title col-4">Comptes</div>

    <div class="around q-pa-md">
      <div class="utilisateur">
        <div>Léonard</div>
        <div>Président</div>
        <div>leonard.seidlitz</div>
        <ChangePassword />
        <q-btn icon="eva-trash-outline" />
      </div>

      <div style="width: 100%; display: flex; justify-content: center">
        <AjouterAdmin />
      </div>
    </div>
  </div>
</template>

<script>
import ChangePassword from "./ChangePassword.vue";
import AjouterAdmin from "./AjouterAdmin.vue";
export default {
  name: "EditConnexions",
  components: { ChangePassword, AjouterAdmin },
};
</script>

<style scoped>
.around {
  border: 1px solid white;
  border-radius: 10px;
  height: 60vh;
  width: 100%;
}

.utilisateur {
  width: 100%;
  display: flex;
  justify-content: space-between;
}
</style>
