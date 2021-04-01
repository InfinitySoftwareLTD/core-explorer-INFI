<template>
  <Loader :data="wallets">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :rows="wallets"
      :no-data-message="$t('COMMON.NO_RESULTS')"
    >
      <template slot-scope="data">
        <div v-if="data.column.field === 'originalIndex'">
          {{ getRank(data.row.originalIndex) }}
        </div>

        <div v-else-if="data.column.field === 'address'">
          <LinkWallet :address="data.row.address" :trunc="false" />
        </div>

        <div v-else-if="data.column.field === 'balance'">
          <span>
            <!-- jelmar change -->
             {{data.row.balance == 0 ? 0 : readableCrypto(data.row.balance, true, truncateBalance ? 2 : 8) }}
          </span>
        </div>
      </template>
    </TableWrapper>
  </Loader>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { ISortParameters, IWallet } from "@/interfaces";
import { mapGetters } from "vuex";
import { BigNumber } from "@/utils";
import { paginationLimit } from "@/constants";

@Component({
  computed: {
    console: () => console,
    ...mapGetters("network", ["supply"]),
  },
})
export default class TableWalletsUnlisted extends Vue {
  get truncateBalance() {
    return this.windowWidth < 700;
  }

  get columns() {
    const columns = [
      {
        label: this.$t("COMMON.RANK"),
        field: "originalIndex",
        type: "number",
        thClass: "start-cell w-32",
        tdClass: "start-cell w-32",
      },
      {
        label: this.$t("WALLET.ADDRESS"),
        field: "address",
      },
      {
        label: this.$t("COMMON.BALANCE"),
        field: "balance",
        type: "number",
        thClass: "end-cell w-24 not-sortable",
        tdClass: "end-cell w-24 whitespace-no-wrap",
      },
     
    ];

    return columns;
  }
  @Prop({
    required: true,
    validator: (value) => {
      return Array.isArray(value) || value === null;
    },
  })
  public wallets: IWallet[] | null;
  @Prop({ required: true }) public total: string;
  @Prop({ required: true }) public unlisted: string;

  private windowWidth = 0;
  private supply: string;

  public mounted() {
    this.windowWidth = window.innerWidth;

    this.$nextTick(() => {
      window.addEventListener("resize", () => {
        this.windowWidth = window.innerWidth;
      });
    });
  }


  public getUnlisted(){
    return parseInt(this.unlisted);
  }

  private getRank(index: number) {
    const page = Number(this.$route.params.page) > 1 ? Number(this.$route.params.page) - 1 : 0;

    return page * paginationLimit + (index + 1);
  }
}
</script>
