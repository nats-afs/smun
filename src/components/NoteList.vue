<template>
  <v-card>
    <v-card-title>
      Notas
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialog" max-width="1000px">
      <noteform :edit="edit" :item="item">
        <v-btn @click.native="close">cancelar</v-btn>
      </noteform>
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
    <v-data-table item-key="name" :headers="headers" :items="items" :search="search" :loading="loading" class="elevation-1">
      <template slot="items" slot-scope="props">
        <tr @click="props.expanded = !props.expanded">
          <td>{{props.item.name}}</td>
          <td>{{ props.item.description }}</td>
          <td>{{ props.item.children.length }}</td>
          <td class="layout px-0">
            <v-btn icon class="mx-0" @click="editItem(props.item)">
              <v-icon color="teal">edit</v-icon>
            </v-btn>
            <v-btn icon class="mx-0" @click="confirm(props.item.uid)">
              <v-icon color="pink">delete</v-icon>
            </v-btn>
          </td>
        </tr>
      </template>
      <template slot="pageText" slot-scope="{ pageStart, pageStop }">
        From {{ pageStart }} to {{ pageStop }}
      </template>
      <template slot="expand" slot-scope="props">
        <v-container>
          <v-layout row>
            <v-flex xs12>
              <span class="ml-2" v-for="child in props.item.children" :key=child.id>{{ child.name }}</span>
            </v-flex>
          </v-layout>
        </v-container>
      </template>
    </v-data-table>
  </v-card>
</template>
<script>
import { noteRef } from "../config/firebaseConfig";
import noteform from "./NoteForm";
export default {
  components: { noteform },
  data: () => ({
    loading: false,
    contain: true,
    tmp: "",
    search: "",
    pagination: {},
    dialog: false,
    modal: false,
    headers: [
      { text: "Titulo", align: "left", value: "name" },
      { text: "Descripcion", align: "left", value: "description" },
      { text: "Nro Items", align: "left", value: "children.length" },
      { text: "Acciones", align: "left", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {},
    delete: null,
    flat: true
  }),
  created() {
    this.loading = true;
    noteRef.on("value", snapshot => {
      this.fetchNotes(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  methods: {
    fetchNotes(key, notes) {
      this.items = [];
      for (let key in notes) {
        this.items.push({
          value: false,
          uid: key,
          name: notes[key].name,
          description: notes[key].description,
          children: notes[key].children
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
      noteRef
        .child(this.delete)
        .remove()
        .then(console.log("Registro eliminado"));
      this.delete = null;
    }
  }
};
</script>