<template>
  <div>
    <section class="page-section py-5 md:py-10 mb-5">
      <div class="px-5 sm:px-10">
        <div class="list-row-border-b">
          <div class="mr-4">{{ "Seller" }}</div>
          <div class="truncate">
            <LinkWalletCallOptionClaim :address="transaction.sender" :trunc="false" tooltip-placement="left" />
          </div>
        </div>

        <div class="list-row-border-b">
          <div class="mr-4">{{ "Buyer" }}</div>
          <div class="truncate">
            <LinkWalletCallOptionClaim :address="transaction.recipient" :trunc="false" tooltip-placement="left" />
          </div>
        </div>

          <div class="list-row-border-b">
          <div class="mr-4">{{ "Id Call Option" }}</div>
          <div class="truncate">
            <LinkTransaction :id="transaction.call_option_id ">{{ transaction.call_option_id  }}</LinkTransaction>
          </div>
        </div>

        <div class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.TYPE") }}</div>
          <div class="truncate">
            <LinkWalletCallOptionClaim
              :address="transaction.recipient"
              :type="transaction.type"
              :asset="transaction.asset"
              :trunc="false"
              :type-group="transaction.typeGroup"
              :show-as-type="true"
              tooltip-placement="left"
            />
          </div>
        </div>

        <div class="list-row-border-b">
          <div class="mr-4">{{ $t("COMMON.CONFIRMATIONS") }}</div>
          <div>{{ readableNumber(confirmations) }}</div>
        </div>

        <div class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.AMOUNT") }}</div>
          <div
            v-if="isMultiPayment(transaction.type, transaction.typeGroup)"
            v-tooltip="{
              trigger: 'hover click',
              content: price ? readableCurrency(multipaymentAmount, price) : '',
              placement: 'left',
            }"
          >
            {{ readableCrypto(multipaymentAmount) }}
          </div>
          <div
            v-else
            v-tooltip="{
              trigger: 'hover click',
              content: price ? readableCurrency(transaction.amount, price) : '',
              placement: 'left',
            }"
          >
            {{ readableCrypto(transaction.amount) }}
          </div>
        </div>

        <div class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.FEE") }}</div>
          <div
            v-tooltip="{
              trigger: 'hover click',
              content: price ? readableCurrency(transaction.fee, price) : '',
              placement: 'left',
            }"
          >
            {{ readableCrypto(transaction.fee) }}
          </div>
        </div>

        <div class="list-row-border-b-no-wrap">
          <div class="mr-4">{{ $t("COMMON.TIMESTAMP") }}</div>
          <div v-if="transaction.timestamp">{{ readableTimestamp(transaction.timestamp.unix) }}</div>
        </div>

        <div v-if="transaction.vendorField" class="list-row-border-b-no-wrap">
          <div class="mr-4">{{ $t("TRANSACTION.SMARTBRIDGE") }}</div>
          <div class="overflow-hidden break-words">{{ transaction.vendorField }}</div>
        </div>

        <div v-if="transaction.nonce" class="list-row-border-b-no-wrap">
          <div class="mr-4">{{ $t("TRANSACTION.NONCE") }}</div>
          <div>{{ transaction.nonce }}</div>
        </div>

        <div v-if="isIpfs(transaction.type, transaction.typeGroup)" class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.IPFS") }}</div>
          <div class="overflow-hidden break-all">{{ transaction.asset.ipfs }}</div>
        </div>

        <div v-if="isTimelock(transaction.type, transaction.typeGroup)">
          <div class="list-row-border-b-no-wrap">
            <div class="mr-4 whitespace-no-wrap">{{ $t("TRANSACTION.TIMELOCK.SECRET_HASH") }}</div>
            <div class="overflow-hidden break-all">{{ transaction.asset.lock.secretHash }}</div>
          </div>

          <div v-if="transaction.asset.lock.expiration.type === 1" class="list-row-border-b">
            <div class="mr-4">{{ $t("TRANSACTION.TIMELOCK.EXPIRATION") }}</div>
            <div>{{ readableTimestamp2(transaction.asset.lock.expiration.value + 1608209012) }}</div>
          </div>
          <div v-else-if="transaction.asset.lock.expiration.type === 2" class="list-row-border-b">
            <div class="mr-4">{{ $t("TRANSACTION.TIMELOCK.BLOCKHEIGHT") }}</div>
            <div
              v-tooltip="{
                trigger: 'hover click',
                content: readableTimestampFromBlockheight(transaction.asset.lock.expiration.value),
                placement: 'left',
              }"
            >
              {{ transaction.asset.lock.expiration.value }}
            </div>
          </div>
        </div>
        <div v-if="transaction.statuscallOption" class="list-row-border-b">
          <div class="mr-4">{{ "Status" }}</div>
          <div class="truncate">
            {{ transaction.statuscallOption == null ? '' : transaction.statuscallOption }}
          </div>
        </div>
          <div class="list-row-border-b">
          <div class="mr-4">{{ "Tx Id Executed" }}</div>
           <div v-if="transaction.tx_claim_id">
              <LinkTransaction :id="transaction.tx_claim_id ">{{ transaction.tx_claim_id  }}</LinkTransaction>
            </div>
            <div v-else>{{ '' }}</div>
          <!-- <div class="truncate">
            {{ transaction.tx_claim_id == null ? '' : transaction.tx_claim_id }}
          </div> -->
        </div>

        <div v-if="isTimelockClaim(transaction.type, transaction.typeGroup)">
          <div class="list-row-border-b-no-wrap">
            <div class="mr-4 whitespace-no-wrap">{{ $t("TRANSACTION.TIMELOCK.UNLOCK_SECRET_HEX") }}</div>
            <div class="overflow-hidden break-all">{{ stringToHex(transaction.asset.claim.unlockSecret) }}</div>
          </div>

          <div class="list-row-border-b">
            <div class="mr-4">{{ 'Execute transaction' }}</div>
            <div class="overflow-hidden break-all">
              <LinkTransaction :id="transaction.asset.claim.lockTransactionId" />
            </div>
          </div>
        </div>

        <div v-if="isTimelockRefund(transaction.type, transaction.typeGroup)" class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.TIMELOCK.REFUNDED") }}</div>
          <div class="overflow-hidden break-all">
            <LinkTransaction :id="transaction.asset.refund.lockTransactionId" />
          </div>
        </div>

        <div class="list-row">
          <div class="mr-4">{{ $t("TRANSACTION.BLOCK_ID") }}</div>
          <div>
            <LinkBlock v-if="transaction.blockId" :id="transaction.blockId">{{ transaction.blockId }}</LinkBlock>
          </div>
        </div>
      </div>
    </section>

    <section
      v-if="isMultiSignature(transaction.type, transaction.typeGroup)"
      class="TransactionDetails__MultiSignature page-section py-5 md:py-10 mb-5"
    >
      <div class="px-5 sm:px-10">
        <div v-if="!isLegacyMultiSignature" class="list-row-border-b">
          <div class="mr-4">{{ $t("TRANSACTION.MULTI_SIGNATURE.ADDRESS") }}</div>
          <div class="truncate">
            <LinkWalletCallOptionClaim
              :address="addressFromMultiSignatureAsset(multiSignatureAsset)"
              :trunc="false"
              tooltip-placement="left"
            />
          </div>
        </div>
        <div class="list-row-border-b-no-wrap">
          <div class="mr-4">{{ $t("TRANSACTION.MULTI_SIGNATURE.PARTICIPANTS") }}</div>
          <ul>
            <li v-for="publicKey in publicKeysFromMultiSignatureAsset" :key="publicKey" class="mb-1 text-right">
              <LinkWalletCallOptionClaim
                :address="addressFromPublicKey(publicKey)"
                :trunc="false"
                tooltip-placement="left"
                class="justify-end"
              />
            </li>
          </ul>
        </div>
        <div :class="isLegacyMultiSignature ? 'list-row-border-b' : 'list-row'">
          <div class="mr-4">{{ $t("TRANSACTION.MULTI_SIGNATURE.MIN") }}</div>
          <div>{{ multiSignatureAsset.min }} / {{ publicKeysFromMultiSignatureAsset.length }}</div>
        </div>
        <template v-if="isLegacyMultiSignature">
          <div class="list-row">
            <div class="mr-4">{{ $t("TRANSACTION.MULTI_SIGNATURE.LIFETIME") }}</div>
            <div>
              {{ multiSignatureAsset.lifetime }}
            </div>
          </div>
          <div v-if="isLegacyMultiSignature" class="list-row text-sm text-theme-text-secondary">
            <span>* {{ $t("TRANSACTION.MULTI_SIGNATURE.LEGACY_NOTICE") }}</span>
          </div>
        </template>
      </div>
    </section>

    <section
      v-if="
        transaction.typeGroup === typeGroupTransaction.MAGISTRATE &&
        transaction.type !== magistrateTransaction.BUSINESS_RESIGNATION
      "
      class="page-section py-5 md:py-10 mb-5"
    >
      <div class="px-5 sm:px-10">
        <div
          v-for="(value, prop, index) in assetField"
          :key="prop"
          :class="index === Object.keys(assetField).length - 1 ? 'list-row' : 'list-row-border-b'"
        >
          <div class="mr-4">{{ $t(`TRANSACTION.ASSET.${prop.toUpperCase()}`) }}</div>
          <div class="overflow-hidden break-all">{{ value }}</div>
        </div>
      </div>
    </section>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { BigNumber } from "@/utils/BigNumber";
