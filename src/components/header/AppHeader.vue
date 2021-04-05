<template>
<div>
  <header v-click-outside="closeHeader" class="AppHeader min-h-50px md:min-h-80px mb-5 xl:rounded-md">
    <RouterLink
      :to="{ name: 'home' }"
      class="logo-container w-50px md:w-80px h-50px md:h-80px flex-none bg-theme-accents text-2xl xl:rounded-l-md flex justify-center items-center"
    >
      <img class="logo max-w35px md:max-w-35px" src="@/assets/images/logo.png" />
    </RouterLink>

    <div class="w-full relative hidden xl:flex">
      <HeaderSearch v-if="headerType === 'search'" />
      <HeaderCurrenciesDesktop v-else-if="headerType === 'currencies'" />
      <HeaderLanguagesDesktop v-else-if="headerType === 'languages'" />
      <HeaderDefault v-else />
      <HeaderMenuDesktop v-if="menuVisible" :entries="menuEntries" />
    </div>

    <div class="w-full relative flex xl:hidden">
      <HeaderSearch v-if="headerType === 'search'" />
      <HeaderDefault v-else />
    </div>

    <HeaderMenuMobile v-if="menuVisible" :entries="menuEntries" />
    <HeaderCurrenciesMobile v-else-if="headerType === 'currencies'" />
    <HeaderLanguagesMobile v-else-if="headerType === 'languages'" />
  </header>
   <div class="max-w-2xl mx-auto">
  <div class="flex justify-between flex-wrap px-5 sm:px-10 xl:px-0">
      <h1 class="text-theme-text-content font-normal text-base md:text-lg mt-2 sm:mr-5"> 
        <!-- jelmar change -->
        Infinity Coin 
      </h1>
   </div>
     <RouterLink
      :to="{ name: 'home' }"
      class="logo-container float-right sm:mr-2 md:mr-10 lg:mr-11 mr-11 xl:-mt-14px lg:-mt-14px sm:-mt-4 md:-mt-14px w-50px md:w-120px h-50px md:h-80px bg-sidelogo text-2xl xl:rounded-l-md  justify-center items-center xs:mr-3 xs:-mt-4"
    >
      <img class="logo max-w35px md:max-w-35px" src="@/assets/images/sidelogo.png" />
    </RouterLink> 
 </div>
</div>
</template>

<script lang="ts">
import { Component, Provide, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";
import {
  HeaderDefault,
  HeaderSearch,
  HeaderCurrenciesDesktop,
  HeaderCurrenciesMobile,
  HeaderLanguagesDesktop,
  HeaderLanguagesMobile,
  HeaderMenuDesktop,
  HeaderMenuMobile,
} from "@/components/header";

@Component({
  components: {
    HeaderDefault,
    HeaderSearch,
    HeaderCurrenciesDesktop,
    HeaderCurrenciesMobile,
    HeaderLanguagesDesktop,
    HeaderLanguagesMobile,
    HeaderMenuDesktop,
    HeaderMenuMobile,
  },
  computed: {
    ...mapGetters("ui", ["headerType", "menuVisible"]),
    ...mapGetters("network", ["hasMagistrateEnabled"]),

    menuEntries() {
      const entries = [{ name: "home" }, { name: "top-wallets", params: { page: 1 } }, { name: "delegate-monitor" }];

      if (this.hasMagistrateEnabled) {
        entries.push({ name: "businesses", params: { page: 1 } }, { name: "bridgechains", params: { page: 1 } });
      }

      entries.push({ name: "advanced-search", params: { page: 1 } });

      return entries;
    },
  },
})
export default class AppHeader extends Vue {
  @Provide("normalizeName") public foo = this.normalizeName;

  private headerType: string;
  private menuVisible: boolean;

  public normalizeName(name: string): string {
    return name.replace("-", "_").toUpperCase();
  }

  private closeHeader(): void {
    this.$store.dispatch("ui/setHeaderType", null);
  }
}
</script>

<style scoped>
.AppHeader {
  @apply .flex .sticky .top-0 .z-50 .max-w-2xl .mx-auto .bg-theme-nav-background .shadow-theme;
}
.text-theme-text-content {
    color: var(--color-theme-text-content);
}
.bg-sidelogo {
    background-color: #15151500;
}
</style>
