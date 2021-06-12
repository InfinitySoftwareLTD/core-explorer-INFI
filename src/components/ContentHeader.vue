<template>
  <div>
    <div class="flex flex-col justify-between flex-wrap px-5 sm:px-10 xl:px-0">
      <h1 class="text-2xl md:text-3xl mb-5 md:mb-6 text-theme-text-primary sm:mr-5">
        <slot />
      </h1>
     <div
        class="hidden sm:flex"
      >
      <div class="hidden sm:flex items-center text-theme-text-tertiary text-xs px-3 sm:px-8 xl:px-6 py-3 mb-5 md:mb-6 rounded-md bg-stat-background">
        <div class="pr-6" v-if="redirect">   
           <div v-tooltip="'Switch to HEDGE'" class="text-grey text-xs">
               <a class="text-white" :href="baseurl" > 
                 <SvgIcon name="back-arrow-hedge2" view-box="0 0 16 16" :href="baseurl" />
               </a>
            </div>
        </div>
        <div class="pr-6">{{ $t("COMMON.HEIGHT") }}: {{ readableNumber(height) }}</div>
        <div class="pr-6">{{ $t("HEADER.NETWORK") }}: {{ $t(`HEADER.${alias.replace(" ", "_").toUpperCase()}`) }}</div>
        <!-- <div class="pr-6">
          {{ $t("HEADER.SUPPLY") }}: <span class="whitespace-no-wrap">{{ readableCrypto(supply, true, 0) }}</span>
        </div> -->
        <div :class="{ 'pr-6': showMarketCap }">{{ $t("HEADER.CURRENCYINCIRC") }}: {{ readableCrypto(cur, true, 2) }}</div>
        <div v-if="showMarketCap">
           {{ $t("HEADER.MARKET_CAP") }}: <span class="whitespace-no-wrap">{{ readableCurrency(cur, currentRate ) }}</span
          ><!-- jelmar Change -->
        </div>
      </div>
     </div>
    </div>
    <div
      class="sm:hidden flex items-center justify-between text-theme-text-tertiary text-xs px-5 sm:px-8 xl:px-6 py-3 bg-stat-background"
    >
      <div class="mr-2" v-if="redirect">
         <div v-tooltip="'Switch to HEDGE'" class="text-grey text-xs">
               <a class="text-white" :href="baseurl" > 
                 <SvgIcon name="back-arrow-hedge2" view-box="0 0 20 20" :href="baseurl" />
               </a>
          </div>
      </div>
      <div class="mr-2">
        <span>{{ $t("COMMON.HEIGHT") }}:</span>
        <span class="block md:inline-block">{{ readableNumber(height) }}</span>
      </div>
      <div class="mr-2">
        <span>{{ $t("HEADER.NETWORK") }}:</span>
        <span class="block md:inline-block">{{ $t(`HEADER.${alias.replace(" ", "_").toUpperCase()}`) }}</span>
      </div>
      <div class="mr-2">
        <!-- <span>{{ networkToken() }}/{{ name }}:</span>
        <span class="block md:inline-block">{{ rawCurrency(rate, name) }}</span> -->
        <span>{{ $t("HEADER.CURRENCYINCIRC") }}:</span>
        <span class="block md:inline-block">{{ readableCrypto(cur, true, 2) }}</span>
      </div>
      <div v-if="showMarketCap">
        <!-- <span>{{ $t("HEADER.SUPPLY") }}:</span>
        <span class="block md:inline-block whitespace-no-wrap">{{ readableCrypto(supply, true, 0) }}</span> -->
        <span>{{ $t("HEADER.MARKET_CAP") }}:</span>
        <span class="block md:inline-block whitespace-no-wrap">{{ readableCurrency(cur, currentRate ) }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import { mapGetters } from "vuex";

@Component({
  computed: {
    ...mapGetters("network", ["alias", "supply", "height", "isListed", "token", "cur"]),
    ...mapGetters("currency", ["name", "rate", "symbol", "currentRate"]),
  },
})
export default class ContentHeader extends Vue {
  private alias: string;
  private supply: string;
  private cur: string;
  private height: number;
  private name: string;
  private rate: number;
  private symbol: string;
  private isListed: boolean;
  private token: string;
  public baseurl: string = "";
  public redirect: boolean = false;

  created() {
    const { fullPath, name } = this.$route;
    this.baseurl = `https://explorer.hedge.infinitysolutions.io/#${fullPath}`;
    if(name === "home" || name === "wallet" || name === "top-wallets" || name === "delegate-monitor"){
        this.redirect = true;
    } 
  }

  get showMarketCap() {
    return this.isListed && this.token !== this.name;
  }

}
</script>
