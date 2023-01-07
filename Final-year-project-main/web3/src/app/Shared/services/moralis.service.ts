import { Injectable, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { resolve } from 'dns';
import { Moralis } from 'moralis';
import { environment } from 'src/environments/environment';
import * as layouts from '../data-layout';
import { CommonService } from './common.service';
import { Web3Service } from './web3.service';
@Injectable({
  providedIn: 'root'
})
export class MoralisService {
  private user?: Moralis.User | null;
  private currentChain: number = -1;
  //All these Event Emitters are specific for user cache consistency
  SessionObjectChange: EventEmitter<Moralis.Object> = new EventEmitter<Moralis.Object>();
  ContactArrChange: EventEmitter<Array<layouts.Contacts>> = new EventEmitter<Array<layouts.Contacts>>();
  InvitesChange: EventEmitter<layouts.InvitesData> = new EventEmitter<layouts.InvitesData>();
  WalletSwitched: EventEmitter<string> = new EventEmitter<string>();
  StatusArrChange: EventEmitter<Array<layouts.StatusData>> = new EventEmitter<Array<layouts.StatusData>>();
  ChainChange: EventEmitter<number> = new EventEmitter<number>();
  HistChange: EventEmitter<Array<layouts.HistoryView>> = new EventEmitter<Array<layouts.HistoryView>>();
  plotDataChange: EventEmitter<{ numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }> = new EventEmitter<{ numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }>();
  //for class adjustments specific to child for parent use this even emitter
  classAdjust: EventEmitter<boolean> = new EventEmitter<boolean>();
  //private user non cached variables
  private contactArr: Array<layouts.Contacts> = [];
  private Invites: layouts.InvitesData = { reqs: [], pends: [] };
  private statusArr: Array<layouts.StatusData> = [];
  private historyArr: Array<layouts.HistoryView> = [];
  private plotData: { numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> } = { numcard: [], catg: [] };
  constructor(private _router: Router, private _route: ActivatedRoute, private _common: CommonService, private _web3: Web3Service) {
    //#region eventListeners for caching
    this.SessionObjectChange.subscribe(
      (obj: Moralis.User) => {
        this.user = obj;
      }
    );
    this.ContactArrChange.subscribe(
      (chddata: Array<layouts.Contacts>) => {
        this.contactArr = chddata;
      }
    );
    this.InvitesChange.subscribe(
      (chddata: layouts.InvitesData) => {
        this.Invites = chddata;
      }
    );
    this.StatusArrChange.subscribe(
      (result: Array<layouts.StatusData>) => {
        this.statusArr = result;
      }
    );
    this.ChainChange.subscribe(
      (chain: number) => {
        this.currentChain = chain;
      }
    );
    this.plotDataChange.subscribe(
      (result: { numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }) => {
        this.plotData = result;
      }
    );
    this.HistChange.subscribe((result: Array<layouts.HistoryView>) => { this.historyArr = result; });

    //#endregion

    //#region Moralis Initialization and others 
    Moralis.isInitialized = false;
    Moralis.start({ appId: environment.appId, serverUrl: environment.serverUrl }).then(this.CachedcallBack);
    Moralis.onAccountChanged(
      async (account) => {
        await this.onAccountChanged(account);
      }
    );
    //#endregion
  }

  //#region User
  //UserData Caching Related hooks
  public get getCachedUser(): Moralis.User | undefined | null {
    return this.user;
  };
  private cachedUser = async () => {
    this.user = await Moralis.User.currentAsync();
  };
  private CachedcallBack = () => {
    this.cachedUser()
      .then(
        () => {
          this.chain = Moralis.chainId;
          Moralis.isInitialized = true;
          if (this.user !== null && this.user) {
            this.SessionObjectChange.emit(this.user);
          }
        }
      )
      .catch(
        (err) => {
          console.log(err?.message);
        }
      );
  };
  //#endregion

  //#region Contacts
  //Contacts Caching Related hooks
  private getFriends = () => {
    const params = {
      name: this.user?.getUsername()
    };
    return Moralis.Cloud.run("getFriends", params);
  };
  public get getCachedContacts() {
    return this.contactArr;
  };
  fetchContacts = () => {
    return new Promise<Array<layouts.Contacts>>(
      (resolve) => {
        this.getFriends().then(
          (response: Array<layouts.Contacts>) => {
            resolve(response);
          }
        )
      }
    );

  };
  //this differs from getFriends this is used to check if they're friends
  fetchFriends = (params: layouts.Search_User) => {
    return Moralis.Cloud.run("fetchFriends", params);
  };
  blockFriend=(params:{flg:boolean,id:string})=>{
    return new Promise<any>((resolve)=>{
      Moralis.Cloud.run('blockFriend',params).then((response)=>{resolve(response);});
    });
  };
  //#endregion

  //#region Invites
  //Invites/Pending Caching Related hooks
  private getInvites = () => {
    const params: layouts.Search_User = { name: this.user?.getUsername() };
    return Moralis.Cloud.run("getInvites", params);
  };
  public get getCachedInvites() {
    return this.Invites;
  };
  fetchInvites = () => {
    return new Promise<layouts.InvitesData>((resolve, reject) => {
      this.getInvites().then(
        (response: layouts.InvitesData) => {
          console.log(response);
          resolve(response);
        }
      );
    });
  };
  //#endregion

  //#region  Status
  //Status of Transactions Related Hooks
  private getStatus = (params: { chain: number, addr: string }) => {
    return Moralis.Cloud.run('getStatus', params);
  };
  public get getCachedStatus() {
    return this.statusArr;
  };
  fetchStatus = (payload: { chain: number, addr: string }) => {
    return new Promise<Array<layouts.StatusData>>((resolve) => {
      this.getStatus(payload).then(
        (response: Array<layouts.StatusData>) => {
          resolve(response);
        }
      );
    });
  };
  //#endregion

  //#region History
  //History Fetching Related Hooks
  public get CachedHistory(): Array<layouts.HistoryView> {
    return this.historyArr;
  }
  private getHistory = (params: { chain: number, addr: string, start: Array<number>, end: Array<number> }) => {
    return Moralis.Cloud.run('getHistory', params);
  };
  fetchHistory = (payload: { chain: number, addr: string, start:Array<number>, end:Array<number> }) => {
    return new Promise<Array<layouts.HistoryView>>((resolve) => {
      this.getHistory(payload).then(
        (response: Array<layouts.HistoryView>) => {
          console.log(response);
          resolve(response);
        }
      );
    });
  };
  //#endregion

  //#region PlottingData

  public get getCachedPlot(): { numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> } {
    return this.plotData;
  }

  fetchPlotData = (id: string) => {
    return new Promise<{ numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }>((resolve) => {
      this.getPlotData({ id }).then(
        (response: { numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }) => {
          resolve(response);
        }
      );
    });
  };
  private getPlotData = (params: { id: string }) => {
    return Moralis.Cloud.run("countPlot", params);
  }
  //#endregion

  //#region PlotBarChart
  private getBarPlot = (params:{ acct:string,start:string,end:string,chain:number }) => {
    return Moralis.Cloud.run('WeeklyCount',params);
  }
  fetchBarPlot=(payload:{ acct:string,start:string,end:string,chain:number })=>{
    return new Promise<{ numcard: Array<layouts.GeneralCount>, catg: Array<layouts.GeneralGraphPlot> }>((resolve) => {
      this.getBarPlot(payload).then(
        (response:any) => {
          resolve(response);
        }
      );
    });
  };
  
  // public get CachedBarPlot() : any {
  //   return 
  // }
  
  //#endregion 

  //#region WalletConnect/Remove,SignIn/SignOut

  //Wallet Connect/Remove hooks
  //Note this connect will only help for Sign Up
  connect = async () => {
    if (!this.user) {
      this.user = await Moralis.authenticate();
      await this.setType("wallet");
      this.SessionObjectChange.emit(this.user);
      return true;
    }
    else {
      return false;
    }
  };
  //Note this connectExisting is only for the scenario
  //where user already has a account and currently
  //logged in using email/pass but wallet disconnected
  //either by logout or after signup by user's intention
  connectExternally = async () => {
    this.user = await Moralis.authenticate();
    this.SessionObjectChange.emit(this.user);
  };
  //note this function Works for Both email/pass logout and for removing wallet
  ///and here the walletConnected variable set to false as well
  removeWallet = () => {
    return Moralis.User.logOut();
  };
  //Signup,SignIn,SignOut with Email/pass ApI
  SignUp = async (pyld_data: layouts._SignUp) => {
    this.user?.set("username", pyld_data.username);
    this.user?.set("email", pyld_data.email);
    this.user?.set("phone", pyld_data.mobile);
    this.user?.set("password", pyld_data.passwd);
    this.user = await this.user?.signUp();
    await this.setType("wallet");
  };
  SignIn = async (pyld_data: layouts._LogIn) => {
    this.user = await Moralis.User.logIn(pyld_data.username, pyld_data.passwd);
    this.SessionObjectChange.emit(this.user);
    await this.setType("email/pass");
  };
  //PasswordReset
  resetPassword = (pyld_data: string) => {
    return Moralis.User.requestPasswordReset(pyld_data);
  };
  //#endregion

  //Gives Proper consistent current chain related Details from meta mask
  public get chainid(): number {
    return this.currentChain;
  }
  public set chain(v: string | null) {
    if (v && v !== null) {
      this.currentChain = parseInt(v, 16);
    }
    else {
      this.currentChain = this._web3.currChain;
    }
  }


  //Cloud Functions Goes Here
  checkExists = async (): Promise<boolean> => {
    const params = {
      eth: this.user?.get("ethAddress")
    };
    const bool: boolean = await Moralis.Cloud.run("exists", params);
    return bool;
  };
  setType = async (type: string) => {
    const params = {
      token: this.user?.getSessionToken(),
      type: type
    };
    return Moralis.Cloud.run("setSessionType", params);
  };
  getType = async (token: string) => {
    const params = {
      token
    };
    return Moralis.Cloud.run("getSessionType", params);
  };
  checkSession = (): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
      const _user: Moralis.User | null = await Moralis.User.currentAsync();
      if (_user && _user !== null) {
        resolve(true);
      }
      else {
        this._router.navigate(["/signin"])
          .then(
            () => {
              resolve(false);
            }
          );
      }
    });
  };
  delAcct = (acct: string) => {
    const params = {
      acct
    };
    return Moralis.Cloud.run("delAcct", params);
  };
  editAcct = (params: layouts.editAcctType) => {
    return Moralis.Cloud.run('editAcct', params);
  };
  postRequest = (params: layouts.PostFriend) => {
    if (this.user) { params.tgtName = this.user?.getUsername(); params.fromAddr = this.user.get("ethAddress") }
    return Moralis.Cloud.run("PostRequest", params);
  };
  acceptInvite = (params: layouts.AcceptInvite) => {
    return Moralis.Cloud.run("acceptInvite", params);
  };
  removeInvite = (id: string) => {
    const params = { id };
    return Moralis.Cloud.run("removeInvite", params);
  };
  cancelRequest = (id: string) => {
    const params = { id };
    return Moralis.Cloud.run("cancelRequest", params);
  };
  updateName = (params: { nick: string, id: string }) => {
    return Moralis.Cloud.run('updateName', params);
  };
  //this part only available for authGuard to Ensure UserSession Object Exists
  getUser = (params: layouts.Search_User) => {
    let frmname: string | undefined = "";
    if (this.user) {
      frmname = this.user.getUsername();
      params.fromname = frmname;
    }
    if (frmname === params.name) {
      return new Promise<string>((resolve) => {
        setTimeout(() => { resolve("sameuser"); }, 0)
      });
    }
    return Moralis.Cloud.run("getUser", params);
  };
  //on aAccount changed in Metamask this will be called
  onAccountChanged = async (account: string | null) => {
    let cachedAddr: Array<string> = [];
    if (this.user && account && account !== null) {
      cachedAddr = this.user?.get("accounts");
      if (!cachedAddr.includes(account)) {
        const confirmed1 = confirm("Link this address to your account ?");
        if (confirmed1) {
          Moralis.link(account).then(
            () => {
              this.WalletSwitched.emit(account);
            }
          );
        }
      }
      else {
        const confirmed2 = confirm("Want to switch to this Account : " + account);
        if (confirmed2) {
          Moralis.link(account).then(
            () => {
              this.WalletSwitched.emit(account);
            }
          );
        }
      }
    }
  }
  //this part only available for authSignUp guard to ensure next step would be 
  //accessed only by appropriate users
  checkuser = (): Promise<boolean> => {
    return new Promise<boolean>(async (resolve) => {
      const _user: Moralis.User | null = await Moralis.User.currentAsync();
      if (_user && _user !== null) {
        if (_user.get("email") === undefined) {
          resolve(true);
        }
        else {
          this._router.navigate(["/home"], { relativeTo: this._route.parent });
        }
      }
      else {
        this._router.navigate(["/signup"], { relativeTo: this._route.parent })
          .then(
            () => {
              resolve(false);
            }
          );
      }
    });
  }
  getTokenMeta = (id: number, contractId: string) => {
    switch (id) {
      case 1:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'eth', addresses: [contractId] });
      case 137:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'polygon', addresses: [contractId] });
      case 80001:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'mumbai', addresses: [contractId] });
      case 43113:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'avalanche', addresses: [contractId] });
      case 56:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'bsc', addresses: [contractId] });
      case 97:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'bsc testnet', addresses: [contractId] });
      default:
        return Moralis.Web3API.token.getTokenMetadata({ chain: 'eth', addresses: [contractId] });
    }
  }
  //Transfer data post Cloud Functions
  transferPost = (params: layouts.TransferPost) => {
    return Moralis.Cloud.run('transferPost', params);
  };
  setWebSocket = (params: { hash: string, coll: string }) => {
    console.log(params);
    return Moralis.Cloud.run('WebsocketTran', params);
  };
  getAcctBalance = (id: number, currentAcct: string, addrs: Array<string>) => {
    switch (id) {
      case 1:
        return Moralis.Web3API.account.getTokenBalances({ chain: 'eth', address: currentAcct, token_addresses: addrs });
      case 137:
        return Moralis.Web3API.account.getTokenBalances({ chain: 'polygon', address: currentAcct, token_addresses: addrs });
      case 80001:
        return Moralis.Web3API.account.getTokenBalances({ chain: '0x13881', address: currentAcct, token_addresses: addrs });
      case 43113:
        return Moralis.Web3API.account.getTokenBalances({ chain: '0xa869', address: currentAcct, token_addresses: addrs });
      case 56:
        return Moralis.Web3API.account.getTokenBalances({ chain: 'bsc', address: currentAcct, token_addresses: addrs });
      case 97:
        return Moralis.Web3API.account.getTokenBalances({ chain: 'bsc testnet', address: currentAcct, token_addresses: addrs });
      default:
        return Moralis.Web3API.account.getTokenBalances({ chain: 'eth', address: currentAcct, token_addresses: addrs });
    }
  };
  getTransferOpt = (id: number, contract: string, receiverAddr: string, amnt: string): Moralis.TransferOptions => {
    const chinfo = this._common.getChainInfo(id);
    const subchain: { name: string, decimals: string, desc: string, contractId: string, coll: string, symbol: string, main: boolean } = chinfo.subchains.filter((e) => { return e.contractId === contract })[0];

    let opt: Moralis.TransferOptions = {
      type: (subchain.main) ? 'native' : 'erc20',
      contractAddress: (!subchain.main) ? subchain.contractId : undefined,
      receiver: receiverAddr,
      amount: (subchain.main) ? Moralis.Units.ETH(amnt) : Moralis.Units.Token(amnt, parseInt(subchain.decimals))
    };
    return opt;
  };

}
