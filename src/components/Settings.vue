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
        text: "Dashboard",
        disabled: false
      },
      {
        text: "Link 1",
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
