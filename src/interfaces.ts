import { ForgingStatus } from "./enums";
import { BigNumber } from "@/utils";

export interface IBlock {
  id: string;
  version: number;
  height: number;
  previous: string;
  forged: {
    reward: BigNumber;
    fee: BigNumber;
    total: BigNumber;
    amount: BigNumber;
  };
  payload: {
    hash: string;
    length: number;
  };
  generator: {
    username: string;
    address: string;
    publicKey: string;
  };
  signature: string;
  confirmations: number;
  timestamp: ITimestamp;
  transactions: [ITransaction];
  price?: number | null;
}

export interface IDelegate {
  address: string;
  username: string;
  publicKey: string;
  blocks: {
    produced: number;
    last: IBlock;
  };
  votes: string;
  rank: number;
  production: {
    approval: number;
  };
  forged: {
    fees: BigNumber;
    rewards: BigNumber;
    total: BigNumber;
  };
  forgingStatus: ForgingStatus;
}

export interface IRoundDelegate {
  publicKey: string;
  votes: string;
}

export interface IMeta {
  count: number;
  pageCount: number;
  totalCount: number;
  next: string;
  previous: string;
  self: string;
  first: string;
  last: string;
}

export interface ILock {
  lockId: string;
  amount: BigNumber;
  secretHash: string;
  senderPublicKey: string;
  recipientId: string;
  timestamp: ITimestamp;
  expirationType: number;
  expirationValue: number;
  isExpired: boolean;
  vendorField?: string;
}

export interface ITransaction {
  id: string;
  blockId: string;
  version?: number;
  type: number;
  typeGroup: number;
  amount: BigNumber;
  fee: string;
  sender: string;
  senderPublicKey: string;
  recipient: string;
  signature: string;
  vendorField: string;
  confirmations: number;
  timestamp: ITimestamp;
  asset?: any;
  signatures?: string[];
  price?: number | null;
  nonce?: string;
  lockStatus?: number;
  tx_claim_id: number;
  call_option_id: string;
  statuscallOption: string;
  isExistOnAPI: boolean;
}

export interface ITransactionCallOption {
  id: string;
  amount: number;
  api_timestamp: ITimestamp;
  breakeven: string;
  buyer_address: string;
  call_option_id: string;
  coins_per_contract: number;
  expiration: ITimestamp;
  hash: string;
  memo: string;
  network_fee: string;
  oco_id: number;
  premium: number;
  recipient_address: string;
  seller_address: string;
  sender_address: string;
  status: string;
  strike: number;
  timestamp: ITimestamp;
  total_amount: number;
  tx_claim_id: number;
  tx_lock_id: string;
  type: number;
}

export interface ITransactionCallOptionClaim {
  type: number;
  tx_id: string;
  tx_claim_id: string;
  tx_lock_id: string;
  call_option_id: string;
  oco_id: number;
  coins_per_contract: number;
  premium: number;
  strike: number;
  breakeven: string;
  amount: number;
  network_fee: number;
  sender_address: string;
  recipient_address: string;
  buyer_address: string;
  seller_address: string;
  total_amount: number;
  memo: string;
  timestamp: ITimestamp;
  api_timestamp: ITimestamp;
  status: string;
  expiration: ITimestamp;
  hash: string;
}

export interface delegatesScan {
  wallet_address: string;
  beneficiaryRate: string;
  requiredMinimumBalance: string;
  maintainMinimumBalance: number;
  beneficiaryAddress: string;
  confidenceRate: number;
  multiPaymentLimit: number;
  lastUpdate: ITimestamp;
  rank: number;
}

export interface ISortParameters {
  field: string;
  type: string;
}

export interface ITimestamp {
  unix: number;
  epoch: number;
  human: string;
}

export interface IWallet {
  address: string;
  username: string;
  publicKey: string;
  vote: string;
  isDelegate: boolean;
  isResigned?: boolean;
  lockedBalance?: BigNumber;
}

export interface IApiResponse {
  error?: string;
  statusCode?: string;
  meta?: IMeta;
  data?: any[] | any;
  hasUnlisted?: string;
  unlisted_addresses?: any[] | any;
  unlisted_addresses2?: any[] | any;
}

export interface IApiResponseCallOptionAll {
  error?: string;
  statusCode?: string;
  meta?: IMeta;
  data?: any[] | any;
}

export interface IApiBlockWrapper {
  data: IBlock;
}

export interface IApiBlocksWrapper {
  data: IBlock[];
  meta: IMeta;
}