import { TranslateResult } from "vue-i18n";
import { mapGetters } from "vuex";
import { ITransaction } from "@/interfaces";
import { CoreTransaction, MagistrateTransaction, TypeGroupTransaction } from "@/enums";
import { CryptoCompareService, LockService, TransactionService } from "@/services";

@Component({
  computed: {
    ...mapGetters("currency", { currencySymbol: "symbol" }),
    ...mapGetters("network", ["height"]),
  },
})
export default class TransactionDetails extends Vue {
  @Prop({ required: true }) public transaction: ITransaction;

  private initialBlockHeight = 0;
  private price: number | null = 0;
  private currencySymbol: string;
  private height: number;
  private multipaymentAmount: BigNumber | null = null;
  private timelockStatus: TranslateResult | null = null;
  private timelockLink: string | null = null;

  get confirmations() {
    return this.initialBlockHeight ? this.height - this.initialBlockHeight : this.transaction.confirmations;
  }

  get coreTransaction() {
    return CoreTransaction;
  }

  get magistrateTransaction() {
    return MagistrateTransaction;
  }

  get typeGroupTransaction() {
    return TypeGroupTransaction;
  }

  get isLegacyMultiSignature() {
    return !!this.transaction.asset.multiSignatureLegacy;
  }

  get multiSignatureAsset() {
    return this.transaction.asset.multiSignature || this.transaction.asset.multiSignatureLegacy;
  }

