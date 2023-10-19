<template>
    <div class="user-manger">
        <div class="query-form">
            <el-form ref="form" :inline="true" :model="queryForm" size="small">
                <el-form-item label="审批状态" prop="state">
                    <el-select  v-model="queryForm.applyState">
                        <el-option label="所有" :value="0" />
                        <el-option label="待审批" :value="1" />
                        <el-option label="审批中" :value="2" />
                        <el-option label="审批拒绝" :value="3" />
                        <el-option label="审批通过" :value="4" />
                        <el-option label="作废" :value="5" />
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
                <el-button type="primary"  size="small"  @click="handleApply" v-has:add="'leave-apply'">申请休假</el-button>
            </div>
            <div>
                <el-table :data="applyList" size="small">
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
                            <el-button 
                                type="primary" 
                                @click="handleDetail(scope.row)" 
                                v-has:add="'leave-query'"
                            >查看</el-button>
                            <el-button 
                                type="danger" 
                                @click="handleDelete(scope.row._id)" 
                                v-if="[1,2].includes(scope.row.applyState)"
                                v-has:add="'leave-delete'"
                            >作废</el-button>
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
        <el-dialog title="申请休假" v-model="showModal" width="70%">
            <el-form ref="dialogForm" :model="leaveForm" label-width="120px" :rules = rules>

                <el-form-item label="休假类型" prop="applyType" required>
                    <el-select v-model="leaveForm.applyType">
                        <el-option label="事假" :value="1"></el-option>
                        <el-option label="调休" :value="2"></el-option>
                        <el-option label="年假" :value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="休假日期" required>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item prop="startTime" required>
                                <el-date-picker
                                    v-model="leaveForm.startTime"
                                    type="date"
                                    placeholder="请选择开始日期"
                                    @change="(val)=>handleDateChange('startTime',val)"
                                />
                            </el-form-item>
                        </el-col>
                        <el-col :span="1">-</el-col>
                        <el-col :span="8">
                            <el-form-item prop="endTime" required>
                                <el-date-picker 
                                    v-model="leaveForm.endTime"
                                    type="date"
                                    placeholder="请选择结束日期"
                                    @change="(val)=>handleDateChange('endTime',val)"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>

                </el-form-item>

                <el-form-item label="休假时长" prop="leaveTime" required>
                    {{ leaveForm.leaveTime }}
                </el-form-item>
                <el-form-item label="请假原因" prop="reasons" required>
                    <el-input 
                        type="textarea"
                        :row="3"
                        placeholder="请输入请假原因"
                        v-model="leaveForm.reasons"
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
        <el-dialog title="申请休假详情" width="50%" v-model="showDetailModal" destroy-on-close>
            <el-steps :active="detail.applyState > 2 ? 3:detail.applyState" align-center >
                <el-step title="待审批" description="Some description" />
                <el-step title="审批中" description="Some description" />
                <el-step title="审批拒绝/审批通过" description="Some description" />
            </el-steps>
            <el-form label="120px" label-suffix=":">
                <el-form-item label="休假类型">
                    <div>{{ detail.applyTypeName }}</div>
                </el-form-item>
                <el-form-item label="休假时间">
                    <div>{{ detail.time }}</div>
                </el-form-item>
                <el-form-item label="休假时长">
                    <div>{{ detail.leaveTime }}</div>
                </el-form-item>
                <el-form-item label="休假原因">
                    <div>{{ detail.reasons }}</div>
                </el-form-item>
                <el-form-item label="审批状态">
                    <div>{{ detail.applyStateName }}</div>
                </el-form-item>
                <el-form-item label="审批人">
                    <div>{{ detail.curAuditUserName }}</div>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import { watch } from 'vue';
