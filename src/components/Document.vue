<template>
  <div class="elevation-5">
    <v-breadcrumbs divider="/" >
      <v-breadcrumbs-item v-for="item in items" :key="item.text" :disabled="item.disabled">
        {{ item.text }}
      </v-breadcrumbs-item>
    </v-breadcrumbs>
    <router-view></router-view>
  </div>
</template>
<script>
export default {
  data: () => ({
    items: [
      {
        text: "Documentos",
        disabled: false
      },
      {
        text: "Nuevo",
        disabled: false
      },
      {
        text: "Link 2",
        disabled: true
      }
    ]
  })
};
</script>
