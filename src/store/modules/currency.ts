/* tslint:disable:no-shadowed-variable */
import * as types from "../mutation-types";
import { ICurrencyState, IStorePayload } from "../../interfaces";
import { ActionTree, GetterTree, Module, MutationTree } from "vuex";

const namespaced = true;
const state: ICurrencyState = {
  name: "EDGE",
  rate: 0.01,
  symbol: "H",
  lastConversion: {
    to: "USD",
    timestamp: 1,
    rate: 1,
  },
  currentRate: 0.01,
};

const actions: ActionTree<ICurrencyState, {}> = {
  setName: ({ commit }, value: string) => {
    localStorage.setItem("currencyName", value);

    commit({
      type: types.SET_CURRENCY_NAME,
      value,
    });
  },
  setRate: ({ commit }, value: number) => {
    localStorage.setItem("currencyRate", value.toString());

    commit({
      type: types.SET_CURRENCY_RATE,
      value,
    });
  },
  setSymbol: ({ commit }, value: string) => {
    localStorage.setItem("currencySymbol", value);

    commit({
      type: types.SET_CURRENCY_SYMBOL,
      value,
    });
  },
  setLastConversion: (
    { commit },
    value: { to: string; timestamp: number; rate: number }
  ) => {
    let rates = JSON.parse(localStorage.getItem(`rates_${value.to}`) as string);

    rates = rates || {};
    rates[value.timestamp] = value.rate;

    localStorage.setItem(`rates_${value.to}`, JSON.stringify(rates));

    commit({
      type: types.SET_CURRENCY_LAST_CONVERSION,
      value,
    });
  },
  setCurrentRate: ({ commit }, value: number) => {
    commit({
      type: types.SET_CURRENCYRATE,
      value,
    });
  },
};

const mutations: MutationTree<ICurrencyState> = {
  [types.SET_CURRENCY_NAME](state, payload: IStorePayload) {
    state.name = payload.value;
  },
  [types.SET_CURRENCY_RATE](state, payload: IStorePayload) {
    state.rate = payload.value;
  },
  [types.SET_CURRENCY_SYMBOL](state, payload: IStorePayload) {
    state.symbol = payload.value;
  },
  [types.SET_CURRENCY_LAST_CONVERSION](state, payload: IStorePayload) {
    state.lastConversion = payload.value;
  },
  [types.SET_CURRENCYRATE](state, payload: IStorePayload) {
    state.currentRate = payload.value;
  },
};

const getters: GetterTree<ICurrencyState, {}> = {
  name: (state) => state.name,
  rate: (state) => state.rate,
  symbol: (state) => state.symbol,
  lastConversion: (state) => state.lastConversion,
  currentRate: (state) => state.currentRate,
};

export const currency: Module<ICurrencyState, {}> = {
  namespaced,
  state,
  actions,
  mutations,
  getters,
};
