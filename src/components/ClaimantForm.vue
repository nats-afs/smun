<template lang="pug">
  v-card
    v-card-text
      v-alert(color='success', icon='check_circle', :value='alert', transition='scale-transition')
        | {{alertMessage}}
      v-card
        v-card-title.py-0
          span.headline.py-0 {{ formTitle }}
        v-card-text
          v-layout(row)
            v-flex(xs12)
              v-form
                v-layout(row,wrap)
                  v-flex(xs6)
                    v-card-title.subheading.py-0 Datos Personales
                    v-card-text
                      v-layout(row,wrap)
                        v-flex(xs2)
                          v-select(label='Doc', v-model='item.doc', :items='items', :error-messages='docErrors', @change='$v.item.doc.$touch()', @blur='$v.item.doc.$touch()')
                        v-flex(xs1)
                        v-flex(xs9)
                          v-text-field(label='Nro Documento',v-model='item.nroDoc', name='nroDoc', :error-messages='nroDocErrors', @input='$v.item.nroDoc.$touch()', @blur='$v.item.nroDoc.$touch()')
                      v-text-field(label='Nombre / Razon Social',v-model='item.name', name='name', :error-messages='nameErrors', @input='$v.item.name.$touch()', @blur='$v.item.name.$touch()')
                      v-text-field(label='Telefono', name='phone', v-model='item.phone', :error-messages='phoneErrors', @input='$v.item.phone.$touch()', @blur='$v.item.phone.$touch()')
                      v-text-field(label='Email', name='email', v-model='item.email', :error-messages='emailErrors', @input='$v.item.email.$touch()', @blur='$v.item.email.$touch()')
                      v-checkbox(label='¿Propietario?', v-model='item.owner')
                  v-flex(xs6)
                    v-card-title.subheading.py-0 Domicilio
                    v-card-text
                      v-text-field(label='Av. / Jr. / Calle / Pasaje / Int.', name='via', v-model='item.via', :error-messages='viaErrors', @input='$v.item.via.$touch()', @blur='$v.item.via.$touch()')
                      v-text-field(label='Distrito', name='distrito', v-model='item.distrito', :error-messages='distritoErrors', @input='$v.item.distrito.$touch()', @blur='$v.item.distrito.$touch()')
                      v-layout(row,wrap)
                        v-flex(xs2)
                          v-text-field(label='N°', name='nro', v-model='item.nro')
                        v-flex(xs1)
                        v-flex(xs2)
                          v-text-field(label='Mz.', name='mz', v-model='item.mz')
                        v-flex(xs1)
                        v-flex(xs2)
                          v-text-field(label='Lt.', name='lt', v-model='item.lt')
                        v-flex(xs1)
                        v-flex(xs2)
                          v-text-field(label='Sub Lote', name='sublt', v-model='item.sublt')
                v-btn(@click='submit') guardar
                v-btn(v-if='!edit', @click='clear') limpiar
                slot
</template>
<script>
import moment from "moment";
import { claimantRef } from "@/config/firebaseConfig";
import { validationMixin } from "vuelidate";
import {
  required,
  minLength,
  maxLength,
  email
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
        return {};
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      doc: { required },
      nroDoc: { required, minLength: minLength(8), maxLength: maxLength(11) },
      name: { required },
      phone: { required, minLength: minLength(7) },
      email: { required, email },
      via: { required },
      distrito: { required }
      // checkbox: { required }
    }
  },
  data: () => ({
    alert: false,
    contain: true,
    items: ["DNI", "RUC"]
    // checkbox: false
  }),
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.item.$error) {
        console.log("Error de validacion");
        return;
      }
      this.edit ? this.editNews() : this.addNews();
    },
    addNews() {
      this.item.date = this.getdate;
      // var newsPostRef = newsRef.push(news);
      // news.uid = newsPostRef.key;
      claimantRef.push(this.item).then(() => this.displayAlert());
      this.clear();
    },
    displayAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    editNews() {
      this.item.date = this.getdate;
      claimantRef
        .child(this.item.uid)
        .set(this.item)
        .then(() => this.displayAlert());
    },
    addCategory(id, data) {
      this.items.push(data.val().name);
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
    },
    clear() {
      this.$v.$reset();
      this.item.title = null;
      this.item.description = null;
      this.item.category = null;
      this.item.image = null;
      this.item.featured = false;
    }
  },
  created() {
    // categoryRef.on("child_added", data => this.addCategory(data.key, data));
  },
  computed: {
    formTitle() {
      return !this.edit ? "Nuevo Solicitante" : "Editar Solicitante";
    },
    alertMessage() {
      return !this.edit
        ? "Solicitante guardado exitosamente"
        : "Solicitante editado exitosamente";
    },
    getdate() {
      return moment().format("DD-MM-YYYY");
    },
    docErrors() {
      const errors = [];
      if (!this.$v.item.doc.$dirty) return errors;
      !this.$v.item.doc.required && errors.push("Seleccione un Documento");
      return errors;
    },
    nroDocErrors() {
      const errors = [];
      if (!this.$v.item.nroDoc.$dirty) return errors;
      !this.$v.item.nroDoc.minLength &&
        errors.push("Numero de Documento debe tener un minimo 8 caracteres");
      !this.$v.item.nroDoc.maxLength &&
        errors.push("Numero de Documento debe tener un minimo 11 caracteres");
      !this.$v.item.nroDoc.required &&
        errors.push("Ingrese Numero del Documento");
      return errors;
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.item.name.$dirty) return errors;
      !this.$v.item.name.required &&
        errors.push("Nombre/ Razon Social es requerido");
      return errors;
    },
    phoneErrors() {
      const errors = [];
      if (!this.$v.item.phone.$dirty) return errors;
      !this.$v.item.phone.minLength &&
        errors.push("Telefono debe tener un minimo 7 caracteres");
      !this.$v.item.phone.required && errors.push("Telefono es requerido.");
      return errors;
    },
    emailErrors() {
      const errors = [];
      if (!this.$v.item.email.$dirty) return errors;
      !this.$v.item.email.email && errors.push("Debe ser un e-mail valido");
      !this.$v.item.email.required && errors.push("E-mail es requerido.");
      return errors;
    },
    viaErrors() {
      const errors = [];
      if (!this.$v.item.via.$dirty) return errors;
      !this.$v.item.via.required && errors.push("Via de requerido");
      return errors;
    },
    distritoErrors() {
      const errors = [];
      if (!this.$v.item.distrito.$dirty) return errors;
      !this.$v.item.distrito.required && errors.push("Distrito de requerido");
      return errors;
    }
  }
};
</script>
