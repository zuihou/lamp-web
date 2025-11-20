<template>
  <BasicModal
    v-bind="$attrs"
    @register="registerModal"
    title="扫码获取系统账号密码"
    :maskClosable="false"
    width="50%"
    :keyboard="true"
  >
    <Typography>
      <TypographyTitle :level="2">1. 扫描下方小程序二维码</TypographyTitle>
      <TypographyParagraph>
        <Image :src="miniProgramImg" class="w-[100%]" />
      </TypographyParagraph>

      <TypographyTitle :level="2">
        2. 根据当前系统的网址或模式，进入对应的页面获取账号密码
      </TypographyTitle>
      <TypographyParagraph>
        <Image :src="miniProgramTipsImg" class="w-[100%]" />
      </TypographyParagraph>

      <TypographyTitle :level="2">
        3. 检查当前系统的域名与小程序中显示的域名是否一致。一致时，使用账号密码方可登录成功
      </TypographyTitle>
      <TypographyParagraph>
        <Image :src="miniProgramTipsImg2" class="w-[100%]" />
      </TypographyParagraph>
    </Typography>
  </BasicModal>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { Image, Typography, TypographyParagraph, TypographyTitle } from 'ant-design-vue';
  import { BasicModal, useModalInner } from '/@/components/Modal';
  import miniProgramImg from '/@/assets/img/dd-mini.png';
  import miniProgramTipsImg2 from '/@/assets/img/dd-tips2.png';
  import miniProgramTipsImg from '/@/assets/img/dd-tips.png';

  export default defineComponent({
    name: 'DatasourceConfigEdit',
    components: { BasicModal, Image, Typography, TypographyParagraph, TypographyTitle },
    emits: ['success', 'register'],
    setup(_) {
      const [registerModal] = useModalInner(async () => {});

      return { registerModal, miniProgramImg, miniProgramTipsImg, miniProgramTipsImg2 };
    },
  });
</script>
