<template>
  <a-list :class="prefixCls" bordered>
    <template v-for="item in getData" :key="item.id">
      <a-list-item class="list-item">
        <a-list-item-meta>
          <template #title>
            <div class="title">
              <a-typography-paragraph
                :content="item.title"
                :delete="!!item.isRead"
                :ellipsis="
                  $props.titleRows > 0 ? { rows: $props.titleRows, tooltip: !!item.title } : false
                "
                :style="{ cursor: isTitleClickable ? 'pointer' : '' }"
                style="width: 100%; margin-bottom: 0 !important"
                @click="handleTitleClick(item)"
              />
            </div>
          </template>

          <template #description>
            <div>
              <div class="datetime">
                日期：{{ item.createdTime }}
                <template v-if="item.author">发布者:{{ item.author }}</template>
              </div>
            </div>
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
    <template #loadMore>
      <div
        v-if="value.total > 0"
        :style="{
          textAlign: 'center',
          marginTop: '12px',
          height: '32px',
          lineHeight: '32px',
        }"
      >
        <a href="javascript:void(0);" @click="loadMore(remindMode)"> 查看全部 >> </a>
      </div>
    </template>
  </a-list>
</template>
<script lang="ts">
  import { computed, defineComponent, PropType } from 'vue';
  import { List, Typography } from 'ant-design-vue';
  import { useRouter } from 'vue-router';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { PageResult } from '/@/api/model/baseModel';
  import { ExtendNoticeResultVO } from '/@/api/basic/msg/model/extendNoticeModel';
  import { NoticeRemindModeEnum } from '/@/enums/biz/base';
  import { RouteEnum } from '/@/enums/biz/tenant';

  export default defineComponent({
    components: {
      [List.name]: List,
      [List.Item.name]: List.Item,
      AListItemMeta: List.Item.Meta,
      ATypographyParagraph: Typography.Paragraph,
    },
    props: {
      value: {
        type: Object as PropType<PageResult<ExtendNoticeResultVO>>,
        default: () => {},
      },
      titleRows: {
        type: Number,
        default: 1,
      },
      remindMode: {
        type: String,
        default: NoticeRemindModeEnum.TO_DO,
      },
      onTitleClick: {
        type: Function as PropType<(item: ExtendNoticeResultVO) => void>,
      },
    },
    emits: ['update:currentPage'],
    setup(props) {
      const { prefixCls } = useDesign('header-notify-list');
      const { replace } = useRouter();
      const getData = computed(() => {
        const { value } = props;
        return value.records;
      });

      const isTitleClickable = computed(() => !!props.onTitleClick);

      function handleTitleClick(item: ExtendNoticeResultVO) {
        props.onTitleClick && props.onTitleClick(item);
      }

      function loadMore(remindMode: string) {
        replace({
          name: RouteEnum.BASIC_MY_MSG,
          query: { remindMode },
        });
      }

      return { prefixCls, getData, handleTitleClick, isTitleClickable, loadMore };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-header-notify-list';

  .@{prefix-cls} {
    &::-webkit-scrollbar {
      display: none;
    }

    ::v-deep(.ant-pagination-disabled) {
      display: inline-block !important;
    }

    &-item {
      padding: 6px;
      overflow: hidden;
      cursor: pointer;
      transition: all 0.3s;

      .title {
        margin-bottom: 8px;
        font-weight: normal;

        .extra {
          float: right;
          margin-top: -1.5px;
          margin-right: 0;
          font-weight: normal;

          .tag {
            margin-right: 0;
          }
        }

        .avatar {
          margin-top: 4px;
        }

        .description {
          font-size: 12px;
          line-height: 18px;
        }

        .datetime {
          margin-top: 4px;
          font-size: 12px;
          line-height: 18px;
        }
      }
    }
  }
</style>
