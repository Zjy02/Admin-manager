<template>
    <div class="role-manger">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm" size="small">
                <el-form-item label="角色名称" prop="menuName"> 
                    <el-input v-model="queryForm.menuName" placeholder="请输入菜单名称" />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleQuery">查询</el-button>
                    <el-button @click="handleReset('form')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="base-table">
            <div class="action">
                <el-button type="primary" @click="handleCreate" size="small" v-has:add="'role-create'">创建</el-button>
            </div>
            <div>
                <el-table :data="roleList">
                    <el-table-column 
                        v-for="item in columns"
                        :key="item.prop"
                        :prop="item.prop"
                        :label="item.label"
                        :width="item.width"
                        :formatter = "item.formatter"
                    />
                    <el-table-column label="操作" width="260">
                        <template #default="scope">
                            <el-button type="primary" @click="handleEdit(scope.row)" v-has:add="'role-edit'">编辑</el-button>
                            <el-button type="primary" @click="handleOpenPermission(scope.row)" v-has:add="'role-permission'">设置权限</el-button>
                            <el-button type="danger" @click="handleDelete(scope.row._id)" v-has:add="'user-delete'">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-pagination 
                class="pagination"
                @current-change = "handleCurrentChange"
                :page-size = "pager.pageSize"
                background 
                layout="prev, pager, next" 
                :total="pager.total" 
            />
        </div>
        <el-dialog title="角色新增" v-model="showCreate"> 
            <el-form ref="dialogForm" :model="roleForm" label-width="100px" :rules="rules" >
                <el-form-item label="角色名称" prop="roleName" >
                    <el-input v-model="roleForm.roleName" placeholder="请输入角色名称"/>
                </el-form-item>
                <el-form-item label="备注" prop="remark" >
                    <el-input 
                    type="textarea" 
                    v-model="roleForm.remark" 
                    placeholder="请输入备注"
                    :row="2"
                    />
                </el-form-item>
                
            </el-form>
            <template #footer>
                <span>
                    <el-button @click="handleClose">取消</el-button>
                    <el-button type="primary" @click="handleSubmit()">确定</el-button>
                </span>
            </template>
        </el-dialog> 
        <el-dialog title="权限设置" v-model="showPermission"> 
            <el-form>
                <el-form-item label="角色名称" prop="roleName" >
                    {{ curRoleName }}
                </el-form-item>
                <el-form-item label="选择权限">
                    <el-tree
                        ref="permissionTree"
                        node-key="_id"
                        :data="menuList"
                        :props="{label:'menuName'}"
                        show-checkbox
                        default-expanded-keys = "[6472fb9cd66648a46ab93ccb,6472fb7ad66648a46ab93cc7,6473068c08a97bd857263360]"
                    />
                </el-form-item>
                
            </el-form>

            <template #footer>
                <span>
                    <el-button @click="this.showPermission = false">取消</el-button>
                    <el-button type="primary" @click="handlePermissionSubmit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import utils from './../utils/utils'
    export default {
        name:'role',
        data(){
            return {
                //菜单映射表
                actionMap:{},
                //菜单列表
                menuList:[],
                //获取某一行的角色id 点击设置权限时
                curRoleId:'',
                //获取某一行的角色名字 点击设置权限时
                curRoleName:'',
                //是否显示设置权限的弹窗
                showPermission:false,
                //标记当前操作类型(删除，编辑，新增)
                action:'',
                //是否显示新增弹窗
                showCreate:false,
                //表单的数据
                roleForm:{},
                //分页
                pager:{
                    pageNum:1,
                    total:1,
                    pageSize:10,
                },
                //角色列表
                roleList:[],
                //查询的表单数据
                queryForm:{
                    roleName:""
                },
                //角色列表的行 字段
                columns:[{
                    label:'角色名称',
                    prop:'roleName',
                    width:150
                },{
                    label:'备注',
                    prop:'remark',
                },{
                    label:'权限列表',
                    prop:'permissionList',
                    formatter:(row,columns,value)=>{
                        let names = []
                        let list = value.halfCheckedKeys 
                        list.map((item)=>{
                            let name = this.actionMap[item]
                            if(name && item)names.push(name)
                        })
                        return names.join(',')
                    }

                },{
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
            
            rules:{}
            }
        },
        mounted(){
            this.getRoleList()
            this.getMenuList()
        },
        methods:{
            async getMenuList(){
                try {
                    let list = await this.$api.muneList(this.queryForm)
                    this.menuList = list
                    this.getActionMap(list)
                } catch (e) {
                    throw new Error(e)
                }
            },
            async getRoleList(){
                try {
                    let {list,page} = await this.$api.getRoleList({...this.queryForm,...this.pager})
                    this.roleList = list
                    this.pager.total = page.total
                } catch (e) {
                    throw new Error(e)
                }
            },
            handleCurrentChange(current){
                this.pager.pageNum = current
                this.getRoleList()
            },
            handleQuery(){
                this.getRoleList()
            },
            handleReset(form){
                this.$refs[form].resetFields()
            },
            handleAdd(type,row){
                this.action = 'add'
                this.showCreate = true
                if(type == 2){
                    this.menuForm.parentId = [...row.parentId, row._id].filter((item)=>{
                        return item
                    })
                }
            },
            //新增角色
            handleCreate(){
                this.action = 'create'
                this.showCreate = true
                this.handleReset('dialogForm')
            },
            //弹窗关闭
            handleClose(){
                this.showCreate = false
                this.handleReset('dialogForm')
            },
            //角色编辑
            handleEdit(row){
                this.action = 'edit'
                this.showCreate = true
                this.$nextTick(()=>{
                    this.roleForm = {roleName:row.roleName, remark:row.remark,_id:row._id}
                })
                
            },
            //角色删除
            async handleDelete(_id){
                await this.$api.roleOperate({_id,action:'delete'})
                this.$message.success('删除成功')
                this.getRoleList()
            },
            //角色提交
            handleSubmit(){
                this.$refs.dialogForm.validate( async (valid)=>{
                    if(valid){
                        const { action,roleForm } = this
                        let params = {...roleForm,action}
                        let res = await this.$api.roleOperate(params)
                        if(res){
                            this.showCreate = false
                            this.$message.success('操作成功')
                            this.handleReset('dialogForm')
                            this.getRoleList()
                        }
                    }
                })
            },
            // 打开权限设置弹窗
            handleOpenPermission(row){
                this.curRoleId = row._id
                this.curRoleName = row.roleName
                this.showPermission = true
                setTimeout(() => {
                    //从后台拿倒角色当前拥有的权限(菜单和按钮)
                    let { checkedKeys } =row.permissionList
                    //将获取的权限在页面上选中
                    this.$refs.permissionTree.setCheckedKeys(checkedKeys)
                });  
            },
            // 点击确定按钮
            async handlePermissionSubmit(){
                
                //获取被选中的菜单的id
                let nodes = this.$refs.permissionTree.getCheckedNodes()
                //获取被选中的菜单的id
                let halfkeys = this.$refs.permissionTree.getHalfCheckedKeys()
                //将菜单和按钮的id分类
                let checkedKeys = []
                let parentKeys = []
                nodes.map((item)=>{
                    if(!item.children){
                        checkedKeys.push(item._id)
                    }else{
                        parentKeys.push(item._id)
                    }
                })
                //请求后端更新权限
                let params = {
                    _id: this.curRoleId,
                    permissionList:{
                        checkedKeys,
                        halfCheckedKeys:parentKeys.concat(halfkeys)
                    }
                }
                await this.$api.updatePermission(params)
                this.showPermission = false
                this.$message.success('设置成功')
                this.getRoleList()
            },
            //递归生成角色字典
            getActionMap(list){
                let actionMaps = {}
                const deep = (arr)=>{
                    while(arr.length){
                        let item = arr.pop()
                        if(item.children && item.action){
                            actionMaps[item._id] = item.menuName
                        }
                        if(item.children && !item.action){
                            deep(item.children)
                        }
                    }
                }
                deep(JSON.parse(JSON.stringify(list)))
                this.actionMap = actionMaps
            }
        }
    }
</script>

<style lang="scss">
.pagination{
    margin: 0 auto;
}
</style>