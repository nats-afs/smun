<template lang="pug">
  v-app#inspire
    v-content
      v-container(fluid, fill-height)
        v-layout(align-center, justify-center)
          v-flex(xs12, sm8, md4)
            v-card.elevation-12
              v-toolbar(dark, color='primary')
                v-toolbar-title inicie de Sesion Alternativo
                v-spacer
              v-card-text
                v-btn(:loading="loading",:disabled="loading",block,@click.prevent="loginWithGoogle") Ingresar con Google
                v-btn(:loading="loading",:disabled="loading",block,@click.prevent="loginWithFacebook") Ingresar con Facebook
                v-btn(:loading="loading",:disabled="loading",block,@click.prevent="loginWithEmailLocal") Ingresar con Twitter
                router-link(to="/login") Volver
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
    ...mapActions(["addMessage", "clearMessage", "loginWithEmail",'loginWithGoogle','loginWithFacebook']),
    // loginWithEmailLocal() {
    //   this.$v.$touch();
    //   if (this.$v.$error) {
    //     console.log("Error de validacion");
    //     return;
    //   }
    //   this.loading = true;
    //   this.loginWithEmail({ email: this.email, password: this.password })
    //     .then(() => {
    //       this.loading = false;
    //     })
    //     .catch(error => {
    //       let message_obj = {
    //         message: error.message,
    //         messageClass: "danger",
    //         autoClose: true
    //       };
    //       this.addMessage(message_obj);
    //     });
    // }
  },
  // computed: {
  //   emailErrors() {
  //     const errors = [];
  //     if (!this.$v.email.$dirty) return errors;
  //     !this.$v.email.required && errors.push("Email es requerido");
  //     !this.$v.email.email && errors.push("No es un email valido");
  //     return errors;
  //   },
  //   passwordErrors() {
  //     const errors = [];
  //     if (!this.$v.password.$dirty) return errors;
  //     !this.$v.password.required && errors.push("Password es requerido");
  //     return errors;
  //   }
  // }
};
</script>
