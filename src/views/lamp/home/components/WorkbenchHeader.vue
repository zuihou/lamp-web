<template>
  <div class="lg:flex">
    <AvatarPreview
      :fileId="userinfo.avatarId"
      :errorTxt="userinfo?.nickName?.substr(0, 2)"
      :size="72"
      :isDef="true"
      class="!mx-auto !block"
    />
    <div class="md:ml-6 flex flex-col justify-center md:mt-0 mt-2">
      <h1 class="md:text-lg text-md">早安, {{ userinfo.nickName }}, 开始您一天的工作吧！</h1>
      <span class="text-secondary"> {{ userinfo?.workDescribe ?? '这家伙很懒什么也没留下' }} </span>
    </div>
    <div class="flex flex-1 justify-end md:mt-0 mt-4">
      <div class="flex flex-col justify-center text-right">
        <span class="text-secondary"> 待办 </span>
        <span class="text-2xl">2/10</span>
      </div>

      <div class="flex flex-col justify-center text-right md:mx-16 mx-12">
        <span class="text-secondary"> 项目 </span>
        <span class="text-2xl">8</span>
      </div>
      <div class="flex flex-col justify-center text-right md:mr-10 mr-4">
        <span class="text-secondary"> 团队 </span>
        <span class="text-2xl">300</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { AvatarPreview } from '/@/components/AvatarPreview';
  import { useUserStore } from '/@/store/modules/user';

  const userStore = useUserStore();
  const userinfo = computed(() => userStore.getUserInfo);
</script>
