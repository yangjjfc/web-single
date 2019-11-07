<template>
    <div class="audit-img">
        <div class="audit__tag" :class="[color]">
            <span v-text="title" v-if="title"></span>
            <slot v-else></slot>
        </div>
    </div>
</template>

<script>
//单据状态 显示
export default {
    name: 'statusTag',
    data () {
        return {
        };
    },
    props: {
        title: {
            type: String
        },
        status: { // 状态
            type: String,
            default: 'info',
            validator: function (value) {
                return ['success', 'warning', 'danger', 'info'].indexOf(value) !== -1;
            }
        },
        width: {
            type: String,
            default: '80px'
        },
        height: {
            type: String,
            default: '35px'
        },
        top: {
            type: String,
            default: '10px'
        },
        right: {
            type: String,
            default: '10px'
        }
    },
    computed: {
        color () {
            return `audit__${this.status}`;
        },
        style () {
            return `width:${this.width};height:${this.height};top:${this.top};right:${this.right}`;
        }
    }
};
</script>

<style scoped lang="scss">
    $list-bg:info,danger,success,warning;
    .audit-img{
        position: absolute;
        right: 10px;
        top: 20px;
        z-index: 222;
        .audit__tag{
            transform: rotate(15deg);
            background-color: rgba(255,255,255, .5);
            box-shadow: 2px 2px 1px rgba(0,0,0,.1);
            padding: 5px 20px;

            font-size: 15px;
            @each $c in $list-bg{
                //$i:index($list-bg,$c);
                &.audit__#{$c}){
                    border: 2px color($c) solid;
                    color: color($c);
                }
            }
        }
    }
</style>
