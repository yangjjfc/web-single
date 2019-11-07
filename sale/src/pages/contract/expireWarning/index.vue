<template>
  <section class="container_setion">
    <el-row>
      <el-col :span="24">
        <el-form :inline="true" size="small" @submit.native.prevent>
          <el-form-item>
            <el-select v-model="search.expiration" placeholder="请选择" class="w160" @change="getList(1)" size="small">
              <el-option label="到期时间" value="all"></el-option>
              <el-option label="30天内过期" value="thirty"></el-option>
              <el-option label="90天内过期" value="ninety"></el-option>
              <el-option label="180天内过期" value="halfAYear"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-select v-model="search.businessTypeId" placeholder="请选择" class="w160" @change="getList(1)" size="small">
              <el-option label="合同类型" value="all"></el-option>
              <el-option v-for="item in businessType" :key="item.id" :label="item.businessName" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item class="searchBox">
            <el-input v-model.trim="search.keywords" placeholder="经销商名称/合同号/合同名称" class="w200" size="small" @keyup.enter.native="getList(1)" clearable></el-input>
            <el-button type="primary" icon="el-icon-search" size="small" class="mgr10" @click="getList(1)">查询</el-button>
            <el-button size="small" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="24">
        <el-table :data="list" ref="my-table" :max-height="tableHeight" stripe style="width: 100%" border size="small" class="my-table">
          <el-table-column prop="indexX" label="序号" width="50" align="center"></el-table-column>
          <el-table-column prop="customerName" label="经销商名称" min-width="140"></el-table-column>
          <el-table-column prop="businessType" label="合同类型" min-width="120"></el-table-column>
          <el-table-column prop="contractNo" label="合同编号" min-width="120"></el-table-column>
          <el-table-column prop="contractName" label="合同名称" min-width="120"></el-table-column>
          <el-table-column prop="contractAmount" label="合同金额" align="right" min-width="120">
            <template slot-scope="scope">
              <div>
                {{scope.row.contractAmount | money}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="amountReceived" label="已收款金额" align="right" min-width="120">
            <template slot-scope="scope">
              <div>
                {{scope.row.amountReceived | money}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderAmount" label="订单结算金额" align="right" min-width="120">
            <template slot-scope="scope">
              <div>
                {{scope.row.orderAmount | money}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="contractAdvancePaymentBalance" label="未回款金额" width="120" align="right">
            <template slot-scope="scope">
              <div>
                {{scope.row.unpaidAmount | money}}
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="days" label="到期天数" width="120">
               <template slot-scope="scope">
              <div>
                  <span :class="{'text-danger':scope.row.days}">{{scope.row.days?scope.row.days+'天后到期':'--'}}</span>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="contractDeadline" label="终止时间" width="120"></el-table-column>
          <el-table-column label="操作" width="120" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="text" @click="handleDetail(scope.row)" v-auth:BTN_CONTRACT_MANAGER_DETAIL>详情</el-button>
              <el-button size="mini" type="text" @click="handleClose(scope.row)" v-auth:BTN_CONTRACT_MANAGER_CLOSE>关闭合同</el-button>
            </template>
          </el-table-column>
        </el-table>
        <yl-pagination class="right mgt10" :total="page.total" :pageSize.sync="page.pageSize" :currentPage.sync="page.pageIndex" @change="getList" v-show="page.total"></yl-pagination>
      </el-col>
    </el-row>
    <!-- 关闭合同 -->
    <Dclose v-if="close.show" v-bind="close" :show.sync="close.show" @change="getList"></Dclose>
  </section>
</template>

<script type="text/ecmascript-6">
import commonMix from '@/utils/mixins/commonMix';
import {tableAutoHeight} from 'ycloud-ui'
import Dclose from './mods/close';

const URL = {
    findListPage: 'ddc.smc.payment.selectPageContractAdvanceReceiptDetailsVos',
    findList: 'yhlo.smc.contractBusinessType.findList'// 合同类型
};
const effectStatus = {
    'stay_take_effect': '待生效',
    'take_effect': '生效',
    'close': '关闭'
};
const SEARCH = {
    contractStatus: 'all',
    contractStatusCode: 'take',
    keywords: '',
    expiration: 'halfAYear',
    balanceSituation: 'all',
    businessTypeId: 'all'
};
export default {
    mixins: [commonMix, tableAutoHeight],
    data () {
        return {
            search: { ...SEARCH },
            list: [],
            close: {
                show: false,
                data: { }
            },
            businessType: [],
            totalAmount: 0 // 合计
        };
    },
    created () {
        this.getBusinessType();
        this.getList();
    },
    activated () {
        if (!this.$activated) {
            this.$activated = true;
            return;
        }
        this.getList();
    },
    methods: {
        getList (pageIndex = this.page.pageIndex, pageSize = this.page.pageSize) {
            let params = { ...this.search };
            this.Http(URL.findListPage, {
                params,
                pageParams: {
                    pageIndex: pageIndex,
                    pageSize: pageSize
                }
            }).then((res) => {
                let data = res.data;
                let { total, pageIndex, pageSize } = data;
                this.page = { total, pageIndex, pageSize };
                this.totalAmount = data.totalAmount;
                if (data.rows) {
                    this.list = data.rows.map((item, index) => {
                        item.indexX = (this.page.pageIndex - 1) * this.page.pageSize + index + 1;
                        item.contractStatusX = effectStatus[item.contractStatus];
                        return item;
                    });
                }
            });
        },
        getBusinessType () {
            this.Http(URL.findList, {
                params: {}
            }).then(res => {
                this.businessType = res.data;
            });
        },
        handleDetail (row) {
            this.$router.push({
                name: 'contractDetail',
                query: {
                    sourceName: this.$route.name,
                    type: 'detail',
                    id: row.contractId
                }
            });
        },
        // 新建调价单/编辑
        handlePrice (row = {}) {
            let $json = {
                ...row
            };
            this.$setItem('fundCreditAdd', $json);
            this.$router.push({
                name: 'fundCreditAdd',
                query: {
                    label: '处理收款单',
                    '$no': this.$route.meta.no,
                    sourceName: this.$route.name,
                    id: row.id,
                    type: 'edit',
                    source: 'contractAdvances',
                    view: 0
                }
            });
        },
        handleClose (row) {
            this.close.show = true;
            this.close.data = row;
        },
        reset () {
            this.search = { ...SEARCH };
            this.getList(1);
        }
    },
    components: {
        Dclose
    }
};
</script>

<style scoped lang="scss">
</style>
