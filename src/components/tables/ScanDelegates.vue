<template>
  <Loader :data="delegates">
    <TableWrapper
      v-bind="$attrs"
      :columns="columns"
      :rows="delegates"
      :no-data-message="$t('COMMON.NO_RESULTS')"
      @on-sort-change="emitSortChange"
    >
      <template slot-scope="data">
        <div v-if="data.column.field === 'delegatess'" class="flex items-center">
          <LinkWallet :address="data.row.wallet_address">
            {{ data.row.wallet_address }}
          </LinkWallet>
        </div>
        <div v-if="data.column.field === 'beneficiary'">
          <LinkWallet :address="data.row.beneficiaryAddress">
            {{ data.row.beneficiaryAddress }}
          </LinkWallet>
        </div>

        <div v-else-if="data.column.field === 'redistributionIncome'">
          {{ readableNumber(beneficiaryRate(data.row.beneficiaryRate)) }}
        </div>

        <div v-else-if="data.column.field === 'confidence'">
          {{ readableNumber(data.row.confidenceRate) }}
        </div>

        <div v-else-if="data.column.field === 'minimumVoters'">
           {{ readableCrypto(minimumVoters(data.row.requiredMinimumBalance),true, 2) }}
        </div>

        <span v-else>
          {{ data.formattedRow[data.column.field] }}
        </span>
      </template>
    </TableWrapper>
  </Loader>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { delegatesScan, ISortParameters } from "@/interfaces";
import { BigNumber } from "@/utils";

@Component
export default class TableScanDelegates extends Vue {
  @Prop({
    required: true,
    validator: (value) => {
      return Array.isArray(value) || value === null;
    },
  })
  public delegates: delegatesScan | null;
  // @Prop({ required: false, default: "active" }) public activeTab: string;
  // @Prop({ required: true }) public curincir: string;

  get columns() {
    let columns = [
      {
        label: this.$t("COMMON.RANK"),
        field: "rank",
        type: "number",
        thClass: "start-cell w-32",
        tdClass: "start-cell w-32",
      },
      {
        label: "Delegates",
        field: "delegatess",
        thClass: "text-left end-cell sm:base-cell",
        tdClass: "text-left end-cell sm:base-cell",
      },
      {
        label: "Beneficiary",
        field: "beneficiary",
        type: "number",
        thClass: "text-left hidden xl:table-cell",
        tdClass: "text-left hidden xl:table-cell",
      },
      {
        label: "Redistribution Income %",
        field: "redistributionIncome",
        type: "number",
        thClass: "text-left hidden sm:table-cell text-center",
        tdClass: "text-left hidden sm:table-cell text-center",
      },
      {
        label: "Confidence",
        field: "confidence",
        type: "number",
        thClass: "end-cell md:base-cell text-center",
        tdClass: "end-cell md:base-cell text-center",
      },
      {
        label: "Minimum Voters balance",
        field: "minimumVoters",
        type: "number",
        thClass: "end-cell md:base-cell text-center",
        tdClass: "end-cell md:base-cell text-center",
      }
    ];

    
    return columns;
  }

  private emitSortChange(params: ISortParameters[]) {
    this.$emit("on-sort-change", params[0]);
  }

  private beneficiaryRate(rates){
    return BigNumber.make(100).minus(rates).toNumber();
  }

  private minimumVoters(votes){
    return votes;
  }
}
</script>
