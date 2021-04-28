import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import store from "@/store";
import { IApiResponse } from "../interfaces";

class ApiService {
  public async get(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<IApiResponse> {
    const server = store.getters["network/server"];

    const response = await axios.get(`${server}/${url}`, config);

    if (response.data.error) {
      return Promise.reject(
        new Error(`Error GET ${url} : ${JSON.stringify(response)}`)
      );
    }

    return response.data;
  }

  public async getUnlisted() {
    //jelmar changed
    const response = await axios.get(
      "https://raw.githubusercontent.com/InfinitySoftwareLTD/common/main/uncirculating/INFI"
    );
    return response.data;
  }

  public async post(
    url: string,
    data = {},
    config: AxiosRequestConfig = {}
  ): Promise<IApiResponse> {
    if (!config.headers) {
      config.headers = {
        "Content-Type": "application/json",
      };
    }

    const server = store.getters["network/server"];

    const response = await axios.post(`${server}/${url}`, data, config);

    if (response.data.error) {
      return Promise.reject(
        new Error(`Error POST ${url} : ${JSON.stringify(response)}`)
      );
    }

    return response.data;
  }

  public async getCallTransaction(
    url: string,
    config: AxiosRequestConfig = {}
  ): Promise<IApiResponse> {
    const response = await axios.get(
      `https://smartmarket.infinitysolutions.io/api/${url}`,
      config
    );

    if (response.data.error) {
      return Promise.reject(
        new Error(`Error GET ${url} : ${JSON.stringify(response)}`)
      );
    }

    return response.data;
  }
}

export default new ApiService();
