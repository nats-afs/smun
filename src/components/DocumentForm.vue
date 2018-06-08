<template>
  <v-card>
    <v-card-text>
      <v-alert color="success" icon="check_circle" :value="alert" transition="scale-transition">
        {{alertMessage}}
      </v-alert>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-container grid-list-xl>
        <v-layout row>
          <v-flex xs12>
            <v-form>
              <v-layout row>
                <v-flex xs6>
                  <v-text-field name="title" label="Titulo" v-model="item.title" :error-messages="titleErrors" :counter="40" @input="$v.item.title.$touch()" @blur="$v.item.title.$touch()"></v-text-field>
                  <v-text-field name="description" label="Descripcion" v-model="item.description" :error-messages="descriptionErrors" @input="$v.item.description.$touch()" @blur="$v.item.description.$touch()" multi-line></v-text-field>
                  <v-menu ref="menu" lazy :close-on-content-click="false" v-model="menu" transition="scale-transition" offset-y full-width :nudge-right="40" min-width="290px" :return-value.sync="item.createAt">
                    <v-text-field slot="activator" label="Selecccionar fecha de creacion" v-model="item.createAt" :error-messages="dateErrors" prepend-icon="event" readonly></v-text-field>
                    <v-date-picker v-model="item.createAt" :reactive="true" no-title scrollable>
                      <v-spacer></v-spacer>
                      <v-btn flat color="primary" @click="menu = false">Cancel</v-btn>
                      <v-btn flat color="primary" @click="$refs.menu.save(item.createAt)">OK</v-btn>
                    </v-date-picker>
                  </v-menu>
                </v-flex>
                <v-flex xs6>
                  <v-text-field name="image" label="Seleccione archivo pdf" v-model.lazy="item.docName" prepend-icon="image" @click='pickFile'></v-text-field>
                  <input type="file" style="display: none" ref="image" accept="application/pdf" @change="onFilePicked">
                  <v-card-media :src="item.docValue" height="300px"></v-card-media>
                </v-flex>
              </v-layout>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
      <v-btn @click="submit">guardar</v-btn>
      <v-btn v-if="!edit" @click="clear">limpiar</v-btn>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>
<script>
import { docsRef } from "../config/firebaseConfig";
// import { docsRef } from "../config/firebaseConfig";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  minValue
} from "vuelidate/lib/validators";
import moment from "moment";
export default {
  props: {
    edit: {
      type: Boolean,
      default: false
    },
    item: {
      type: Object,
      default: function() {
        return {
          title: null,
          description: null,
          docName: null,
          docValue: null,
          publicAt: null,
          createAt: null,
        };
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      title: { required, minLength: minLength(5), maxLength: maxLength(40) },
      description: { required, minLength: minLength(15) },
      publicAt: required
    }
  },
  data: () => ({
    alert: false,
    contain: true,
    menu: false
  }),
  methods: {
    submit() {
      this.$v.item.$touch();
      if (this.$v.item.$error) {
        console.log("Error de validacion");
        return;
      }
      this.edit ? this.editDocument() : this.addDocument();
    },
    addDocument() {
      this.item.publicAt = this.getdate;
      docsRef.push(this.item).then(() => this.displayAlert());
      // this.item.gallery.forEach(picture => {
      //   picture.group = this.item.title;
      //   galleryRef
      //     .push(picture)
      //     .then(() => console.log("Imagenes agregadas a galeria"));
      // });
      this.clear();
    },
    displayAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    editDocument() {
      docsRef
        .child(this.item.uid)
        .set(this.item)
        .then(() => this.displayAlert());
    },
    clear() {
      this.$v.$reset();
      this.item.title = null;
      this.item.description = null;
      this.item.createAt = null;
      this.item.publicAt = null;
      this.item.docName = null;
      this.item.docValue = null;
    },
    pickFile() {
      this.$refs.image.click();
    },
    onFilePicked(e) {
      const imageFile = e.target.files[0];
      if (imageFile !== undefined) {
        this.item.docName = imageFile.name;
        if (this.item.docName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(imageFile);
        fr.addEventListener("load", () => {
          this.item.docValue = fr.result;
          // this.item.image = files[0]; // this is an image file that can be sent to server...
        });
      } else {
        this.item.docName = null;
        this.item.docValue = null;
      }
    },
  },
  computed: {
    formTitle() {
      return !this.edit ? "Nuevo Documento" : "Editar Documento";
    },
    alertMessage() {
      return !this.edit
        ? "Documento guardada exitosamente"
        : "Documento editada exitosamente";
    },
    getdate() {
      return moment().format("YYYY-MM-DD");
    },
    dateErrors() {
      const errors = [];
      if (!this.$v.item.publicAt.$dirty) return errors;
      !this.$v.item.publicAt.required && errors.push("Elegir una fecha");
      return errors;
    },
    titleErrors() {
      const errors = [];
      if (!this.$v.$dirty) return errors;
      !this.$v.item.title.minLength &&
        errors.push("Titulo debe tener un minimo 5 caracteres");
      !this.$v.item.title.maxLength &&
        errors.push("Titulo debe tener un maximo de 40 caracteres");
      !this.$v.item.title.required && errors.push("Titulo es requerido.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.item.description.$dirty) return errors;
      !this.$v.item.description.minLength &&
        errors.push("Descripcion debe tener un minimo de 15 caracteres");
      !this.$v.item.description.required &&
        errors.push("Descripcion de requerido");
      return errors;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
