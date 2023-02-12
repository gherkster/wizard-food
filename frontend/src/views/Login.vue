<template>
  <div class="page">
    <div class="content login">
      <n-form size="large">
        <x-input
          label="Username"
          path="username"
          :value="username"
          :errors="v$.username.$errors"
          @input="handleUsernameInput"
          @blur="v$.username.$touch"
          @keyup.enter="submitLogin"
        />
        <x-input
          label="Password"
          path="password"
          :value="password"
          :errors="v$.password.$errors"
          @input="handlePasswordInput"
          @blur="v$.password.$touch"
          @keyup.enter="submitLogin"
        />
        <n-button type="primary" block :disabled="v$.$errors.length > 0" @click="submitLogin">Login</n-button>
        <n-button type="secondary" block @click="submitLogout">Logout</n-button>
      </n-form>
    </div>
  </div>
</template>

<script>
import { XInput } from "@/components";
import { NButton, NForm } from "naive-ui";
import apis from "@/constants/apis";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAxios } from "@/composables";
import { useAlertStore } from "@/store/alertStore";

export default {
  name: "Login.vue",
  components: { XInput, NButton, NForm },
  setup() {
    return {
      alertStore: useAlertStore(),
      axios: useAxios(),
      v$: useVuelidate(),
    };
  },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  validations() {
    return {
      username: {
        required,
      },
      password: {
        required,
      },
    };
  },
  computed: {
    formData() {
      return {
        username: this.username,
        password: this.password,
      };
    },
  },
  methods: {
    async handleUsernameInput({ value }) {
      this.username = value;
    },
    async handlePasswordInput({ value }) {
      this.password = value;
    },
    async submitLogin() {
      const isFormValid = await this.v$.$validate();
      if (!isFormValid) {
        return;
      }
      this.axios({
        method: "post",
        url: apis.login,
        data: this.formData,
      })
        .then((response) => {
          this.alertStore.showSuccessAlert("Logged in successfully.");
        })
        .catch((error) => {
          console.log(error);
          this.alertStore.showErrorAlert("Login failed");
        });
    },
    async submitLogout() {
      this.axios({
        method: "post",
        url: apis.logout,
      });
    },
  },
};
</script>
