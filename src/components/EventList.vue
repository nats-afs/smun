<template>
  <v-card>
    <v-card-title>
      Eventos
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialog" max-width="1000px">
      <eventform :edit="edit" :item="item">
        <v-btn @click.native="close">cancelar</v-btn>
      </eventform>
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
        <td>{{ props.item.description }}</td>
        <td>{{ props.item.dateInit }}</td>
        <td>{{ props.item.createAt }}</td>
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
import { eventRef } from "../config/firebaseConfig";
import eventform from "./EventForm";
export default {
  components: {
    eventform
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
      { text: "Descripcion", value: "description" },
      { text: "Fecha Evento", align: "left", value: "dateInit" },
      { text: "Fecha de Creacion", value: "createAt" },
      { text: "Imagenes", value: "gallery" },
      { text: "Acciones", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {
      title: null,
      description: null,
      imageName: null,
      imageValue: null,
      dateInit: this.getdate,
      createAt: this.getdate,
      gallery: []
    },
    delete: null
  }),
  created() {
    this.loading = true;
    eventRef.on("value", snapshot => {
      this.fetchEvents(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  methods: {
    fetchEvents(key, news) {
      this.items = [];
      for (let key in news) {
        this.items.push({
          uid: key,
          title: news[key].title,
          description: news[key].description,
          dateInit: news[key].dateInit,
          createAt: news[key].createAt,
          imageName: news[key].imageName,
          imageValue: news[key].imageValue,
          gallery: news[key].gallery? news[key].gallery : []
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
      eventRef
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

