<template>
  <div class="row q-px-lg">
    <div class="section-title col-4">Comptes</div>

    <div class="around q-pa-md">
      <div v-for="compte in comptes" :key="compte">
        <div class="utilisateur">
          <div>{{ compte.prenom }}</div>
          <div>{{ compte.nom }}</div>
          <div>{{ compte.role }}</div>
          <div>{{ compte.username }}</div>
          <ChangePassword />
          <q-btn icon="eva-trash-outline" />
        </div>
      </div>

      <div style="width: 100%; display: flex; justify-content: center">
        <AjouterAdmin @update-comptes="getAccounts" />
      </div>
    </div>
  </div>
</template>

<script>
import ChangePassword from "./ChangePassword.vue";
import AjouterAdmin from "./AjouterAdmin.vue";
import SpinnerComponent from "../Other/SpinnerComponent.vue";
import { Loading } from "quasar";
export default {
  name: "EditConnexions",
  components: { ChangePassword, AjouterAdmin },
  data() {
    return {
      comptes: {},
    };
  },
  methods: {
    async getAccounts() {
      try {
        Loading.show({ spinner: SpinnerComponent });
        const response = await fetch(`${process.env.VUE_APP_API}/getAccounts`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        this.comptes = await response.json();
        Loading.hide();
      } catch (error) {
        console.error("Error adding admin:", error);
      }
    },
  },
  mounted() {
    this.getAccounts();
  },
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
