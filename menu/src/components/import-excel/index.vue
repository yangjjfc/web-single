<template>
  <section class="included">
    <!-- 导入 -->
    <yl-dialog title="导入" :show.sync="shows" width="1000px" class="import-dialog" :close="false" :hideSubmitButton="true">
      <div id="importbody">
        <div class="header">
          <yl-icon icon="icon-gantanhao" class="icon-gantanhao"></yl-icon>
          <p>注：请下载模板填写数据再上传</p>
          <el-button type="primary" icon="el-icon-download" size="mini" class="btn-down" @click="downFile('template')">下载模板</el-button>
        </div>
        <div class="session">
          <el-form :inline="true" size="small">
            <el-form-item label="上传文件 ：" label-width="100px">
              <excel-upload @upload="readFile" :loading.sync="loading" @init="initData"></excel-upload>
            </el-form-item>
          </el-form>
          <p class="excel-tips" v-for="(item, index) in message" :key="index">{{item}}</p>
          <slot name="reset">
            <p class="excel-succerr-info" v-if="import_result.success">导入成功:({{import_result.success.length}}条 )</p>
            <div class="table-box" v-if="import_result.failed&&import_result.failed.length">
              <p v-for="(item,index) in import_result.failed" :key="item.outEnterpriseNo">
                第{{index + 1}}条 : {{item.result}}
              </p>
            </div>
          </slot>
        </div>
      </div>
    </yl-dialog>
  </section>
</template>

<script>
import { Tools } from 'ycloud-ui';
import ExcelUpload from './src/ExcelUpload';

export default {
    name: 'importExcel',
    data () {
        return {
            import_result: {
                success: '',
                failed: ''
            },
            showTable: false,
            loading: false,
            _downfile: '', // 下载模板地址
            oldData: ''
        };
    },
    props: {
        show: {
            type: Boolean,
            required: true,
            default: false
        },
        message: {
            type: Array,
            default () {
                return ['1. 导入功能只针对新增信息，不覆盖已有信息；', '2. 标“*”的栏目是必填项，不能为空'];
            }
        },
        params: {
            type: Object,
            required: false,
            default () {
                return {
                    readParams: {},
                    importsParams: {},
                    downParams: {}
                };
            }
        },
        url: {
            type: Object,
            required: true,
            default () {
                return {
                    read: '',
                    imports: '',
                    downFile: ''
                };
            }

        }
    },
    methods: {
    // 重新初始化data
        initData () {
            let _oldData = this.oldData,
                { entries } = Object,
                _data = JSON.parse(_oldData);
            for (let [key, value] of entries(_data)) {
                this[key] = value;
            }
            this.$emit('init');
            this.oldData = _oldData;
        },
        // 下载模板
        async downFile (type) {
            if (type === 'template' && !this._downfile) {
                let params = {};
                if (this.getType(this.params.downParams) === 'Function') {
                    params = this.params.downParams.call(this);
                } 
                let _data = Object.assign({}, params);
                await this.beforeDownFile(_data);
            }
            Tools.downloadFile(this._downfile);
        },
        getType (obj) {
            return Object.prototype.toString.call(obj).slice(8, -1);
        },
        // 上传Excel
        readFile (flies) {
            let params = {};
            if (this.params.importsParams) {
                if (this.getType(this.params.importsParams) === 'Function') {
                    params = this.params.importsParams.call(this, flies);
                } else {
                    params = { ...this.params.importsParams, url: flies };
                }
            } else {
                params = { url: flies };
            }
            this.Http(this.url.imports, params).then(res => {
                this.import_result = res.data;
                this.$emit('success', res.data);
            });
        },

        // 下载模板文件
        async beforeDownFile (params) {
            let res = await this.Http(this.url.downFile, params);
            if (typeof res.data === 'string' && res.data.includes('http')) {
                this._downfile = res.data;
            } else {
                this._downfile = process.env.IMAGE_DOWNLOAD + (res.data.url ? res.data.url : res.data);
            }
        }
    },
    created () {
        this.oldData = JSON.stringify(this._data);
        this.$emit('init');
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
    components: {
        ExcelUpload
    }
};
</script>

<style lang="scss" scoped>
/deep/ .import-dialog {
  .el-dialog__body {
    padding: 0;
  }
  .header {
    background: #fffff9;
    border-bottom: 1px #ffeccd solid;
    height: 52px;
    display: flex;
    align-items: center;
    padding-left: 30px;
    .icon-gantanhao {
      width: 32px;
      height: 32px;
      color: #f09031;
    }
    p {
      margin: 0 20px;
      color: #ff6600;
      font-size: 14px;
    }
    .btn-down {
      background: #ff8800;
      border-color: #ff8800;
    }
  }
  .session {
    padding: 20px 20px 10px 20px;
    .excel-tips {
      margin-left: 100px;
      margin-bottom: 5px;
      font-size: 14px;
    }
    .excel-succerr-info {
      font-size: 16px;
      color: $text-success-color;
    }
    .table-box {
      margin-top: 10px;
      border: 1px solid #e6ebf5;
      height: 300px;
      margin-bottom: 10px;
      padding: 10px;
      background: #fffced;
      line-height: 19px;
      font-size: 14px;
      overflow: auto;
      color: #ff6600;
    }
  }
}
</style>
