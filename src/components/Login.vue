<template lang="pug">
  v-app#inspire
    v-content
      v-container(fluid, fill-height)
        v-layout(align-center, justify-center)
          v-flex(xs12, sm8, md4)
            v-card.elevation-12
              v-toolbar(dark, color='primary')
                v-toolbar-title inicie Sesion
                v-spacer
              v-card-text
                v-form
                  v-text-field(v-model="email",prepend-icon='person', name='login', label='Login', type='text', :error-messages='emailErrors', @input='$v.email.$touch()', @blur='$v.email.$touch()')
                  v-text-field#password(v-model="password",prepend-icon='lock', name='password', label='Password', type='password',:error-messages='passwordErrors', @input='$v.password.$touch()', @blur='$v.password.$touch()')
              v-card-text
                v-btn(:loading="loading",:disabled="loading",block,@click.prevent="loginWithEmailLocal") Ingresar
                router-link(to="/alternativeLogin") Inicio de sesion alternativo
</template>
<script>
import { validationMixin } from "vuelidate";
import { required, email } from "vuelidate/lib/validators";
import { mapActions } from "vuex";
export default {
  mixins: [validationMixin],
  validations: {
    email: { required, email },
    password: { required }
  },
  data: () => ({
    loading: false,
    email: "",
    password: ""
  }),
  methods: {
    ...mapActions(["addMessage", "clearMessage", "loginWithEmail"]),
    loginWithEmailLocal() {
      this.$v.$touch();
      if (this.$v.$error) {
        console.log("Error de validacion");
        return;
      }
      this.loading = true;
      this.loginWithEmail({ email: this.email, password: this.password })
        .then(() => {
          this.loading = false;
        })
        .catch(error => {
          let message_obj = {
            message: error.message,
            messageClass: "danger",
            autoClose: true
          };
          this.addMessage(message_obj);
        });
    }
  },
  computed: {
    emailErrors() {
      const errors = [];
      if (!this.$v.email.$dirty) return errors;
      !this.$v.email.required && errors.push("Email es requerido");
      !this.$v.email.email && errors.push("No es un email valido");
      return errors;
    },
    passwordErrors() {
      const errors = [];
      if (!this.$v.password.$dirty) return errors;
      !this.$v.password.required && errors.push("Password es requerido");
      return errors;
    }
  }
};
</script>
