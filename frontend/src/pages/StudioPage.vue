<template>
  <q-page>
    <q-img :src="fond" style="height: 80vh">
      <q-card>STUDIO PAGE</q-card>
    </q-img>
  </q-page>
</template>

<script>
import fond from "src/assets/Fond.jpg";
export default {
  name: "DevisPage",
  data() {
    return {
      fond,
    };
  },
};
</script>
