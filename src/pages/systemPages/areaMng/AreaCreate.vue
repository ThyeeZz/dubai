<template>
  <div class="area-create">
    <el-form
      :model="createAreaForm"
      :rules="rules"
      ref="ruleForm"
      class="area-create_form"
    >
      <el-form-item label="Area name" prop="name">
        <el-input v-model="createAreaForm.name"></el-input>
      </el-form-item>
      <el-form-item label="Latitude" prop="lat">
        <el-input v-model="createAreaForm.lat"></el-input>
      </el-form-item>
      <el-form-item label="Longitude" prop="lng">
        <el-input v-model="createAreaForm.lng"></el-input>
      </el-form-item>

      <el-form-item class="button_wrap">
        <el-button type="primary" @click="submitForm('ruleForm');"
          >submit</el-button
        >
        <el-button @click="resetForm('ruleForm');">Reset</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>
import { createArea } from "@/api/api";
import { validateLat, validateLng } from "@/lib/utils";
import { mapActions } from "vuex";
export default {
  name: "AreatCreate",
  data() {
    return {
      createAreaForm: {
        name: "",
        lat: "",
        lng: ""
      },
      rules: {
        name: [
          { required: true, message: "Please inout area name", trigger: "blur" }
        ],
        lat: [{ validator: validateLat, trigger: "blur" }],
        lng: [{ validator: validateLng, trigger: "blur" }]
      }
    };
  },
  methods: {
    ...mapActions(["getAreaList"]),
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          const { createAreaForm } = this;
          const lat = createAreaForm.lat || 0;
          const lng = createAreaForm.lng || 0;
          createArea({ ...createAreaForm, lat, lng })
            .then(res => {
              this.succeed("Create area successfully");
              this.getAreaList();
              this.createAreaForm = {
                name: "",
                lat: "",
                lng: ""
              };
            })
            .catch(err => {
              console.log(err);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.createAreaForm = {
        name: "",
        lat: null,
        lng: null
      };
    }
  }
};
</script>
<style lang="scss" scoped>
.area-create {
  width: 100%;
  height: 100%;
  .area-create_form /deep/ {
    padding: 0.1rem 0.2rem;
    .el-form-item {
      display: flex;
      .el-form-item__label {
        width: 1.5rem;
      }
      .el-form-item__content {
        width: 4rem;
      }
    }
    .button_wrap {
      .el-form-item__content {
        margin-left: 1.5rem;
      }
    }
  }
}
</style>
