<template>
  <v-card>
    <v-card-text>
      <v-alert color="success" icon="check_circle" :value="alert" transition="scale-transition">
        {{alertMessage}}
      </v-alert>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-tabs v-model="active">
        <v-tab ripple>Detalle</v-tab>
        <v-tab ripple>Galeria</v-tab>
        <v-tab-item>
          <v-container grid-list-xl>
            <v-layout row>
              <v-flex xs12>
                <v-form>
                  <v-layout row>
                    <v-flex xs6>
                      <!-- :error-messages="dateErrors" @input="$v.item.date.$touch()" @blur="$v.item.date.$touch()" -->
                      <v-text-field name="title" label="Titulo" v-model="item.title" :error-messages="titleErrors" :counter="40" @input="$v.item.title.$touch()" @blur="$v.item.title.$touch()"></v-text-field>
                      <v-text-field name="address" label="Direccion" v-model="item.address" :error-messages="addressErrors" @input="$v.item.address.$touch()" @blur="$v.item.address.$touch()"></v-text-field>
                      <v-text-field name="description" label="Descripcion" v-model="item.description" :error-messages="descriptionErrors" @input="$v.item.description.$touch()" @blur="$v.item.description.$touch()" multi-line></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field name="image" label="Seleccione una imagen" v-model.lazy="item.imageName" prepend-icon="image" @click='pickFile'></v-text-field>
                      <input type="file" style="display: none" ref="image" accept="image/jpeg" @change="onFilePicked">
                      <v-card-media :src="item.imageValue" height="300px"></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-text-field name="image" label="Imagenes" :value="multipleImagesText" prepend-icon="image" @click='pickGallery' hint="Seleccione multiples imagenes"></v-text-field>
          <input type="file" style="display: none" ref="gallery" multiple accept="image/jpeg" @change="onGalleryPicked">
          <template v-if="item.gallery.length">
            <v-layout>
              <v-flex xs12>
                <v-card>
                  <v-container fluid grid-list-lg>
                    <v-layout row wrap>
                      <v-flex xs12 sm3 v-for="(picture,index) in item.gallery" :key="picture.id">
                        <v-card flat tile>
                          <v-card-media :src="picture.src" height="150px">
                          </v-card-media>
                          <v-text-field name="caption" labell="Caption" v-model.lazy="item.gallery[index].caption"></v-text-field>
                          <v-btn color="blue" dark small absolute bottom right fab class="mb-1" @click="removeImage(index)">
                            <v-icon>close</v-icon>
                          </v-btn>
                        </v-card>
                      </v-flex>
                    </v-layout>
                  </v-container>
                </v-card>
              </v-flex>
            </v-layout>
          </template>
        </v-tab-item>
      </v-tabs>
      <v-btn @click="submit">guardar</v-btn>
      <v-btn v-if="!edit" @click="clear">limpiar</v-btn>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>
<script>
import moment from "moment";
import { placeRef } from "../config/firebaseConfig";
import { galleryRef } from "../config/firebaseConfig";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  minValue
} from "vuelidate/lib/validators";
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
          address: null,
          description: null,
          imageName: null,
          imageValue: null,
          gallery: []
        };
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      title: { required, minLength: minLength(5), maxLength: maxLength(40) },
      description: { required, minLength: minLength(15) },
      address: {
        required,
        minLength: minLength(5)
      }
    }
  },
  data: () => ({
    active: null,
    alert: false,
    contain: true,
    menu: false,
  }),
  methods: {
    submit() {
      this.$v.item.$touch();
      if (this.$v.item.$error) {
        console.log("Error de validacion");
        return;
      }
      this.edit ? this.editPlaces() : this.addPlaces();
    },
    addPlaces() {
      placeRef.push(this.item).then(() => this.displayAlert())
      this.item.gallery.forEach(picture => {
        picture.group = this.item.title
        galleryRef.push(picture).then(() => console.log('Imagenes agregadas a galeria'))
      });
      this.clear();
    },
    displayAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    editPlaces() {
      placeRef
        .child(this.item.uid)
        .set(this.item)
        .then(() => this.displayAlert());
    },
    removeImage(index) {
      this.item.gallery.splice(index, 1);
    },
    clear() {
      this.$v.$reset();
      this.item.title = null;
      this.item.address = null;
      this.item.description = null;
      this.item.imageName = null;
      this.item.imageValue = null;
    },
    pickFile() {
      this.$refs.image.click();
    },
    pickGallery() {
      this.$refs.gallery.click();
    },
    onFilePicked(e) {
      const imageFile = e.target.files[0];
      if (imageFile !== undefined) {
        this.item.imageName = imageFile.name;
        if (this.item.imageName.lastIndexOf(".") <= 0) {
          return;
        }
        const fr = new FileReader();
        fr.readAsDataURL(imageFile);
        fr.addEventListener("load", () => {
          this.item.imageValue = fr.result;
          // this.item.image = files[0]; // this is an image file that can be sent to server...
        });
      }
    },
    onGalleryPicked(e) {
      let imageFiles = e.target.files;
      if (imageFiles.length) {
        console.log(imageFiles.length + " imagenes cargadas...");
      }

      for (let index = 0; index < imageFiles.length; index++) {
        let imageFile = imageFiles[index];
        // this.
        let fr = new FileReader();
        fr.onload = event => {
          let pickFile = event.target;
          this.item.gallery.push({
            thumb: pickFile.result,
            src: pickFile.result,
            caption: "caption-" + index
          });
        };
        fr.readAsDataURL(imageFile);
      }
    }
  },
  computed: {
    multipleImagesText() {
      return this.item.gallery.map(item => item.thumb);
    },
    formTitle() {
      return !this.edit ? "Nuevo Lugar" : "Editar Lugar";
    },
    alertMessage() {
      return !this.edit
        ? "Lugar guardado exitosamente"
        : "Lugar editado exitosamente";
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
    addressErrors() {
      const errors = [];
      if (!this.$v.$dirty) return errors;
      !this.$v.item.address.minLength &&
        errors.push("Direccion debe tener un minimo 5 caracteres");
      !this.$v.item.address.required && errors.push("Direccion es requerido.");
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