  get publicKeysFromMultiSignatureAsset() {
    return this.isLegacyMultiSignature
      ? this.multiSignatureAsset.keysgroup.map((publicKey) => publicKey.slice(1))
      : this.multiSignatureAsset.publicKeys;
  }

  get assetField() {
    switch (this.transaction.type) {
      case MagistrateTransaction.BUSINESS_REGISTRATION:
        return this.transaction.asset.businessRegistration;
      case MagistrateTransaction.BUSINESS_UPDATE:
        return this.transaction.asset.businessUpdate;
      case MagistrateTransaction.BRIDGECHAIN_REGISTRATION:
        return this.transaction.asset.bridgechainRegistration;
      case MagistrateTransaction.BRIDGECHAIN_RESIGNATION:
        return this.transaction.asset.bridgechainResignation;
      case MagistrateTransaction.BRIDGECHAIN_UPDATE:
        return this.transaction.asset.bridgechainUpdate;
      default:
        return [];
    }
  }

  @Watch("transaction")
  public async onTransactionChanged() {
    this.updatePrice();
    this.handleMultipayment();
    this.getTimelockStatus();
    this.setInitialBlockHeight();
  }

  @Watch("currencySymbol")
  public async onCurrencySymbolChanged() {
    await this.updatePrice();
  }

  @Watch("height")
  public onHeightChanged(newValue: number, oldValue: number) {
    if (!oldValue) {
      this.setInitialBlockHeight();
    }
  }

  public async mounted() {
    this.updatePrice();
    this.handleMultipayment();
    this.getTimelockStatus();
  }

  private async updatePrice() {
    this.price = await CryptoCompareService.dailyAverage(this.transaction.timestamp.unix);
  }

  private setInitialBlockHeight() {
    this.initialBlockHeight = this.height - this.transaction.confirmations;
  }

  private handleMultipayment() {
    // @ts-ignore
    if (this.isMultiPayment(this.transaction.type, this.transaction.typeGroup)) {
      // @ts-ignore
      this.multipaymentAmount = this.calculateMultipaymentAmount(this.transaction);
    }
  }

  private async getTimelockStatus() {
    // @ts-ignore
    if (this.isTimelock(this.transaction.type, this.transaction.typeGroup)) {
      const response = await TransactionService.findUnlockedForLocks([this.transaction.id]);
      if (response.data.length === 0) {
        const lock = await LockService.find(this.transaction.id);
        this.timelockStatus = lock.isExpired
          ? this.$t("TRANSACTION.TIMELOCK.EXPIRED")
          : this.$t("TRANSACTION.TIMELOCK.OPEN");
      } else if (response.data[0].type === CoreTransaction.TIMELOCK_CLAIM) {
        this.timelockStatus = this.$t("TRANSACTION.TIMELOCK.CLAIMED");
        this.timelockLink = response.data[0].id;
      } else if (response.data[0].type === CoreTransaction.TIMELOCK_REFUND) {
        this.timelockStatus = this.$t("TRANSACTION.TIMELOCK.REFUNDED");
        this.timelockLink = response.data[0].id;
      }
    } else {
      this.timelockStatus = this.$t("TRANSACTION.TIMELOCK.UNKNOWN");
    }
  }
}
</script>

<style scoped>
.list-row-border-b-no-wrap > div:last-child {
  text-align: right;
}
</style>