export interface IApiDelegateWrapper {
  data: IDelegate;
}

export interface IApiDelegatesWrapper {
  data: IDelegate[];
  meta: IMeta;
}

export interface IApiRoundDelegatesWrapper {
  data: IRoundDelegate[];
}

export interface IApiBlockchainWrapper {
  data: IBlockchain;
}

export interface IBlockchain {
  block: {
    height: number;
    id: string;
  };
  supply: string;
  cur: string;
}

export interface IApiWalletsWrapper {
  data: IWallet[];
  meta: IMeta;
}

export interface IApiLockWrapper {
  data: ILock;
}

export interface IApiLocksWrapper {
  data: ILock[];
  meta: IMeta;
}

export interface IApiTransactionCallOptionWrapper {
  data: ITransactionCallOption;
}
export interface IApiDelegatesScanWrapper {
  data: delegatesScan;
}

export interface IApiTransactionCallOptionClaimWrapper {
  data: ITransactionCallOptionClaim;
}

export interface IApiTransactionWrapper {
  data: ITransaction;
}

export interface IApiTransactionsWrapper {
  data: ITransaction[];
  meta: IMeta;
}

export interface IApiNodeConfiguration {
  [key: string]: any;
}

export interface IApiNodeConfigurationCrypto {
  [key: string]: any;
}

export interface IApiNodeStatus {
  synced: boolean;
  now: number;
  blockCount: number;
  timestamp: number;
}

export interface ICurrencyState {
  name: string;
  rate: number;
  symbol: string;
  lastConversion: {
    to: string;
    timestamp: number;
    rate: number;
  };
  currentRate: number;
}

export interface IDelegateState {
  delegates: string | null;
  forged: any[];
}

export interface INetworkState {
  defaults: {};
  server: string | null;
  nethash: string | null;
  alias: string | null;
  addressPrefix: number;
  activeDelegates: number;
  rewardOffset: number;
  token: string | null;
  isListed: boolean;
  symbol: string | null;
  currencies: any[];
  knownWallets: any[];
  supply: string;
  cur: string;
  initialSupply: string;
  height: number;
  epoch: string | null;
  blocktime: number;
  hasMagistrateEnabled: boolean;
  hasHtlcEnabled: boolean;
  enabledTransactionTypes: ITransactionType[];
}

export interface IUiState {
  language: string;
  locale: string;
  nightMode: boolean;
  priceChartOptions: {
    enabled: boolean;
    period: string;
    type: string;
  };
  headerType: string | null;
  menuVisible: boolean;
  blockSortParams: string | null;
  businessSortParams: string | null;
  bridgechainSortParams: string | null;
  delegateSortParams: string | null;
  transactionSortParams: string | null;
  walletSortParams: string | null;
  walletSearchSortParams: string | null;
  walletTransactionTab: string | null;
  hasAcceptedLinkDisclaimer: boolean;
}

export interface IStorePayload {
  type: string;
  value: any;
}

export interface IVTooltip {
  content: any;
  trigger?: string;
  show?: boolean;
  hideOnTargetClick?: boolean;
  delay?: any;
  classes?: string;
}

export interface ITransactionType {
  key: string;
  type: number;
  typeGroup?: number;
}

export interface IApiBusinessesWrapper {
  data: IBusiness[];
  meta: IMeta;
}

export interface IBusiness {
  address: string;
  publicKey: string;
  name: string;
  website: string;
  repository?: string;
}

export interface IApiBridgechainsWrapper {
  data: IBridgechain[];
  meta: IMeta;
}

export interface IBridgechain {
  publicKey: string;
  name: string;
  seedNodes: string[];
  genesisHash: string;
  bridgechainRepository?: string;
  ports: object;
}

export interface ITransactionSearchParams {
  id?: string;
  type?: string;
  timestamp?: { from?: number; to?: number };
  amount?: { from?: number; to?: number };
  fee?: { from?: number };
  vendorField?: string;
}

export interface IBlockSearchParams {
  id?: string;
  generatorPublicKey?: string;
  timestamp?: { from?: number; to?: number };
  totalAmount?: { from?: number; to?: number };
  totalFee?: { from?: number; to?: number };
  reward?: { from?: number; to?: number };
  numberOfTransactions?: { from?: number; to?: number };
}

export interface IWalletSearchParams {
  address?: string;
  username?: string;
  vote?: string;
  balance?: { from?: number; to?: number };
}
