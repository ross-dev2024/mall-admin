<!-- 用户管理 -->
<script setup lang="ts">
import {
  addItem,
  deleteItem,
  getDetailPage,
  getItemForm,
  getPkgOptions,
  updateItem,
} from "@/api/system/user-package";
// import {
//   addUser,
//   deleteUsers,
//   downloadTemplateApi,
//   exportUser,
//   getUserForm,
//   importUser,
//   updateUser,
// } from "@/api/system/user-package";
import { getDeptOptions } from "@/api/system/dept";
import { getRoleOptions } from "@/api/system/role";
import type { UploadInstance } from "element-plus";
import { genFileId } from "element-plus";
import {
  PkgDetailForm,
  PkgDetailPageVO,
  PkgDetailQuery,
} from "@/api/system/user-package/types";
import { UserForm } from "@/api/system/user/types";
import { transform } from "lodash";

defineOptions({
  name: "Package",
  inheritAttrs: false,
});

const queryFormRef = ref(ElForm); // 查询表单
const detailFormRef = ref(ElForm); // 用户表单
const uploadRef = ref<UploadInstance>(); // 上传组件

const loading = ref(false); //  加载状态 用于分页
const removeIds = ref([]); // 删除用户ID集合 用于批量删除
const queryParams = reactive<PkgDetailQuery>({
  pageNum: 1,
  pageSize: 10,
});
const total = ref(0); // 数据总数
const pageData = ref<PkgDetailPageVO[]>(); // 用户分页数据
// const deptList = ref<OptionType[]>(); // 部门下拉数据源
// const roleList = ref<OptionType[]>(); // 角色下拉数据源
const pkgList = ref<OptionType[]>(); // 部门下拉数据源

// 弹窗对象
const dialog = reactive({
  visible: false,
  type: "detail-form",
  width: 1200,
  title: "",
});

// 用户表单数据
const formData = reactive<PkgDetailForm>({
  status: 1,
});

// 用户导入数据
const importData = reactive({
  deptId: undefined,
  file: undefined,
  fileList: [],
});

// 校验规则
const rules = reactive({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  pkgName: [{ required: true, message: "pkg不能为空", trigger: "blur" }],
  itemName: [
    { required: true, message: "item不能为空", trigger: "blur" },
    { min: 1, max: 10, message: "item在1到10之间", trigger: "blur" },
  ],
  pkgId: [{ required: true, message: "pkg不能为空", trigger: "blur" }],
  // roleIds: [{required: true, message: "用户角色不能为空", trigger: "blur"}],
  email: [
    {
      pattern: /\w[-\w.+]*@([A-Za-z0-9][-A-Za-z0-9]+\.)+[A-Za-z]{2,14}/,
      message: "请输入正确的邮箱地址",
      trigger: "blur",
    },
  ],
  mobile: [
    {
      pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
      message: "请输入正确的手机号码",
      trigger: "blur",
    },
  ],
  // itemPrice: [
  //   {required: true, message: '请输入价格', trigger: 'blur'},
  //   {type: 'number', min: 1, max: 10000, message: '价格必须是数字格式:1-10000', trigger: 'blur'},
  // ],
});

