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
        <v-tab ripple>Organizacion</v-tab>
        <v-tab ripple>Redes Sociales</v-tab>
        <v-tab-item>
          <v-container grid-list-xl>
            <v-layout row>
              <v-flex xs12>
                <v-form>
                  <v-layout row>
                    <v-flex xs6>
                      <!-- :error-messages="dateErrors" @input="$v.item.date.$touch()" @blur="$v.item.date.$touch()" -->
                      <v-text-field name="name" label="Nombre Organizacion" v-model="item.name" :error-messages="nameErrors" @input="$v.item.name.$touch()" @blur="$v.item.name.$touch()"></v-text-field>
                      <v-text-field name="slogan" label="Slogan" v-model="item.slogan" :error-messages="sloganErrors" @input="$v.item.slogan.$touch()" @blur="$v.item.slogan.$touch()"></v-text-field>
                      <v-text-field name="copyright" label="Copyright" :disabled="true" :value=copyright></v-text-field>
                    </v-flex>
                    <v-flex xs6>
                      <v-text-field name="image" label="Seleccione una imagen" v-model.lazy="item.imageName" prepend-icon="image" @click='pickFile'></v-text-field>
                      <input type="file" style="display: none" ref="image" accept="image/png" @change="onFilePicked">
                      <v-card-media class="upload-img" :src="item.imageValue" height="300px"></v-card-media>
                    </v-flex>
                  </v-layout>
                </v-form>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
        <v-tab-item>
          <v-container grid-list-xl>
            <v-layout row wrap v-for="(red,index) in item.redes" align-center="true" :key="red.id">
              <v-flex xs2>
                <v-switch :label="red.name" :disabled="red.lock" :value="red.name" v-model="red.state"></v-switch>
              </v-flex>
              <v-flex xs9>
                <v-text-field right :label="`Indique url para ${red.name}`" :disabled="red.lock" v-model="red.url"></v-text-field>
              </v-flex>
              <v-flex xs1>
                <v-btn flat icon @click="toogleLock(red.lock = !red.lock, index)">
                  <v-icon>edit</v-icon>
                </v-btn>
              </v-flex>
            </v-layout>
          </v-container>
        </v-tab-item>
      </v-tabs>
      <v-btn @click="submit">guardar</v-btn>
      <slot></slot>
    </v-card-text>
  </v-card>
</template>
<script>
import moment from "moment";
import { orgRef } from "../config/firebaseConfig";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  minValue
} from "vuelidate/lib/validators";
export default {
  mixins: [validationMixin],
  validations: {
    item: {
      name: { required, minLength: minLength(5) },
      slogan: { required, minLength: minLength(15) }
    }
  },
  data: () => ({
    active: null,
    alert: false,
    contain: true,
    item: {
      name: null,
      slogan: null,
      copyright: null,
      imageName: null,
      imageValue: null,
      redes: [
        {
          state: false,
          name: "facebook",
          url: null,
          icon:'fa fa-2x fa-facebook',
          lock: true
        },
        {
          state: false,
          name: "twitter",
          url: null,
          icon:'fa fa-2x fa-twitter',
          lock: true
        },
        {
          state: false,
          name: "youtube",
          url: null,
          icon:'fa fa-2x fa-youtube-play',
          lock: true
        },
        {
          state: false,
          name: "instagram",
          url: null,
          icon:'fa fa-2x fa-instagram',
          lock: true
        },
        {
          state: false,
          name: "pinterest",
          url: null,
          icon:'fa fa-2x fa-pinterest',
          lock: true
        }
      ]
    }
  }),
  created() {
    orgRef.on("value", snapshot => {
      this.fetchOrg(snapshot.val());
    });
  },
  methods: {
    fetchOrg(data) {
      if(!data){
        console.log('Org no definida')
        return
      }
      this.item.name = data.name;
      this.item.slogan = data.slogan;
      this.item.imageName = data.imageName ? data.imageName : null;
      this.item.imageValue = data.imageValue ? data.imageValue : null;
      this.item.redes = data.redes;
      this.item.redes.forEach(red => (red.lock = true));
    },
    submit() {
      this.$v.item.$touch();
      if (this.$v.item.$error) {
        console.log("Error de validacion");
        return;
      }
      this.saveSettings();
    },
    saveSettings() {
      orgRef.set(this.item).then(() => this.displayAlert());
    },
    displayAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    // clear() {
    //   this.$v.$reset();
    //   this.item.name = null;
    //   this.item.slogan = null;
    //   this.item.imageName = null;
    //   this.item.imageValue = null;
    //   this.item.redes = [];
    // },
    pickFile() {
      this.$refs.image.click();
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
        });
      } else {
        console.log("invalidad file");
        this.item.imageName = null;
        this.item.imageValue = null;
      }
    },
    toogleLock(val, index) {
      this.item.redes[index].lock = val;
    }
  },
  computed: {
    copyright() {
      return "© " + moment().year() + " " + this.item.name;
    },
    formTitle() {
      return "Ajustes generales";
    },
    alertMessage() {
      return "Ajuste guardados";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.$dirty) return errors;
      !this.$v.item.name.minLength &&
        errors.push("Titulo debe tener un minimo 5 caracteres");
      !this.$v.item.name.required && errors.push("Titulo es requerido.");
      return errors;
    },
    sloganErrors() {
      const errors = [];
      if (!this.$v.item.slogan.$dirty) return errors;
      !this.$v.item.slogan.minLength &&
        errors.push("Descripcion debe tener un minimo de 15 caracteres");
      !this.$v.item.slogan.required && errors.push("Descripcion de requerido");
      return errors;
    }
  }
};
</script>
<style lang="scss" scoped>
.upload-img {
  background-color: rgba(217, 217, 224, 0.705);
}
</style>
