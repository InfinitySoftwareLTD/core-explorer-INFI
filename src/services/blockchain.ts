import ApiService from "@/services/api";
import { IApiBlockchainWrapper } from "../interfaces";
import store from "@/store";
class BlockchainService {
  public async height(): Promise<number> {
    const response = (await ApiService.get(
      "blockchain"
    )) as IApiBlockchainWrapper;
    return response.data.block.height;
  }

  public async supply(): Promise<string> {
    const response = (await ApiService.get(
      "blockchain"
    )) as IApiBlockchainWrapper;
    return response.data.supply;
  }

  public async cur() {
    try {
      let serveralias: any = [];
      const server = await store.getters["network/alias"];
      const { testnet, devnet, mainnet } = await ApiService.getUnlisted();
      if (server === "Main") serveralias = mainnet;
      if (server === "Development") serveralias = devnet;
      if (server === "Testnet") serveralias = testnet;
      let finalBalance = 0;
      for (const sdata of serveralias) {
        try {
              const wallet = await ApiService.get("wallets/" + sdata);
              const { edge, infi } = await ApiService.getburnAddresses();
              if ((await wallet.data.address) != infi) {
                const sbalance = wallet === undefined ? "0" : Math.floor(Number(await wallet.data.balance));
                const lockedbalance =
                wallet.data.lockedBalance === undefined ? "0" : Math.floor(Number(await wallet.data.lockedBalance));
                finalBalance += Math.floor(Number(sbalance)) + Math.floor(Number(lockedbalance)); // jelmar change
              }
            } catch (error) {}
      }
      return finalBalance;  
    } catch (error) {}
  }
  // public async cur(){
  //   const data = (await ApiService.getUnlisted());
  //   var finalBalance = 0;
  //   for(const sdata of data){
  //     const wallet = await ApiService.get("wallets/"+ sdata.address);
  //     const sbalance = wallet.data.balance;
  //     finalBalance += sbalance;
  //   }
  //   return finalBalance;
  // }
}

export default new BlockchainService();
