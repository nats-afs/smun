<template>
  <v-card>
    <v-card-text>
      <v-alert color="success" icon="check_circle" :value="alert" transition="scale-transition">
        {{alertMessage}}
      </v-alert>
      <v-card-title>
        <span class="headline">{{ formTitle }}</span>
      </v-card-title>
      <v-container>
        <v-layout row>
          <v-flex xs12>
            <v-form>
              <v-text-field label="Nombre" v-model="item.name" :error-messages="nameErrors" @input="$v.item.name.$touch()" @blur="$v.item.name.$touch()"></v-text-field>
              <v-text-field label="Descripcion" v-model="item.description" multi-line :error-messages="descriptionErrors" @input="$v.item.description.$touch()" @blur="$v.item.description.$touch()"></v-text-field>
              <v-text-field label="Contenido" v-model="child" @keyup.enter="addChild" :error-messages="childErrors" @input="$v.child.$touch()" @blur="$v.child.$touch()"></v-text-field>
              <v-list v-model="item.children">
                <v-list-tile v-for="(note , index ) in item.children" :key="note.id">
                  <v-list-tile-content>
                    <v-text-field solo v-model="item.children[index].name"></v-text-field>
                  </v-list-tile-content>
                  <v-list-tile-action>
                    <v-btn icon @click="remove(index)">
                      <v-icon>close</v-icon>
                    </v-btn>
                  </v-list-tile-action>
                </v-list-tile>
              </v-list>
              <v-btn @click="submit">guardar</v-btn>
              <v-btn v-if="!edit" @click="clear">limpiar</v-btn>
              <slot></slot>
            </v-form>
          </v-flex>
        </v-layout>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import { noteRef } from "../config/firebaseConfig";
import { validationMixin } from "vuelidate";
import { required, minLength, maxLength } from "vuelidate/lib/validators";
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
          name: null,
          description: null,
          children: []
        };
      }
    }
  },
  mixins: [validationMixin],
  validations: {
    item: {
      name: { required, minLength: minLength(5), maxLength: maxLength(10) },
      description: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(15)
      },
      children: {
        required,
        minLength: minLength(1),
        $each: {
          name: {
            required,
            minLength: minLength(5),
            maxLength: maxLength(10)
          }
        }
      }
    },
    child: { minLength: minLength(5), maxLength: maxLength(10) }
  },
  data: () => ({
    child: null,
    alert: false,
    notes: [],
  }),
  methods: {
    submit() {
      this.$v.$touch();
      if (this.$v.item.$error) {
        console.log("Error de validacion General");
        return;
      }
      this.edit ? this.editNote() : this.addNote();
    },
    addNote() {
      noteRef
        .push(this.item)
        .then(() => this.displayAlert(), () => console.log("No se guardo"));
      this.clear();
    },
    displayAlert() {
      this.alert = true;
      setTimeout(() => {
        this.alert = false;
      }, 4000);
    },
    editNote() {
      noteRef
        .child(this.item.uid)
        .set(this.item)
        .then(() => this.displayAlert(), () => console.log("No se edito"));
    },
    addChild() {
      if (this.$v.child.$error) {
        console.log("Error de validacion");
        return;
      }
      this.item.children.push({ name: this.child });
      this.child = null;
    },
    remove(index){
      this.item.children.splice(index,1)
    },
    clear() {
      this.$v.$reset();
      this.item.name = null;
      this.item.description = null;
      this.item.children = [];
    }
  },
  computed: {
    formTitle() {
      return !this.edit ? "Nueva Nota" : "Editar Nota";
    },
    alertMessage() {
      return !this.edit
        ? "Nota guardada exitosamente"
        : "Nota editada exitosamente";
    },
    nameErrors() {
      const errors = [];
      if (!this.$v.item.name.$dirty) return errors;
      !this.$v.item.name.minLength &&
        errors.push("El nombre de nota debe tener mas de 5 caracteres");
      !this.$v.item.name.maxLength &&
        errors.push("El nombre de nota debe tener maximo 10 caracteres");
      !this.$v.item.name.required && errors.push("Nombre es requerido.");
      return errors;
    },
    descriptionErrors() {
      const errors = [];
      if (!this.$v.item.description.$dirty) return errors;
      !this.$v.item.description.minLength &&
        errors.push("Descripcion debe tener un minimo de 5 caracteres");
      !this.$v.item.description.maxLength &&
        errors.push("Descripcion debe tener maximo de 15 caracteres");
      !this.$v.item.description.required &&
        errors.push("Descripcion de requerido");
      return errors;
    },
    childErrors() {
      const errors = [];
      if (!this.$v.child.$dirty) return errors;
      !this.$v.child.minLength && errors.push("Minimo 5 caracteres");
      !this.$v.child.maxLength && errors.push("Maximo 10 caracteres");
      return errors;
    }
  }
};
</script>
<style lang="scss" scoped>

</style>
