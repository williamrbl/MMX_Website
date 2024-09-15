<template>
  <q-page>
    <q-img :src="fond" style="height: 80vh">
      <q-card>Demandes PAGE</q-card>
    </q-img>
  </q-page>
</template>

<script>
import fond from "src/assets/Fond.jpg";
export default {
  name: "DemandesPage",
  data() {
    return {
      fond,
    };
  },
};
</script>