/** 查询 */
function handleQuery() {
  loading.value = true;
  getDetailPage(queryParams)
    .then(({ data }) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

/** 重置查询 */
function resetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageNum = 1;
  queryParams.pkgId = undefined;
  handleQuery();
}

/** 行选中事件 */
function handleSelectionChange(selection: any) {
  removeIds.value = selection.map((item: any) => item.id);
}

/** 用户状态 Change*/
function changePKgStatus(row: { [key: string]: any }) {
  const text = row.status === 1 ? "启用" : "停用";
  //
  console.log(row.username);
  ElMessageBox.confirm("确认要" + text + row.username + "用户吗?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  })
    .then(() => {
      updateItem(row.id, row.status)
        .then(() => {
          ElMessage.success(text + "成功");
        })
        .catch(() => {
          row.status = row.status === 1 ? 0 : 1;
          // row.status = initialStatus;
          // ElMessage.info(text + "canceled");
          // ElMessage({
          //   type: "info",
          //   message: "Delete canceled",
          // });
        });
    })
    .catch(() => {
      console.log(row.status);
      // row.status = initialStatus;
      row.status = row.status === 1 ? 0 : 1;
      //
      //   ElMessage({
      //     type: 'info',
      //     message: 'Delete canceled',
      //   })
    });
}

/** 加载角色下拉数据源 */
// async function loadRoleOptions() {
//   getRoleOptions().then((response) => {
//     roleList.value = response.data;
//   });
// }

// /** 加载部门下拉数据源 */
// async function loadDeptOptions() {
//   getDeptOptions().then((response) => {
//     deptList.value = response.data;
//   });
// }

/** 加载pkg下拉数据源 */
async function loadPkgOptions() {
  getPkgOptions().then((response) => {
    pkgList.value = response.data;
  });
}

/**
 * 打开弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 * @param id 用户ID
 */
async function openDialog(type: string, id?: number) {
  dialog.visible = true;
  dialog.type = type;

  if (dialog.type === "detail-form") {
    // 用户表单弹窗
    // await loadDeptOptions();
    // await loadRoleOptions();
    await loadPkgOptions();
    if (id) {
      dialog.title = "修改";
      getItemForm(id).then(({ data }) => {
        Object.assign(formData, { ...data });
      });
    } else {
      dialog.title = "新規";
    }
  } else if (dialog.type === "user-import") {
    // 用户导入弹窗
    dialog.title = "导入用户";
    dialog.width = 600;
    // loadDeptOptions();
  }
}

/**
 * 关闭弹窗
 *
 * @param type 弹窗类型  用户表单：user-form | 用户导入：user-import
 */
function closeDialog() {
  dialog.visible = false;
  if (dialog.type === "detail-form") {
    detailFormRef.value.resetFields();
    detailFormRef.value.clearValidate();

    formData.id = undefined;
    formData.status = 1;
  } else if (dialog.type === "user-import") {
    importData.file = undefined;
    importData.fileList = [];
  }
}

/** 表单提交 */
const handleSubmit = useThrottleFn(() => {
  if (dialog.type === "detail-form") {
    detailFormRef.value.validate((valid: any) => {
      if (valid) {
        const userId = formData.id;
        loading.value = true;
        if (userId) {
          updateItem(userId, formData)
            .then(() => {
              ElMessage.success("修改用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        } else {
          addItem(formData)
            .then(() => {
              ElMessage.success("新增用户成功");
              closeDialog();
              resetQuery();
            })
            .finally(() => (loading.value = false));
        }
      }
    });
  } else if (dialog.type === "user-import") {
    // if (!importData?.deptId) {
    //   ElMessage.warning("请选择部门");
    //   return false;
    // }
    // if (!importData?.file) {
    //   ElMessage.warning("上传Excel文件不能为空");
    //   return false;
    // }
    // importUser(importData?.deptId, importData?.file).then((response) => {
    //   ElMessage.success(response.data);
    //   closeDialog();
    //   resetQuery();
    // });
  }
});

/** 删除用户 */
function handleDelete(id?: number) {
  const itemIds = [id || removeIds.value].join(",");
  if (!itemIds) {
    ElMessage.warning("请勾选删除项");
    return;
  }

  ElMessageBox.confirm("确认删除用户?", "警告", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(function () {
    deleteItem(itemIds).then(() => {
      ElMessage.success("删除成功");
      resetQuery();
    });
  });
}

/** 下载导入模板 */
function downloadTemplate() {
  // downloadTemplateApi().then((response: any) => {
  //   const fileData = response.data;
  //   const fileName = decodeURI(
  //     response.headers["content-disposition"].split(";")[1].split("=")[1]
  //   );
  //   const fileType =
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
  //
  //   const blob = new Blob([fileData], { type: fileType });
  //   const downloadUrl = window.URL.createObjectURL(blob);
  //
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = downloadUrl;
  //   downloadLink.download = fileName;
  //
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //
  //   document.body.removeChild(downloadLink);
  //   window.URL.revokeObjectURL(downloadUrl);
  // });
}

/** Excel文件 Change */
function handleFileChange(file: any) {
  importData.file = file.raw;
}

/** Excel文件 Exceed  */
function handleFileExceed(files: any) {
  uploadRef.value!.clearFiles();
  const file = files[0];
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
  importData.file = file;
}

/** 导出用户 */
function handleExport() {
  // exportUser(queryParams).then((response: any) => {
  //   const fileData = response.data;
  //   const fileName = decodeURI(
  //     response.headers["content-disposition"].split(";")[1].split("=")[1]
  //   );
  //   const fileType =
  //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8";
  //
  //   const blob = new Blob([fileData], { type: fileType });
  //   const downloadUrl = window.URL.createObjectURL(blob);
  //
  //   const downloadLink = document.createElement("a");
  //   downloadLink.href = downloadUrl;
  //   downloadLink.download = fileName;
  //
  //   document.body.appendChild(downloadLink);
  //   downloadLink.click();
  //
  //   document.body.removeChild(downloadLink);
  //   window.URL.revokeObjectURL(downloadUrl);
  // });
}

onMounted(() => {
  handleQuery();
});
</script>

<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!-- 部门树 -->
      <el-col :lg="4" :xs="24" class="mb-[12px]">
        <pkg-tree v-model="queryParams.pkgId" @node-click="handleQuery" />
      </el-col>

      <!-- 用户列表 -->
      <el-col :lg="20" :xs="24">
        <div class="search-container">
          <el-form ref="queryFormRef" :model="queryParams" :inline="true">
            <el-form-item label="关键字" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                placeholder="用户名/昵称/手机号"
                clearable
                style="width: 200px"
                @keyup.enter="handleQuery"
              />
            </el-form-item>

            <el-form-item label="状态" prop="status">
              <el-select
                v-model="queryParams.status"
                placeholder="全部"
                clearable
                style="width: 200px"
              >
                <el-option label="启用" value="1" />
                <el-option label="禁用" value="0" />
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="handleQuery">
                <i-ep-search />
                搜索
              </el-button>
              <el-button @click="resetQuery">
                <i-ep-refresh />
                重置
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="never">
          <template #header>
            <div class="flex justify-between">
              <div>
                <el-button
                  v-hasPerm="['sys:package_item:add']"
                  type="success"
                  @click="openDialog('detail-form')"
                  >新增
                </el-button>
                <el-button
                  v-hasPerm="['sys:package_item:delete']"
                  type="danger"
                  :disabled="removeIds.length === 0"
                  @click="handleDelete()"
                >
                  <i-ep-delete />
                  删除
                </el-button>
              </div>
              <div>
                <el-dropdown split-button>
                  导入
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item @click="downloadTemplate">
                        <i-ep-download />
                        下载模板
                      </el-dropdown-item>
                      <el-dropdown-item @click="openDialog('user-import')">
                        <i-ep-top />
                        导入数据
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
                <el-button class="ml-3" @click="handleExport">
                  <template #icon>
                    <i-ep-download />
                  </template>
                  导出
                </el-button>
              </div>
            </div>
          </template>

          <el-table
            v-loading="loading"
            :data="pageData"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              key="id"
              label="编号"
              align="center"
              prop="id"
              width="100"
            />

            <!--            <el-table-column-->
            <!--              label="itemId"-->
            <!--              width="120"-->
            <!--              align="center"-->
            <!--              prop="itemId"-->
            <!--            />-->

            <el-table-column
              label="pkgName"
              width="120"
              align="center"
              prop="pkgName"
            />

            <el-table-column
              label="品物名"
              width="100"
              align="center"
              prop="itemName"
            />

            <el-table-column
              label="price"
              width="100"
              align="center"
              prop="itemPrice"
            />

            <el-table-column
              key="username"
              label="用户名"
              align="center"
              prop="username"
            />

            <el-table-column
              label="手机号码"
              align="center"
              prop="mobile"
              width="120"
            />

            <el-table-column
              label="注释"
              align="center"
              prop="comment"
              width="120"
            />

            <el-table-column label="状态" align="center" prop="status">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :inactive-value="0"
                  :active-value="1"
                  @change="changePKgStatus(scope.row)"
                />
              </template>
            </el-table-column>
            <el-table-column
              label="创建时间"
              align="center"
              prop="createTime"
              width="180"
            />
            <el-table-column label="操作" fixed="right" width="220">
              <template #default="scope">
                <!--                <el-button-->
                <!--                    v-hasPerm="['sys:user:reset_pwd']"-->
                <!--                    type="primary"-->
                <!--                    size="small"-->
                <!--                    link-->
                <!--                    @click="resetPassword(scope.row)"-->
                <!--                >-->
                <!--                  <i-ep-refresh-left/>-->
                <!--                  重置密码-->
                <!--                </el-button-->
                <!--                >-->
                <el-button
                  v-hasPerm="['sys:user:edit']"
                  type="primary"
                  link
                  size="small"
                  @click="openDialog('detail-form', scope.row.id)"
                >
                  <i-ep-edit />
                  编辑
                </el-button>
                <el-button
                  v-hasPerm="['sys:user:delete']"
                  type="primary"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  <i-ep-delete />
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <pagination
            v-if="total > 0"
            v-model:total="total"
            v-model:page="queryParams.pageNum"
            v-model:limit="queryParams.pageSize"
            @pagination="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>

    <!-- 弹窗 -->
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      :width="dialog.width"
      append-to-body
      @close="closeDialog"
    >
      <!-- 用户新增/编辑表单 -->
      <el-form
        v-if="dialog.type === 'detail-form'"
        ref="detailFormRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
      >
        <!--        <el-form-item label="用户名" prop="username">-->
        <!--          <el-input-->
        <!--              v-model="formData.username"-->
        <!--              :readonly="!!formData.id"-->
        <!--              placeholder="请输入用户名"-->
        <!--          />-->
        <!--        </el-form-item>-->

        <el-form-item label="用户" prop="username">
          <el-input v-model="formData.username" placeholder="请输入用户昵称" />
        </el-form-item>

        <el-form-item label="email" prop="email">
          <el-input v-model="formData.email" placeholder="请输入email" />
        </el-form-item>

        <!--        <el-form-item label="包裹名称" prop="deptId">-->
        <!--          <el-input v-model="formData.pkgName" placeholder="包裹名称" />-->
        <!--        </el-form-item>-->

        <el-form-item label="pkg名" prop="pkgId">
          <el-tree-select
            v-model="formData.pkgId"
            placeholder="请选择pkg名"
            :data="pkgList"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>

        <el-form-item label="品物名" prop="itemName">
          <el-input v-model="formData.itemName" placeholder="品物名" />
        </el-form-item>

        <!--        <el-form-item label="性别" prop="gender">-->
        <!--          <dictionary v-model="formData.gender" type-code="gender"/>-->
        <!--        </el-form-item>-->

        <!--                <el-form-item label="包裹名称" prop="roleIds">-->
        <!--                  <el-select v-model="formData.roleIds" multiple placeholder="请选择">-->
        <!--                    <el-option-->
        <!--                        v-for="item in roleList"-->
        <!--                        :key="item.value"-->
        <!--                        :label="item.label"-->
        <!--                        :value="item.value"-->
        <!--                    />-->
        <!--                  </el-select>-->
        <!--                </el-form-item>-->

        <!--        <el-form-item label="手机号码" prop="mobile">-->
        <!--          <el-input-->
        <!--            v-model="formData.mobile"-->
        <!--            placeholder="请输入手机号码"-->
        <!--            maxlength="11"-->
        <!--          />-->
        <!--        </el-form-item>-->

        <!--        <el-form-item label="邮箱" prop="email">-->
        <!--          <el-input-->
        <!--            v-model="formData.email"-->
        <!--            placeholder="请输入邮箱"-->
        <!--            maxlength="50"-->
        <!--          />-->
        <!--        </el-form-item>-->

        <el-form-item
          label="価格"
          prop="itemPrice"
          :rules="[
            { required: true, message: '请输入价格', trigger: 'blur' },
            {
              type: 'number',
              min: 1,
              max: 10000,
              message: '价格必须是数字格式:1-10000',
              trigger: 'blur',
            },
          ]"
        >
          <el-input
            v-model.number="formData.itemPrice"
            placeholder="请输入価格"
          />
        </el-form-item>
        <el-form-item label="comment" prop="comment">
          <el-input v-model="formData.comment" placeholder="请输入说明 " />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>

      <!--      &lt;!&ndash; 用户导入表单 &ndash;&gt;-->
      <!--      <el-form-->
      <!--          v-else-if="dialog.type === 'user-import'"-->
      <!--          :model="importData"-->
      <!--          label-width="100px"-->
      <!--      >-->
      <!--        <el-form-item label="部门">-->
      <!--          <el-tree-select-->
      <!--              v-model="importData.deptId"-->
      <!--              placeholder="请选择部门"-->
      <!--              :data="deptList"-->
      <!--              filterable-->
      <!--              check-strictly-->
      <!--          />-->
      <!--        </el-form-item>-->

      <!--        <el-form-item label="Excel文件">-->
      <!--          <el-upload-->
      <!--              ref="uploadRef"-->
      <!--              action=""-->
      <!--              drag-->
      <!--              accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"-->
      <!--              :limit="1"-->
      <!--              :auto-upload="false"-->
      <!--              :file-list="importData.fileList"-->
      <!--              :on-change="handleFileChange"-->
      <!--              :on-exceed="handleFileExceed"-->
      <!--          >-->
      <!--            <el-icon class="el-icon&#45;&#45;upload">-->
      <!--              <i-ep-upload-filled/>-->
      <!--            </el-icon>-->
      <!--            <div class="el-upload__text">-->
      <!--              将文件拖到此处，或-->
      <!--              <em>点击上传</em>-->
      <!--            </div>-->
      <!--            <template #tip>-->
      <!--              <div>xls/xlsx files</div>-->
      <!--            </template>-->
      <!--          </el-upload>-->
      <!--        </el-form-item>-->
      <!--      </el-form>-->
      <!-- 弹窗底部操作按钮 -->
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">确 定</el-button>
          <el-button @click="closeDialog">取 消</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>
