<template>
  <div class="max-w-2xl mx-auto md:pt-5">
    <ContentHeader>{{ $t("PAGES.DELEGATE_MONITOR.TITLE") }}</ContentHeader>

    <MonitorHeader />

    <section class="page-section py-5 md:py-10">
      <nav class="mx-5 sm:mx-10 mb-4 border-b flex items-end overflow-x-auto">
        <div :class="activeTab === 'active' && isScanDelegate === false ? 'active-tab' : 'inactive-tab'" @click="activeTab = 'active', isScanDelegate = false ">
          {{ $t("PAGES.DELEGATE_MONITOR.ACTIVE") }}
        </div>
        <div :class="activeTab === 'standby' && isScanDelegate === false  ? 'active-tab' : 'inactive-tab'" @click="activeTab = 'standby', isScanDelegate = false ">
          {{ $t("PAGES.DELEGATE_MONITOR.STANDBY") }}
        </div>
        <div :class="activeTab === 'resigned' && isScanDelegate === false  ? 'active-tab' : 'inactive-tab'" @click="activeTab = 'resigned', isScanDelegate = false ">
          {{ $t("PAGES.DELEGATE_MONITOR.RESIGNED") }}
        </div>
        <div :class="isScanDelegate === true ? 'active-tab' : 'inactive-tab'" @click="getScanDelegates">
          {{ 'Scan Delegates' }}
        </div>
      </nav>

      <ForgingStats v-show="activeTab === 'active' && isScanDelegate === false" :delegates="delegates || []" />

      <TableDelegates
        :delegates="delegates"
        :active-tab="activeTab"
        :curincir="cur"
        :sort-query="sortParams[activeTab]"
        @on-sort-change="onSortChange"
        v-if="isScanDelegate === false"
      />
      <TableScanDelegates
        :delegates="delegateScan"
        v-else
      />

      <div v-if="delegates && delegates.length === activeDelegates" class="mx-5 sm:mx-10 mt-5 md:mt-10 flex flex-wrap">
        <RouterLink
          :to="{
            name: activeTab === 'resigned' ? 'delegates-resigned' : 'delegates',
            params: { page: activeTab === 'standby' ? 5 : 3 },
          }"
          tag="button"
          class="button-lg"
        >
          {{ $t("PAGINATION.SHOW_MORE") }}
        </RouterLink>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from "vue-property-decorator";
import { mapGetters } from "vuex";
import { IDelegate, ISortParameters, delegatesScan } from "@/interfaces";
import { MonitorHeader, ForgingStats } from "@/components/monitor";
import DelegateService from "@/services/delegate";

@Component({
  components: {
    MonitorHeader,
    ForgingStats,
  },
  computed: {
    ...mapGetters("network", ["height", "activeDelegates", "cur"]),
  },
})
export default class DelegateMonitor extends Vue {
  private delegates: IDelegate[] | null = null;
  private delegateScans: delegatesScan[] | null = null;
  private delegateScan: delegatesScan[] | null = null;
  private activeTab = "active";
  private isScanDelegate: boolean = false;
  private height: number;
  private cur: string;

  public async getScanDelegates(){
    this.isScanDelegate = true;
     const delegates = await DelegateService.fetchEveryDelegate();
    // const delegates = await DelegateService.all();
    const scanDelegates = await DelegateService.scanDelegates();
    this.delegateScans = scanDelegates['infi'];
    for (let i = 0; i < delegates.length; i++) {
      const wallet = delegates[i];
      const walletAddress = wallet.address;
      this.delegateScans.map(item => {
          if(item.wallet_address === walletAddress){
            item.rank = wallet.rank;
          }
      })
    }  
    this.delegateScan = this.delegateScans.sort(function(a, b) {
      return a.rank - b.rank;
    }); 
    
  }

  get sortParams() {
    return this.$store.getters["ui/delegateSortParams"];
  }

  set sortParams(params: ISortParameters) {
    this.$store.dispatch("ui/setDelegateSortParams", {
      ...this.sortParams,
      [this.activeTab]: {
        field: params.field,
        type: params.type,
      },
    });
  }

  @Watch("height")
  public async onHeightChanged() {
    await this.setDelegates();
  }

  @Watch("activeTab")
  public async onActiveTabChanged() {
    this.delegates = null;
    await this.setDelegates();
  }

  public async created() {
    await this.setDelegates();
  }

  private async setDelegates() {
  
      if (this.height) {
        // @ts-ignore
        this.delegates = await DelegateService[this.activeTab]();
      }
    
  }

  private onSortChange(params: ISortParameters) {
    this.sortParams = params;
  }
}
</script>
