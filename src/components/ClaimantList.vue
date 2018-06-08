<template lang="pug">
  v-card
    v-card-title
      | Noticias
      v-spacer
      v-text-field(append-icon='search', label='Buscar', single-line='', hide-details='', v-model='search')
    v-dialog(v-model='dialog', max-width='1000px')
      claimant-form(:edit='edit', :item='item')
        v-btn(@click.native='close') cancelar
    v-dialog(v-model='modal', persistent='', max-width='290')
      v-card
        v-card-title.headline Borrar Registro?
        v-card-text Una vez eliminado el registro no hay vuelta atras
        v-card-actions
          v-spacer
          v-btn(color='blue darken-1', flat='', @click.native='modal = false') Cancelar
          v-btn(color='blue darken-1', flat='', @click.native='deleteItem()') Aceptar
    v-data-table.elevation-1(:headers='headers', :items='items', :search='search', :loading='loading')
      template(slot='items', slot-scope='props')
        td {{ props.item.name }}
        td {{ props.item.doc }}
        td {{ props.item.nroDoc }}
        td {{ props.item.phone }}
        td {{ props.item.email }}
        td {{ props.item.distrito }}
        td {{ props.item.via}} {{ props.item.nro }}
        td.justify-center.layout.px-0
          v-btn.mx-0(icon='', @click='editItem(props.item)')
            v-icon(color='teal') edit
          v-btn.mx-0(icon='', @click='confirm(props.item.uid)')
            v-icon(color='pink') delete
      template(slot='pageText', slot-scope='{ pageStart, pageStop }')
        | De {{ pageStart }} a {{ pageStop }}

</template>
<script>
import { claimantRef } from "@/config/firebaseConfig";
import claimantForm from "./ClaimantForm";
export default {
  components: {
    claimantForm
  },
  data: () => ({
    loading:false,
    contain: true,
    tmp: "",
    search: "",
    pagination: {},
    dialog: false,
    modal: false,
    headers: [
      { text: "Solicitante", align: "left", value: "claimant" },
      { text: "DNI/RUC", value: "doc" },
      { text: "Nro. Documento", value: "nroDoc" },
      { text: "Telefono", align: "left", value: "phone" },
      { text: "Email", value: "email" },
      { text: "Distrito", value: "distrito" },
      { text: "Direccion", value: "via" },
      { text: "Acciones", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {},
    delete: null
  }),
  created() {
    this.loading = true;
    claimantRef.on("value", snapshot => {
      this.fetchModels(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  computed:{
    
  }, 
  methods: {
    fetchModels(key, news) {
      this.items = [];
      for (let key in news) {
        this.items.push({
          uid: key,
          name: news[key].name,
          doc : news[key].doc,
          nroDoc: news[key].nroDoc,
          phone: news[key].phone,
          email: news[key].email,
          distrito: news[key].distrito,
          via: news[key].via
          // imagen: 7,
        });
      }
    },
    close() {
      this.dialog = false;
    },
    editItem(item) {
      this.item = item;
      this.edit = true;
      this.dialog = true;
    },
    confirm(item) {
      this.modal = true;
      this.delete = item;
    },
    deleteItem() {
      this.modal = false;
      claimantRef
        .child(this.delete)
        .remove()
        .then(console.log("Registro eliminado"));
      this.delete = null;
    },
    previewImage(event) {
      var input = event.target;
      if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = e => {
          this.item.image = e.target.result;
        };
        reader.readAsDataURL(input.files[0]);
      }
    }
  }
};
</script>