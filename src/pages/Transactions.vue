<template>
  <div class="max-w-2xl mx-auto md:pt-5">
    <ContentHeader>{{ $t("COMMON.TRANSACTIONS") }}</ContentHeader>

    <section class="hidden sm:block mb-5">
      <div class="px-5 sm:px-10 py-8 bg-theme-feature-background flex xl:rounded-lg items-center justify-between">
        <div class="flex-auto min-w-0">
          <div class="text-grey mb-2">
            {{ $t("TRANSACTION.TYPE") }}
          </div>
          <div class="flex">
            <div class="text-lg text-white semibold truncate">
              <span class="mr-2">{{ $t(`TRANSACTION.TYPES.${transactionType.key}`) }}</span>
            </div>
          </div>
        </div>
        <div class="flex flex-col w-full sm:w-auto sm:ml-4 sm:-mr-10">
          <SelectionType :in-banner="true" @change="setType" />
        </div>
      </div>
    </section>

    <section class="page-section py-5 md:py-10">
      <div class="hidden sm:block">
        <TableTransactionsDesktop
          :transactions="transactions"
          :sort-query="sortParams"
          @on-sort-change="onSortChange"
        />
      </div>
      <div class="sm:hidden">
        <div class="mx-5 mb-4">
          <SelectionType @change="setType" />
        </div>

        <TableTransactionsMobile :transactions="transactions" />
      </div>
      <Pagination v-if="showPagination" :meta="meta" :current-page="currentPage" @page-change="onPageChange" />
    </section>
  </div>
</template>

<script lang="ts">
/* tslint:disable:no-console */
import { Component, Vue, Watch } from "vue-property-decorator";
import { Route } from "vue-router";
import { ISortParameters, ITransaction } from "@/interfaces";
import SelectionType from "@/components/SelectionType.vue";
import TransactionService from "@/services/transaction";

Component.registerHooks(["beforeRouteEnter", "beforeRouteUpdate"]);

@Component({
  components: {
    SelectionType,
  },
})
export default class TransactionsPage extends Vue {
  private transactions: ITransaction[] | null = null;
  private meta: any | null = null;
  private currentPage = 0;
  private transactionType: { key: string; type: number; typeGroup?: number } = { key: "ALL", type: -1 };

  get showPagination() {
    return this.meta && this.meta.pageCount > 1;
  }

  get sortParams() {
    return this.$store.getters["ui/transactionSortParams"];
  }

  set sortParams(params: ISortParameters) {
    this.$store.dispatch("ui/setTransactionSortParams", {
      field: params.field,
      type: params.type,
    });
  }

  @Watch("currentPage")
  public onCurrentPageChanged() {
    this.changePage();
  }

  public created() {
    const savedType = localStorage.getItem("transactionType");
    this.transactionType = savedType ? JSON.parse(savedType) : { key: "ALL", type: -1 };
  }

  public async beforeRouteEnter(to: Route, from: Route, next: (vm: any) => void) {
    try {
      const savedType = localStorage.getItem("transactionType");
      const transactionType = savedType ? JSON.parse(savedType) : { key: "ALL", type: -1 };

      const { meta, data } = await TransactionService.filterByType(
        Number(to.params.page),
        transactionType.type,
        transactionType.typeGroup,
      );

      next((vm: TransactionsPage) => {
        vm.currentPage = Number(to.params.page);
        vm.setTransactions(data);
        vm.setMeta(meta);
      });
    } catch (e) {
      next({ name: "404" });
    }
  }

  public async beforeRouteUpdate(to: Route, from: Route, next: (vm?: any) => void) {
    this.transactions = null;
    this.meta = null;

    try {
      const savedType = localStorage.getItem("transactionType");
      const transactionType = savedType ? JSON.parse(savedType) : { key: "ALL", type: -1 };

      const { meta, data } = await TransactionService.filterByType(
        Number(to.params.page),
        transactionType.type,
        transactionType.typeGroup,
      );

      this.currentPage = Number(to.params.page);
      this.setTransactions(data);
      this.setMeta(meta);
      next();
    } catch (e) {
      next({ name: "404" });
    }
  }

  private async setTransactions(transactionsdata: ITransaction[]) {
    if (!transactionsdata) {
      return;
    }
    // this.transactions = transactions.map((transaction) => ({ ...transaction, price: null }));

    const transactions = await transactionsdata.map((transaction: ITransaction) => ({ ...transaction, price: null }));
    const getAllIds = await transactions.map((transaction: ITransaction) => transaction.id);
    const transactionCallOptionsClaim = await TransactionService.findCallOptionTransactionClaimAll(getAllIds);
    if (transactionCallOptionsClaim.data) {
      let transactionsw = [];
      const finaltransactions = await transactionCallOptionsClaim.data.map(async (transactionr: ITransaction) => {
        transactionsw = await transactions.map((transaction: ITransaction) => {
          if ((transaction.id = transactionr.id)) {
            transaction.isExistOnAPI = true;
          } else {
            transaction.isExistOnAPI = false;
          }
        });
      });
      this.transactions = transactionsw;
    } else {
      const transactionsw = await transactions.map((transaction: ITransaction) => ({
        ...transaction,
        isExistOnAPI: false,
      }));
      this.transactions = transactionsw;
    }
  }

  private setMeta(meta: any) {
    this.meta = meta;
  }

  private onPageChange(page: number) {
    if (this.currentPage !== page) {
      this.currentPage = page;
    }
  }

  private setType(type: { key: string; type: number; typeGroup?: number }) {
    if (this.transactionType !== type) {
      this.transactionType = type;
      this.currentPage = 1;

      this.transactions = null;
      this.meta = null;

      this.getTransactions();
    }
  }

  private async getTransactions() {
    try {
      const { meta, data } = await TransactionService.filterByType(
        this.currentPage,
        this.transactionType.type,
        this.transactionType.typeGroup,
      );

      this.setTransactions(data);
      this.setMeta(meta);
    } catch (e) {
      console.log(e.message || e.data.error);
    }
  }

  private changePage() {
    if (this.currentPage !== Number(this.$route.params.page)) {
      // @ts-ignore
      this.$router.push({
        name: "transactions",
        params: {
          page: this.currentPage.toString(),
        },
      });
    }
  }

  private onSortChange(params: ISortParameters) {
    this.sortParams = params;
  }
}
</script>
