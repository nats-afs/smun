<template>
  <v-card>
    <v-card-title>
      Categorias
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialog" max-width="1000px">
      <categoryform :edit="edit" :item="item">
        <v-btn @click.native="close">cancelar</v-btn>
      </categoryform>
    </v-dialog>
    <v-dialog v-model="modal" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Borrar Registro?</v-card-title>
        <v-card-text>Una vez eliminado el registro no hay vuelta atras</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" flat @click.native="modal = false">Cancelar</v-btn>
          <v-btn color="blue darken-1" flat @click.native="deleteItem()">Aceptar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-data-table :headers="headers" :items="items" :search="search" :loading="loading" class="elevation-1">
      <template slot="items" slot-scope="props">
        <td>{{props.item.name}}</td>
        <td class="text-xs-right">{{ props.item.description }}</td>
        <td class="justify-center layout px-0">
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="confirm(props.item.uid)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { categoryRef } from "../config/firebaseConfig";
import categoryform from './CategoryForm';
export default {
  components: {categoryform},
  data: () => ({
    loading:false,
    contain: true,
    tmp: "",
    search: "",
    pagination: {},
    dialog: false,
    modal: false,
    headers: [
      { text: "Categoria", align: "left", value: "name" },
      { text: "Descripcion", value: "description" },
      { text: "Acciones", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {},
    delete: null
  }),
  created() {
    this.loading = true;
    categoryRef.on("value", snapshot => {
      this.fetchNews(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  methods: {
    fetchNews(key, category) {
      this.items = [];
      for (let key in category) {
        this.items.push({
          value: false,
          uid: key,
          name: category[key].name,
          description: category[key].description
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
      categoryRef
        .child(this.delete)
        .remove()
        .then(console.log("Registro eliminado"));
      this.delete = null;
    }
  }
};
</script>