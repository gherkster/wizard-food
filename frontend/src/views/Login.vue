<template>
  <div class="page">
    <div class="content login">
      <n-form size="large">
        <n-grid :cols="12" :x-gap="12">
          <n-form-item-gi label="Username" :span="12" :validation-status="errors.username.status" :feedback="errors.username.message">
            <x-input path="username" :value="username" @input="handleUsernameInput" @blur="handleBlur" />
          </n-form-item-gi>
          <n-form-item-gi label="Password" :span="12" :validation-status="errors.password.status" :feedback="errors.password.message">
            <x-input path="password" :value="password" @input="handlePasswordInput" @blur="handleBlur" />
          </n-form-item-gi>
          <n-form-item-gi :span="12" :show-label="false" :show-feedback="false">
            <n-button type="primary" block :disabled="hasValidationErrorsPresent" @click="submitLogin">Login</n-button>
          </n-form-item-gi>
          <n-form-item-gi :span="12">
            <n-button type="secondary" block @click="submitLogout">Logout</n-button>
          </n-form-item-gi>
        </n-grid>
      </n-form>
    </div>
  </div>
</template>

<script>
import { XInput } from "@/components";
import { NButton, NFormItemGi, NForm, NGrid } from "naive-ui";
import { defaultErrorState } from "@/scripts/validation";
import { RequiredMessage } from "@/constants/validationMessages";
import { set } from "lodash";
import { object, string, ValidationError } from "yup";
import axios from "axios";
import apis from "@/constants/apis";

export default {
  name: "Login.vue",
  components: { XInput, NButton, NForm, NGrid, NFormItemGi },
  data() {
    return {
      username: "",
      password: "",
      errors: {
        username: defaultErrorState,
        password: defaultErrorState,
      },
      validationSchema: null,
    };
  },
  computed: {
    formData() {
      return {
        username: this.username,
        password: this.password,
      };
    },
    hasValidationErrorsPresent() {
      return !!this.errors.username.message || !!this.errors.password.message;
    },
  },
  created() {
    this.validationSchema = object().shape({
      username: string().label("Username").required(RequiredMessage),
      password: string().label("Password").required(RequiredMessage),
    });
  },
  methods: {
    async handleUsernameInput({ path, value }) {
      this.username = value;
      await this.validateAt(path);
    },
    async handlePasswordInput({ path, value }) {
      this.password = value;
      await this.validateAt(path);
    },
    async handleBlur({ path }) {
      await this.validateAt(path);
    },
    async validateAt(field) {
      await this.validationSchema
        .validateAt(field, this.formData, { abortEarly: false })
        .then(() => {
          set(this.errors, field, defaultErrorState);
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            const validationErrors = error.inner.map((e) => ({ path: e.params.path.toString(), message: e.message }));

            validationErrors.forEach((e) => {
              set(this.errors, e.path, { message: e.message, status: "error" });
            });
          }
        });
    },
    async validateAll() {
      await this.validationSchema
        .validate(this.formData, { abortEarly: false })
        .then(() => {
          this.errors.username = defaultErrorState;
          this.errors.password = defaultErrorState;
        })
        .catch((error) => {
          if (error instanceof ValidationError) {
            const validationErrors = error.inner.map((e) => ({ path: e.params.path.toString(), message: e.message }));

            validationErrors.forEach((e) => {
              set(this.errors, e.path, { message: e.message, status: "error" });
            });
          }
        });
    },
    async submitLogin() {
      await this.validateAll();
      if (!this.hasValidationErrorsPresent) {
        this.$axios({
          method: "post",
          url: apis.login,
          data: this.formData,
        })
          .then((response) => {
            console.log(response);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    },
    async submitLogout() {
      this.$axios({
        method: "post",
        url: apis.logout,
      })
    }
  },
};
</script>