import utils from './../utils/utils'
import {onMounted,ref, reactive, getCurrentInstance,toRaw} from 'vue'
    export default {
        name:'leave',
        setup(){
            const detail = ref({})
            const showDetailModal = ref(false)
            const action = ref('')
            const {proxy} = getCurrentInstance()
            const currentpage = ref(1)
            const pager = reactive({
                pageSize:10,
                pageNum:1,
                total:0
            })
            const showModal = ref(false)
            const applyList = ref([])
            const queryForm = reactive({
                applyState:0,
            })
            const leaveForm = reactive({
                applyType:1,
                startTime:'',
                endTime:'',
                leaveTime:"0天",
                reasons:''
            })
            const columns = reactive([
                {
                    label:'单号',
                    prop:'orderNo'
                },
                {
                    label:'休假时间',
                    prop:'',
                    formatter(row,columns,value){
                        return utils.formatDate(new Date(row.startTime),"yyyy-MM-dd") +
                        utils.formatDate(new Date(row.endTime),"yyyy-MM-dd")
                    }
                },
                {
                    label:'休假时长',
                    prop:'leaveTime'
                },
                {
                    label:'休假类型',
                    prop:'applyType',
                    formatter(row,columns,value){
                        return{
                            1:'事假',
                            2:'调休',
                            3:'年假'
                        }[value]
                    }
                },
                {
                    label:'休假原因',
                    prop:'reasons'

                },
                {
                    label:'申请时间',
                    prop:'createTime',
                    width:180,
                    formatter(row,columns,value){
                        return utils.formatDate(new Date(value))
                    }
                },
                {
                    label:'审批人',
                    prop:'auditUsers',
                },
                {
                    label:'当前审批人',
                    prop:'curAuditUserName',
                },
                {
                    label:'审批状态',
                    prop:'applyState',
                    formatter(row,columns,value){
                        return{
                            1:'待审批',
                            2:'审批中',
                            3:'审批拒绝',
                            4:'审批通过',
                            5:'作废'
                        }[value]
                    }
                },
            ]);
            const rules = {
                startTime:[
                    {
                        type:"date",
                        required:true,
                        message:"请输入开始日期",
                        trigger:"change"
                    }
                ],
                endTime:[
                    {
                        type:"date",
                        required:true,
                        message:"请输入截止日期",
                        trigger:"change"
                    }
                ],
                reasons:[
                    {
                        required:true,
                        message:"请输入请假原因",
                        trigger:"blur"
                    }
                ]
            }
            //初始化数据
            onMounted(()=>{
                getApplyList()
            })
            const getApplyList = async ()=>{
                let params = {...queryForm,...pager}
                let {list,page}= await proxy.$api.getApplyList(params)
                pager.total = page.total
                applyList.value = list
            }
            //点击申请休假 弹窗显示
            const handleApply = ()=>{
                action.value = 'create'
                showModal.value = true
                handleReset('dialogForm')
            }
            //插询按要求查询用户
            const handleQuery = ()=>{
                getApplyList()
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
            
            
            //取消按钮关闭弹窗
            const handleClose = ()=>{
                showModal.value = false
                handleReset('dialogForm')
            }
            const handleDetail = (row)=>{
                showDetailModal.value = true
                let data = {...row}
                data.applyTypeName = {
                    1:"事假",
                    2:"调休",
                    3:"年假"
                }[data.applyType]
                data.time = utils.formatDate(new Date(row.startTime),"yyyy-MM-dd") + " 至 " +
                            utils.formatDate(new Date(row.endTime),"yyyy-MM-dd")
                data.applyStateName = {
                    1:"待审批",
                    2:"审批中",
                    3:"审批拒绝",
                    4:"审批通过",
                    5:"作废",
                }[data.applyState]
                detail.value = data
                showDetailModal = true
            }
            const handleDelete = async(_id)=>{
                action.value = "delete"
                let params = {_id, action: action.value }
                let res = await proxy.$api.leaveOperate(params)
                getApplyList()
            }

            const handleDateChange = (key,val) =>{
                let {startTime,endTime} = leaveForm
                if(!startTime || !endTime){
                    return
                }
                if(startTime>endTime){
                    proxy.$message.error("开始日期不能大于截止日期！！")
                    leaveForm.leaveTime = "0天"
                    setTimeout(() => {
                        leaveForm[key] = ""   
                    });
                }else{
                    leaveForm.leaveTime = (endTime - startTime)/(24*60*60*1000) + 1 +'天'
                }
            }
            const handleSubmit =  ()=>{
                proxy.$refs.dialogForm.validate(async (valid)=>{
                    if(valid){
                        let params = {...leaveForm,action:action.value}
                        let res = await proxy.$api.leaveOperate(params)
                        proxy.$message.success("创建成功")
                        handleClose()
                        getApplyList()
                    }
                })
            }

            return {
                applyList,
                queryForm,
                pager,
                currentpage,
                columns,
                showModal,
                leaveForm,
                rules,
                detail,
                showDetailModal,
                handleDelete,
                handleDetail,
                handleDateChange,
                handleSubmit,
                getApplyList,
                handleClose,
                handleQuery,
                handleReset,
                handleApply
            }
        }
    }
</script>

<style lang="scss">
.pagination{
    margin: 0 auto;
}
</style>
