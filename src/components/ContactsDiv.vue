<template>
  <div class="bg-purple q-pa-xl row">
    <div class="col-6">
      <div style="color: white">Contact :</div>
      <div class="row" style="display: flex; align-items: center">
        <q-icon name="eva-email-outline" color="white" />
        <div style="color: white">musiquemix@edu.devinci.fr</div>
      </div>
      <div class="row" style="display: flex; align-items: center">
        <q-icon name="la la-youtube" color="white" />
        <div style="color: white" class="cursor-pointer" @click="handleClick">
          https://www.youtube.com/channel/UC0rRdwDiwU8Cnsun4EfiLag
        </div>
      </div>
    </div>
    <div
      style="display: flex; align-items: center; justify-content: end"
      class="col-6"
    >
      <q-img style="width: 10%" :src="pole" />
    </div>
  </div>
</template>

<script>
import pole from "../assets/Pole.png";
export default {
  name: "ContactsDiv",
  data() {
    return {
      pole,
    };
  },
};
</script>
