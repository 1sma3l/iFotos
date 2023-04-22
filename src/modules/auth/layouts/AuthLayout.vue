<template>
  <q-layout>
    <q-page-container>
      <q-page>
        <img src="~assets/wave.svg" class="wave" alt="login-wave" />
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script>
export default {};
</script>

<style scoped>
.wave {
  position: fixed;
  height: 100%;
  left: 0;
  bottom: 0;
  z-index: -1;
}
</style>
