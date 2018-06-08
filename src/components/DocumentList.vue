<template>
  <v-card>
    <v-card-title>
      Documentos
      <v-spacer></v-spacer>
      <v-text-field append-icon="search" label="Buscar" single-line hide-details v-model="search"></v-text-field>
    </v-card-title>
    <v-dialog v-model="dialog" max-width="1000px">
      <documentform :edit="edit" :item="item">
        <v-btn @click.native="close">cancelar</v-btn>
      </documentform>
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
        <td>{{ props.item.createAt }}</td>
        <td>{{ props.item.publicAt }}</td>
        <td>{{ props.item.docName }}
          <v-btn icon :href="props.item.docValue" target="_blank">
            <v-icon color="teal">file_download</v-icon>
          </v-btn>
        </td>
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
import { docsRef } from "../config/firebaseConfig";
import documentform from "./DocumentForm";
export default {
  components: {
    documentform
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
      { text: "Fecha Publicacion", align: "left", value: "publicAt" },
      { text: "Fecha de Creacion", value: "createAt" },
      { text: "Archivo", align: "left", value: "docName" },
      { text: "Acciones", value: "name", sortable: false }
    ],
    items: [],
    edit: false,
    item: {
      title: null,
      description: null,
      docName: null,
      docValue: null,
      createAt: this.getdate,
      publicAt: this.getdate
    },
    delete: null
  }),
  created() {
    this.loading = true;
    docsRef.on("value", snapshot => {
      this.fetchDocuments(snapshot.key, snapshot.val());
      this.loading = false;
    });
  },
  methods: {
    fetchDocuments(key, docs) {
      this.items = [];
      for (let key in docs) {
        this.items.push({
          uid: key,
          title: docs[key].title,
          description: docs[key].description,
          createAt: docs[key].createAt,
          publicAt: docs[key].publicAt,
          docName: docs[key].docName,
          docValue: docs[key].docValue
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
      docsRef
        .child(this.delete)
        .remove()
        .then(console.log("Registro eliminado"));
      this.delete = null;
    }
  }
};
</script>
