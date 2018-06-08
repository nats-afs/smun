<template lang="pug">
  v-app#inspire
    v-navigation-drawer(fixed, :clipped='$vuetify.breakpoint.mdAndUp', app, v-model='drawer')
      v-list(dense)
        template(v-for='item in items')
          v-layout(row, v-if='item.heading', align-center, :key='item.heading')
            v-flex(xs6)
              v-subheader(v-if='item.heading')
                | {{ item.heading }}
            v-flex.text-xs-center(xs6)
              a.body-2.black--text(href='#!') EDIT
          v-list-group(v-else-if='item.children', v-model='item.model', :key='item.text', :prepend-icon="item.model ? item.icon : item['icon-alt']", append-icon)
            v-list-tile(slot='activator')
              v-list-tile-content
                v-list-tile-title
                  | {{ item.text }}
            v-list-tile(v-for='(child, i) in item.children', :key='i', :to='{name: child.path}')
              v-list-tile-action(v-if='child.icon')
                v-icon {{ child.icon }}
              v-list-tile-content
                v-list-tile-title
                  | {{ child.text }}
          v-list-tile(v-else, :key='item.text', :to='{name: item.path}')
            v-list-tile-action
              v-icon {{ item.icon }}
            v-list-tile-content
              v-list-tile-title
                | {{ item.text }}
    v-toolbar(color='blue darken-3', dark, app, :clipped-left='$vuetify.breakpoint.mdAndUp', fixed)
      v-toolbar-title.ml-0.pl-3(style='width: 300px')
        v-toolbar-side-icon(@click.stop='drawer = !drawer')
        span.hidden-sm-and-down {{app}}
      v-spacer
      v-btn(icon)
        v-icon apps
      v-btn(icon)
        v-icon notifications
      v-menu(offset-y,v-if="isLoggedIn")
        v-btn(slot='activator', icon, dark)
          v-avatar
            img(:src="currentUser.photoURL", :alt="currentUser.displayName")
        v-list
          v-list-tile(@click="logout")
            v-list-tile-title Cerrar Sesion
    v-content
      v-flex(xs12)
        .elevation-5
          v-breadcrumbs.py-1(divider='/')
            v-breadcrumbs-item.caption(v-for='item in levelList', :key='item.text', :disabled='item.disabled')
              | {{ item.meta.title }}
      v-container(fluid, fill-height)
        v-layout(row, wrap)
          v-flex(xs12)
            router-view
    v-btn(fab, bottom, right, color='pink', dark, fixed, @click.stop='dialog = !dialog')
      v-icon add
    v-dialog(v-model='dialog', width='1000px')
      claimant-form
        v-btn(@click.native='close') cancelar
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import claimantForm from "@/components/ClaimantForm";
export default {
  components: {
    // dashboard,
    claimantForm
  },
  data: () => ({
    app: "WP HUACHIPA",
    dialog: false,
    drawer: null,
    items: [
      { icon: "dashboard", text: "Dashboard", path: "home" },
      // { icon: "history", text: "Frequently contacted" },
      // { icon: "content_copy", text: "Duplicates" },
      {
        icon: "keyboard_arrow_up",
        "icon-alt": "keyboard_arrow_down",
        text: "Solicitantes",
        model: true,
        children: [
          { icon: "add", text: "Nuevo Solicitante", path: "claimants-form" },
          { icon: "list", text: "Listar Solicitantes", path: "claimants-list" }
        ]
      }
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "Categorias",
      //   model: false,
      //   children: [
      //     { icon: "add", text: "Nueva categoria", path: "category-form" },
      //     { icon: "list", text: "Listar categorias", path: "category-list" }
      //   ]
      // },
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "Notas",
      //   model: false,
      //   children: [
      //     { icon: "add", text: "Nueva Nota", path: "note-form" },
      //     { icon: "list", text: "Listar Notas", path: "note-list" }
      //   ]
      // },
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "Eventos",
      //   model: false,
      //   children: [
      //     { icon: "add", text: "Nuevo Evento", path: "event-form" },
      //     { icon: "list", text: "Listar Eventos", path: "event-list" }
      //   ]
      // },
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "Documentos",
      //   model: false,
      //   children: [
      //     { icon: "add", text: "Nuevo Documento", path: "document-form" },
      //     { icon: "list", text: "Listar Documentos", path: "document-list" }
      //   ]
      // },
      // {
      //   icon: "keyboard_arrow_up",
      //   "icon-alt": "keyboard_arrow_down",
      //   text: "Lugares",
      //   model: false,
      //   children: [
      //     { icon: "add", text: "Nuevo Lugar", path: "place-form" },
      //     { icon: "list", text: "Listar Lugares", path: "place-list" }
      //   ]
      // }
      // { icon: "settings", text: "Ajustes", path: "settings" }
      // { icon: "help", text: "Help" },
      // { icon: "phonelink", text: "App downloads" },
      // { icon: "keyboard", text: "Go to the old version" }
    ],
    levelList: null
  }),
  created() {
    this.getBreadcrumb();
  },
  watch: {
    $route() {
      this.getBreadcrumb();
    }
  },
  computed: {
    ...mapGetters(["isLoggedIn", "currentUser"])
  },
  methods: {
    ...mapActions(["logout"]),
    close() {
      this.dialog = false;
    },
    getBreadcrumb() {
      let matched = this.$route.matched.filter(item => item.name);
      const first = matched[0];
      if (first && first.name !== "dashboard") {
        matched = [{ path: "/dashboard", meta: { title: "Inicio" } }].concat(
          matched
        );
      }
      this.levelList = matched;
    }
  }
};
</script>