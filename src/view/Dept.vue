<template>
    <div class="dept-manage">
        <div class="query-form">
            <el-form inline ref="queryForm" :model="queryForm">
                <el-form-item label="部门名称">
                    <el-input
                        palceholder="请输入部门名称"
                        v-model="queryForm.deptName"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button @click="getDeptList">查询</el-button>
                    <el-button @click="handleReset(queryForm)">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleOpen" v-has:add="'dept-create'">创建</el-button>
            </div>
            <el-table :data="deptList" row-key="_id" :tress-props="{children:'children'}">
                <el-table-column
                    v-for="item in columns"
                    :key="item.prop"
                    v-bind="item"
                >
                </el-table-column>
                 <el-table-column>
                    <template #default="scope">
                        <el-button type="primary"  @click="handleEdit(scope.row)" v-has:add="'dept-edit'">编辑</el-button>
                        <el-button type="danger"  @click="handleDelete(scope.row._id)" v-has:add="'dept-delete'">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog :title="action=='create' ? '创建部门': ' 编辑部门'" v-model="showModel">
            <el-form ref="dialogForm" :model="deptForm" :rules="rules" label-width="120px">
                <el-form-item prop="parentId" label="上级部门">
                    <el-cascader
                        palceholder="请选择上级部门"
                        v-model="deptForm.parentId"
                        :props="{checkStrictly:true,value:'_id',label:'deptName'}" 
                        :options="deptList"
                        :show-all-levels="true"
                        clearable
                    ></el-cascader>
                </el-form-item>
                <el-form-item label="部门名称" prop="deptName">
                    <el-input placeholder="请输入部门名称" v-model="deptForm.deptName"></el-input>
                </el-form-item>
                <el-form-item label="部门负责人" prop="user">
                    <el-select placeholder="请选择部门负责人" v-model="deptForm.user" @change="handleuser">
                        <el-option 
                            v-for="item in userList" 
                            :key="item.userId"
                            :label="item.userName"
                            :value="`${item.userName}/${item.userId}/${item.userEmail}`"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="负责人邮箱" prop="userEmail">
                    <el-input placeholder="请选择部门负责人邮箱" disabled v-model="deptForm.userEmail"></el-input>
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button type="danger" @click="handleColse">取消</el-button>
                    <el-button type="primary" @click="handleSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from '../utils/utils'
    export default {
        name:'dept',
        data(){
            return{
                queryForm:{
                    deptName:''
                },
                deptList:[],
                columns:[
                    {
                        label:'部门名称',
                        prop:'deptName'
                    },
                    {
                        label:'负责人',
                        prop:'userName',
                    },
                    {
                        label:'更新时间',
                        prop:'updateTime',
                        width:170,
                        formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                        }
                    },
                    {
                        label:'创建时间',
                        prop:'createTime',
                        width:170,
                        formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                        }
                    },
                ],
                pager:{
                    pageNun:1,
                    pageSize:10,
                    total:1
                },
                action:'',
                showModel:false,
                userList:[],
                deptForm:{
                    parentId:[null]
                },
                rules:{
                    parentId:[
                        {
                            required:true,
                            message:'请选择上级部门',
                            trigger:'blur'
                        }
                    ],
                    deptName:[
                        {
                            required:true,
                            message:'请输入部门名称',
                            trigger:'blur'
                        }
                    ],
                    user:[
                        {
                            required:true,
                            message:'请输入负责人',
                            trigger:'blur'
                        }
                    ],

                }
            }
        },
        mounted(){
            this.getDeptList()
            this.getuserAllList()
        },
        methods:{
            //获取部门列表
            async getDeptList(){
                let list = await this.$api.getDeptList(this.queryForm)
                this.deptList = list
                console.log(list)
            },
            // 获取全部用户列表
            async getuserAllList(){
                try {
                    const list = await this.$api.getuserAllList()
                    this.userList = list;
                } catch (e) {
                    throw new Error(e)
                }
            },
            //重置表单
            handleReset(form){
                this.$nextTick(() => {
                    this.$refs[form].resetFields();
                });
            },
            //创建部门
            handleOpen(){
                this.showModel = true
                this.action = "create"
                this.handleReset('dialogForm')
            },
            //编辑部门信息
            async handleEdit(row){
                this.showModel = true
                this.action = "edit"
                this.handleReset('dialogForm')
                this.$nextTick(()=>{
                    Object.assign(this.deptForm,row,{
                        user: `${row.userName}/${row.userId}/${row.userEmail}`
                    })
                })
            },
            //删除部门
            async handleDelete(_id){
                this.action = "delete"
                await this.$api.deptOperate({_id,action: this.action})
                this.$message.success('删除成功')
                this.getDeptList()
                
            },
            //获取用户的邮箱
            handleuser(val){
                const [userName,userId,userEmail,] = val.split('/')
                Object.assign(this.deptForm,{userName,userId,userEmail})
            },
            //取消按钮
            handleColse(){
                this.showModel = false
                this.handleReset('dialogForm')
            },
            //提交表单
            handleSubmit(){
                this.$refs.dialogForm.validate(async (valid)=>{
                    if(valid){
                        let params = { ...this.deptForm}
                        delete params.user
                        params.action = this.action
                        console.log(params)
                        await this.$api.deptOperate(params)
                        this.handleColse()
                        this.$message.success('操作成功')
                        this.getDeptList()

                    }
                })
            }
        }
    }
</script>

<style>

</style>