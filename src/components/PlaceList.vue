<template>
  <v-card>
    <v-card-title>
      Eventos
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialog" max-width="1000px">
      <placeform :edit="edit" :item="item">
        <v-btn @click.native="close">cancelar</v-btn>
      </placeform>
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
        <td>{{ props.item.title }}</td>
        <td>{{ props.item.address }}</td>
        <td>{{ miniDescription(props.item.description) }}</td>
        <td>{{ props.item.gallery.length }}</td>
        <td>
          <v-btn icon class="mx-0" @click="editItem(props.item)">
            <v-icon color="teal">edit</v-icon>
          </v-btn>
          <v-btn icon class="mx-0" @click="confirm(props.item.uid)">
            <v-icon color="pink">delete</v-icon>
          </v-btn>
        </td>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        De {{ pageStart }} a {{ pageStop }}
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { placeRef } from "../config/firebaseConfig";
import placeform from "./PlaceForm";
export default {
  components: {
    placeform
  },
  data: () => ({
    loading: false,
    contain: true,
    tmp: "",
    search: "",
    pagination: {},
    dialog: false,
    modal: false,
    headers: [
      { text: "Titulo", align: "left", value: "title" },
      { text: "Direccion", value: "address" },
      { text: "Descripcion", value: "description" },
      { text: "Imagenes", value: "gallery" },
      { text: "Acciones", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {
      title: null,
      address: null,
      description: null,
      imageName: null,
      imageValue: null,
      gallery: []
    },
    delete: null
  }),
  created() {
    this.loading = true;
    placeRef.on("value", snapshot => {
      this.fetchPlaces(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  methods: {
    fetchPlaces(key, places) {
      this.items = [];
      for (let key in places) {
        this.items.push({
          uid: key,
          title: places[key].title,
          address: places[key].address,
          description: places[key].description,
          imageName: places[key].imageName,
          imageValue: places[key].imageValue,
          gallery: places[key].gallery? places[key].gallery : []
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
      placeRef
        .child(this.delete)
        .remove()
        .then(console.log("Registro eliminado"));
      this.delete = null;
    },
    miniDescription(str){
      return str.length > 100? str.substr(0,100) + ' ...' : str
    }
  }
};
</script>

