import ApiService from "@/services/api";
import { IApiWalletsWrapper, IWalletSearchParams } from "../interfaces";
import { paginationLimit } from "@/constants";
import store from "@/store";
class WalletService {
  public async find(address: string) {
    const response = await ApiService.get(`wallets/${address}`);
    return response.data;
  }

  // public async top(page = 1, limit: number = paginationLimit) {
  //   const response = await ApiService.get("wallets/top", {
  //     params: {
  //       page,
  //       limit,
  //     },
  //   });

  //   const unlisted_addresses = await ApiService.getUnlisted();
  //   var unlisted_add_array = [];
  //   for(const singleUnlisted of unlisted_addresses){
  //       const address = singleUnlisted.address;
  //       unlisted_add_array.push(address);
  //   }

  //   var unlistedCount = 0;
  //   response.unlisted_addresses = [];
  //   var listed_addresses = [];
  //   for(var i = 0; i < response.data.length; i++){
  //     const singlewalet = response.data[i];
  //     const walletAddress = singlewalet.address;

  //     if(unlisted_add_array.includes(walletAddress)){
  //       response.unlisted_addresses.push(response.data[i]);
  //       unlistedCount++;
  //     } else {
  //       listed_addresses.push(response.data[i]);
  //     }
  //   }

  //   if(unlistedCount > 0){
  //     response.hasUnlisted = '1';
  //   }

  //   response.data = listed_addresses;

  //   return response;
  // }
  public async top(page = 1, limit: number = paginationLimit) {
    //change jelmar
    const response2 = await ApiService.get("wallets/top");

    const response = await ApiService.get("wallets/top", {
      params: {
        page,
        limit,
      },
    });
    
    let serveralias: any = [];
    const server = await store.getters["network/alias"];
    const { testnet, devnet, mainnet } = await ApiService.getUnlisted();
    if (server === "Main") serveralias = mainnet;
    if (server === "Development") serveralias = devnet;
    if (server === "Testnet") serveralias = testnet;
    const unlisted_add_array = [];
    for (const singleUnlisted of serveralias) {
      const address = singleUnlisted;
      unlisted_add_array.push(address);
    }
    //response
    let unlistedCount = 0;
    response.unlisted_addresses = [];
    const listed_addresses = [];
    for (let i = 0; i < response.data.length; i++) {
      const singlewallet = response.data[i];
      const walletAddress = singlewallet.address;
      if (unlisted_add_array.includes(walletAddress)) {
        response.unlisted_addresses.push(response.data[i]);
        unlistedCount++;
      } else {
        listed_addresses.push(response.data[i]);
      }
    }
    for (const singleUnlisted of serveralias) {
      const address = singleUnlisted;
      const hasIn = response.unlisted_addresses.some(
        (item) => item.address === address
      );
       if (!hasIn) {
        const balance = "0";
        response.unlisted_addresses.push({ address, balance });
        unlistedCount++;
      }
    }

    // start response2
    response2.unlisted_addresses = [];
    for (let i = 0; i < response2.data.length; i++) {
      const singlewallet = response2.data[i];
      const walletAddress = singlewallet.address;
      if (unlisted_add_array.includes(walletAddress)) {
        response2.unlisted_addresses.push(response2.data[i]);
        unlistedCount++;
      }
    }
    for (const singleUnlisted of serveralias) {
      const address = singleUnlisted;
      const hasIn2 = response2.unlisted_addresses.some(
        (item) => item.address === address
      );
       if (!hasIn2) {
        const balance = "0";
        response2.unlisted_addresses.push({ address, balance });
        unlistedCount++;
      }
    }
    // end response2
    

    if (unlistedCount > 0) {
      response.hasUnlisted = "1";
    }
      response.data = listed_addresses;
      response.unlisted_addresses2 = await response2.unlisted_addresses
      
     return response;
    }

  public async search(
    body: IWalletSearchParams,
    page = 1,
    limit: number = paginationLimit
  ): Promise<IApiWalletsWrapper> {
    const response = (await ApiService.post("wallets/search", body, {
      params: {
        page,
        limit,
      },
    })) as IApiWalletsWrapper;

    return response;
  }
}

export default new WalletService();
