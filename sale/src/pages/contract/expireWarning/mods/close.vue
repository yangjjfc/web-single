<template>
    <yl-dialog title="提示" :show.sync="shows" width="600px" @submit="handleSubmit" >
        <div >
             <el-form ref="form" :model="form" label-width="120px"  size="small" status-icon :rules='rules' >
                    <el-form-item label=""  prop="reason">
                        <div class="text-warning">合同关闭后所有业务都不能引用此合同，确认关闭?</div>
                    </el-form-item>
                    <el-form-item label="关闭原因"  prop="closeReason">
                        <el-input v-model.trim="form.closeReason" :rows="3" type="textarea"  :maxlength="40"></el-input>
                    </el-form-item>
             </el-form>
        </div>
    </yl-dialog>
</template>

<script>

const URL = {
    close: 'yhlo.smc.contract.close'
};
export default {
    data () {
        return {
            form: {
                closeReason: '' 
            },
            rules: {
                closeReason: [
                    { required: true, message: '请输入关闭原因', trigger: 'blur' }
                ]
            }
        };
    },
    methods: {
        handleSubmit () {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.Http(URL.close, {
                        id: this.data.contractId,
                        closeReason: this.form.closeReason
                    }).then((res) => {
                        this.shows = false;
                        this.$message({
                            message: '操作成功',
                            type: 'success'
                        });
                        this.$emit('change');
                    });
                } else {
                    return false;
                }
            });
        }
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        data: {
            type: Object
        }
    },
    computed: {
        shows: {
            get () {
                return this.show;
            },
            set (newValue) {
                this.$emit('update:show', newValue);
            }
        }
    },
    created () {
      
    }
  
};
</script>

<style lang="scss" scoped>

</style>
