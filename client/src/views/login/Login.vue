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
        <n-button block @click="submitLogout">Logout</n-button>
      </n-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { XInput } from "@/components";
import { NButton, NForm } from "naive-ui";
import apis from "@/constants/apis";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import { useAxios } from "@/composables";
import { useAlertStore } from "@/store/alertStore";
import { reactive } from "vue";
import { useUserStore } from "@/store";

const rules = {
  username: {
    required,
  },
  password: {
    required,
  },
};

const data = reactive({
  username: "",
  password: "",
});
const v$ = useVuelidate(rules, data);

const alertStore = useAlertStore();
const axios = useAxios();

async function handleUsernameInput(value: string) {
  data.username = value;
}
async function handlePasswordInput(value: string) {
  data.password = value;
}

const userStore = useUserStore();
async function submitLogin() {
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) {
    return;
  }
  await axios
    .post(apis.login, data)
    .then(() => {
      userStore.setUserToLoggedIn();
      alertStore.showSuccessAlert("Logged in successfully.");
    })
    .catch((error) => {
      console.log(error);
      alertStore.showErrorAlert("Login failed");
    });
}

async function submitLogout() {
  axios({
    method: "post",
    url: apis.logout,
  });
}
</script>
