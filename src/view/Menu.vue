<template>
    <div class="user-manger">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm" size="small">
                <el-form-item label="菜单名称" prop="menuName"> 
                    <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState">
                    <el-select  v-model="queryForm.menuState">
                        <el-option label="正常" :value="1" />
                        <el-option label="停用" :value="2" />
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
                <el-button type="primary" @click="handleCreate" size="small" v-has:add="'menu-create'">新增</el-button>
            </div>
            <div>
                <el-table 
                    :data="menuList"  
                    size="small"
                    row-key="_id"
                    :tree-props="{children:'children'}"
                >
                    <el-table-column type="selection" width="55"/>
                    <el-table-column 
                        v-for="item in columns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        :formatter = "item.formatter"
                    />
                    <el-table-column label="操作" width="250">
                        <template #default="scope">
                            <el-button type="danger" @click="handleAdd(2,scope.row)" v-has:add="'menu-create'">新增</el-button>
                            <el-button type="primary" @click="handleEdit(scope.row)" v-has:add="'menu-edit'">编辑</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row._id)" v-has:add="'menu-delete'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
        <el-dialog title="菜单新增" v-model="showCreate">
            <el-form ref="dialogForm" :model="menuForm" label-width="100px" :rules="rules" >
                <el-form-item label="父级菜单" prop="parentId">
                    <el-cascader 
                    v-model="menuForm.parentId" 
                    :options="menuList" 
                    :props="{checkStrictly:true,value:'_id',label:'menuName'}" 
                    clearable 
                    />
                    <span>不选则直接创建一级菜单</span>
                </el-form-item>
                <el-form-item label="菜单类型" prop="menuType">
                    <el-radio-group v-model="menuForm.menuType">
                        <el-radio :label="1">菜单</el-radio>
                        <el-radio :label="2">按钮</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="菜单名称" prop="menuName" >
                    <el-input v-model="menuForm.menuName" placeholder="请输入菜单名称"/>
                </el-form-item>
                <el-form-item label="菜单图标" prop="icon" v-show="menuForm.menuType == 1">
                    <el-input v-model="menuForm.icon" placeholder="请输入菜单图标"/>
                </el-form-item>
                <el-form-item label="路由地址" prop="path" v-show="menuForm.menuType == 1">
                    <el-input v-model="menuForm.path" placeholder="请输入路由地址"/>
                </el-form-item>
                <el-form-item
                    label="组件路径"
                    prop="component"
                    v-show="menuForm.menuType == 1"
                >
                    <el-input v-model="menuForm.component" placeholder="请输入组件路径" />
                </el-form-item>
                <el-form-item label="权限标识" prop="menuCode" v-show="menuForm.menuType == 2">
                    <el-input v-model="menuForm.menuCode" placeholder="请输入权限标识"/>
                </el-form-item>
                <el-form-item label="菜单状态" prop="menuState"  v-show="menuForm.menuType == 1">
                    <el-radio-group v-model="menuForm.menuState">
                        <el-radio :label="1">正常</el-radio>
                        <el-radio :label="2">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from './../utils/utils'
    export default {
        name:'menu',
        data(){
            return {
                showCreate:false,
                menuList:[],
                menuForm:{
                    menuState: 1,
                    menuType:1,
                    parentId: [null]
                },
                action:'add',
                queryForm:{
                    menuState:1
                },
                columns:[{
                    label:'菜单名称',
                    prop:'menuName',
                    width:150
                },{
                    label:'图标',
                    prop:'icon',
                },{
                    label:'菜单类型',
                    prop:'menuType',
                    width:90,
                    formatter(row,columns,value){
                        return {
                            '1':'菜单',
                            '2':'按钮'
                        }[value]
                    }
                },{
                    label:'权限标识',
                    prop:'menuCode',
                },{
                    label:'路由地址',
                    prop:'path',
                },
                {
                    label:'组件路径',
                    prop:'component',
                },
                {
                    label:'菜单状态',
                    width:90,
                    prop:'menuState',
                    formatter(row,columns,value){
                        return {
                            '1':'正常',
                            '2':'禁用'
                        }[value]
                    }
                },{
                    label:'创建时间',
                    prop:'createTime',
                    width:150,
                    formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                    }
                },
            ],
            rules:
                {
                    menuName:[
                        {
                            required:true,
                            message: "请输入菜单名称",
                            trigger: "blur"
                        },
                        {
                            min:2,
                            max:10,
                            message:'长度为2-8个字符',
                            trigger:'blur'
                        }
                    ]
                }
            
            }
        },
        mounted(){
            this.getMenuList()
        },
        methods:{
            async getMenuList(){
                try {
                    let res = await this.$api.muneList(this.queryForm)
                    this.menuList = res
                } catch (error) {
                    
                }
            },
            handleQuery(){
                this.getMenuList()
            },
            handleReset(form){
                this.$refs[form].resetFields()
            },
            handleAdd(type,row){
                this.action = 'add'
                this.showCreate = true
                if(type == 2){
                    this.menuForm.parentId = [...row.parentId, row._id].filter((item)=>item)
                }
            },
            handleCreate(){
                this.showCreate = true
                this.action = 'add'
                this.handleReset('dialogForm')
            },
            handleClose(){
                this.showCreate = false
                this.handleReset('dialogForm')
            },
            handleEdit(row){
                this.action = 'edit'
                this.showCreate = true
                this.$nextTick(()=>{
                    Object.assign(this.menuForm,row)
                })
            },
            async handleDelete(_id){
                await this.$api.menuSubmit({_id,action:'delete'})
                this.$message.success('删除成功')
                this.getMenuList()
            },
            handleSubmit(){
                this.$refs.dialogForm.validate( async (valid)=>{
                    if(valid){
                        const { action,menuForm } = this
                        let params = {...menuForm,action}
                        let res = await this.$api.menuSubmit(params)
                        this.showCreate = false
                        this.$message.success('操作成功')
                        this.handleReset('dialogForm')
                        this.getMenuList();
                    }
                })
            }
        }
    }
</script>

<style lang="scss">
.pagination{
    margin: 0 auto;
}
</style>