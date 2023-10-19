<template>
    <div class="user-manger">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="user" size="small">
                <el-form-item label="用户ID" prop="userId"> 
                    <el-input v-model="user.userId" placeholder="请输入用户ID" />
                </el-form-item>
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="user.userName" placeholder="请输入用户用户名" />
                </el-form-item>

                <el-form-item label="状态" prop="state">
                    <el-select  v-model="user.state">
                        <el-option label="所有" :value="0" />
                        <el-option label="在职" :value="1" />
                        <el-option label="离职" :value="2" />
                        <el-option label="试用期" :value="3" />
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate" size="small" v-has:add="'user-create'">新增</el-button>
                <el-button type="danger" @click="handlePacthDel" size="small" v-has:add="'user-delete'">批量删除</el-button>
            </div>
            <div>
                <el-table :data="userList"  @selection-change="handleSelectionChange" size="small">
                    <el-table-column type="selection" width="55"/>
                    <el-table-column 
                        v-for="item in columns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        :formatter = "item.formatter"
                    />
                    <el-table-column label="操作" width="200">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row)" v-has:add="'user-edit'">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row)" v-has:add="'user-delete'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination 
                v-model:current-page="currentpage"
                :page-size = "pager.pageSize"
                background 
                layout="prev, pager, next" 
                :total="pager.total" 
            />
        </div>
        <el-dialog title="用户新增" v-model="showCreate">
            <el-form ref="dialogForm" :model="userForm" label-width="100px" :rules="rules" >
                <el-form-item label="用户名" prop="userName">
                    <el-input v-model="userForm.userName"  :disabled="action == 'edit'" placeholder="请输入用户名称"/>
                </el-form-item>
                <el-form-item label="邮箱" prop="userEmail">
                    <el-input v-model="userForm.userEmail" :disabled="action == 'edit'"  placeholder="请输入用户邮箱">
                        <template #append>
                            @163.com
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="mobile" >
                    <el-input v-model="userForm.mobile" placeholder="请输入手机号"/>
                </el-form-item>
                <el-form-item label="岗位" prop="job">
                    <el-input v-model="userForm.job" placeholder="请输入岗位"/>
                </el-form-item>
                <el-form-item label="状态" prop="state">
                    <el-select v-model="userForm.state">
                        <el-option :value="1" label="在职">在职</el-option>
                        <el-option :value="2" label="离职">离职</el-option>
                        <el-option :value="3" label="试用期">试用期</el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="系统角色" prop="roleList">
                    <el-select 
                    v-model="userForm.roleList" 
                    multiple
                    style="width: 100%;"
                    placeholder="请选择用户系统角色"
                    >
                        <el-option 
                            v-for="item in roleList" 
                            :key="item._id" 
                            :label="item.roleName"
                            :value="item._id"
                        >
                        {{ item.roleName }}
                    </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="部门" prop="deptId">
                    <el-cascader 
                    v-model="userForm.deptId" 
                    :options="deptList" 
                    :props="{checkStrictly:true,value:'_id',label:'deptName'}" 
                    clearable 
                    />
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit('dialogForm')">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { watch } from 'vue';
import utils from './../utils/utils'
import {onMounted,ref, reactive, getCurrentInstance,toRaw} from 'vue'
    export default {
        name:'user',
        setup(){
            const currentpage = ref(1)
            const {proxy } = getCurrentInstance();
            const deptList = ref([])
            const roleList =ref([])
            const action = ref('add')
            const user = reactive({
                state:1,
                userId:'',
                userName:''
            });
            const userForm = reactive({
                userName:'',
                state:3,
                mobile:undefined
            })
            const showCreate = ref(false)
            const rules = reactive({
                userName:[
                    {
                        required:true,
                        message:'请输入用户名称',
                        trigger:'blur'
                    },
                    { 
                        min: 2, 
                        max: 5, 
                        message: '名字长度应该为3到五5', 
                        trigger: 'blur' 
                    },
                ],
                userEmail:[
                    {
                        required:true,
                        message:'请输入用户邮箱',
                        trigger:'blur'
                    }
                ],
                mobile:[
                    {
                        pattern:/1[3-9]\d{9}/,
                        message:'请输入正确的手机号',
                        trigger:'blur'
                    }
                ],
                deptId:[
                {
                        required:true,
                        message:'请输入用户邮箱',
                        trigger:'blur'
                    }
                ]
            })
            const userList = ref([]);
            const pager = reactive({
                pageNum:1,
                pageSize:5
            })
            let checkeduserId = ref([])
            const columns = reactive([
                {
                    label:'用户ID',
                    prop:'userId'
                },
                {
                    label:'用户名',
                    prop:'userName'
                },
                {
                    label:'用户邮箱',
                    prop:'userEmail'
                },
                {
                    label:'用户角色',
                    prop:'role',
                    formatter(row,columns,value){
                        return{
                            0:'管理员',
                            1:'普通用户'
                        }[value]
                    }
                },
                {
                    label:'用户状态',
                    prop:'state',
                    formatter(row,columns,value){
                        return{
                            1:'在职',
                            2:'离职',
                            3:'试用期'
                        }[value]
                    }
                    
                },
                {
                    label:'注册时间',
                    prop:'createTime',
                    width:180,
                    formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                    }
                },
                {
                    label:'最后登录时间',
                    prop:'lastLoginTime',
                    width:180,
                    formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                    }
                },
            ]);
            //初始化数据
            onMounted(()=>{
                getuserList()
                getRoleAllList()
                getDeptList()
            })
            //操作弹窗显示
            const handleCreate = ()=>{
                action.value = 'add'
                showCreate.value = true
                handleReset('dialogForm')
            }
            //插叙按要求查询用户
            const handleQuery = ()=>{
                getuserList()
            }
            //重置表单
            const handleReset = (form)=>{
                proxy.$refs[form].resetFields()
            }
            //分页
            watch(currentpage,( newVal , oldVal )=>{ 
                pager.pageNum = newVal
                getuserList()
            })
            //获取批量选中的用户Id
            const handleSelectionChange = (value)=>{
                let arr = []
                value.map((item)=>{
                    arr.push(item.userId)
                })
                checkeduserId.value = arr
            }
            //批量删除用户
            const handlePacthDel = async()=>{
                if(checkeduserId.value.length == 0){
                    proxy.$message.error('请选择要删除的用户！')
                    return 
                }
                const res = await proxy.$api.userDelete({
                    userIds:checkeduserId.value
                })
                if(res.modifiedCount > 0){
                    proxy.$message.success('修改成功')
                    getuserList()
                }else{
                    proxy.$message.error('修改失败')
                }
            }
            //删除用户
            const handleDelete = async (row)=>{

                await proxy.$api.userDelete({
                    userIds:[row.userId]
                })

                proxy.$message.success('删除成功！')
            }
            //获取用户列表
            const getuserList = async()=>{
                let params = {...user,...pager}
                try {
                    const {list,page} = await proxy.$api.getuserList(params)
                    userList.value = list;
                    pager.total = page.total
                } catch (error) {
                    console.log(error)
                }
            }
            //获取部门信息
            const getDeptList = async()=>{
                let list = await proxy.$api.getDeptList()
                deptList.value = list
            }
            //获取角色列表信息
            const getRoleAllList = async ()=>{
                let list = await proxy.$api.getRoleAllList()
                roleList.value = list
            }
            //取消按钮关闭弹窗
            const handleClose = ()=>{
                showCreate.value = false
                handleReset('dialogForm')
            }
            //点击提交表单，创建用户信息
            const handleSubmit = ()=>{
                proxy.$refs.dialogForm.validate(async (validate)=>{
                    if(validate){
                        let params = toRaw(userForm)
                        params.userEmail += '@163.com'
                        params.action = action.value
                        console.log(params)
                        let res = await proxy.$api.userSubmit(params)
                            showCreate.value = false
                            if(action == "edit") proxy.$message.success('用户修改成功')
                            else proxy.$message.success('用户创建成功')
                            handleReset("dialogForm")
                            getuserList()
                    }
                })
            }
            //修改用户信息
            const handleEdit = (row)=>{
                action.value = 'edit'
                showCreate.value = true
                proxy.$nextTick(()=>{
                    Object.assign(userForm,row)
                })
            }
            return {
                rules,
                user,
                columns,
                userList,
                pager,
                checkeduserId,
                showCreate,
                userForm,
                roleList,
                deptList,
                action,
                currentpage,
                handleEdit,
                handleSubmit,
                handleClose,
                getRoleAllList,
                getDeptList,
                getuserList,
                handleQuery,
                handleReset,
                handleDelete,
                handlePacthDel,
                handleSelectionChange,
                handleCreate
            }
        }
    }
</script>

<style lang="scss">
.pagination{
    margin: 0 auto;
}
</style>
