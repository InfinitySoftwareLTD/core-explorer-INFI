<template>
  <div class="max-w-2xl mx-auto md:pt-5">
    <ContentHeader>{{ $t("PAGES.TOP_WALLETS.TITLE") }}</ContentHeader>
    <section class="page-section py-5 md:py-10">
      <div class="hidden sm:block">
        <h2 class="py-5 unlisted-address-header text-center sm:mr-5 ml-5" @click="toggleUnlisted = !toggleUnlisted">{{ $t("PAGES.TOP_WALLETS.UNLISTED_ADDRESSES") }}</h2>
        <TableWalletsUnlisted v-show="toggleUnlisted"
          :wallets="unlistedwallets"
          :total="cur"
          :unlisted="hasUnlisted"
        />
        <h1 class="py-5 text-2xl mt-5 topwallets-address-header text-center">{{ $t("PAGES.TOP_WALLETS.TITLE") }}</h1>
        <TableWalletsDesktop
          :wallets="wallets"
          :total="cur"
          :unlisted="hasUnlisted"
          :sort-query="sortParams"
          @on-sort-change="onSortChange"
        />
      </div>
      <div class="sm:hidden">
        <TableWalletsMobile :wallets="wallets" :total="supply" />
      </div>
      <Pagination v-if="showPagination" :meta="meta" :current-page="currentPage" @page-change="onPageChange" />
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { Route } from "vue-router";
import { ISortParameters, IWallet } from "@/interfaces";
import WalletService from "@/services/wallet";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component({
  computed: {
    console: () => console,
    ...mapGetters("network", ["supply", "cur"]),
  },
})
export default class TopWallets extends Vue {
 
  get showPagination() {
    return this.meta && this.meta.pageCount > 1;
  }

  get sortParams() {
    return this.$store.getters["ui/walletSortParams"];
  }

  set sortParams(params: ISortParameters) {
    this.$store.dispatch("ui/setWalletSortParams", {
      field: params.field,
      type: params.type,
    });
  }
  private wallets: IWallet[] | null = null;
  private unlistedwallets: IWallet[] | null = null;
  private meta: any | null = null;
  private hasUnlisted = '0';
  private currentPage = 0;
  private supply: string;
  private toggleUnlisted = false;

  @Watch("currentPage")
  public onCurrentPageChanged() {
    this.changePage();
  }

  public async beforeRouteEnter(to: Route, from: Route, next: (vm?: any) => void) {
    try {
      const { meta, data, hasUnlisted, unlisted_addresses } = await WalletService.top(Number(to.params.page));
      
      next((vm: TopWallets) => {
        vm.currentPage = Number(to.params.page);
        vm.setWallets(data);
        vm.setUnlistedAddresses(unlisted_addresses);
        vm.setMeta(meta);
        vm.setUnlisted(hasUnlisted);
      });
    } catch (e) {
      console.log(e);
      next({ name: "404" });
    }
  }

  public async beforeRouteUpdate(to: Route, from: Route, next: (vm?: any) => void) {
    this.wallets = null;
    this.meta = null;
    this.hasUnlisted = null;
    this.unlistedwallets = null;

    try {
      const { meta, data, hasUnlisted, unlisted_addresses } = await WalletService.top(Number(to.params.page));

      this.currentPage = Number(to.params.page);
      this.setWallets(data);
      this.setUnlistedAddresses(unlisted_addresses);
      this.setMeta(meta);
      this.setUnlisted(hasUnlisted);
      next();
    } catch (e) {
      console.log(e);
      next({ name: "404" });
    }
  }

  public setMeta(meta: any) {
    this.meta = meta;
  }

  public setUnlisted(unlisted: any){
    this.hasUnlisted = unlisted;
  }

  public onPageChange(page: number) {
    this.currentPage = page;
  }

  public changePage() {
    if (this.currentPage !== Number(this.$route.params.page)) {
      // @ts-ignore
      this.$router.push({
        name: "top-wallets",
        params: {
          page: this.currentPage.toString(),
        },
      });
    }
  }

  private setWallets(wallets: IWallet[]) {
    this.wallets = wallets;
  }

  private setUnlistedAddresses(wallets: IWallet[]) {
    this.unlistedwallets = wallets;
  }

  private onSortChange(params: ISortParameters) {
    this.sortParams = params;
  }
}
</script>
