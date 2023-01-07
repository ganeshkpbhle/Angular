import Moralis from "moralis"

export interface _SignUp{
    username:string,
    email:string,
    mobile:string,
    passwd:string
}
export interface _LogIn{
    username:string,
    passwd:string
}
export interface DropDown{
    viewValue:string,
    value:string,
    selected:boolean
}
export interface SignInType{
    signInType:string
}
export interface PostFriend{
    name:string,
    nickname:string,
    tgtName:string|undefined,
    fromAddr:string
}
export interface Addr{
    address:string
}
export interface Contacts{
    accounts:Array<Contact_Address>,
    block:boolean,
    name:string,
    contactId:string,
    actualName:string
}
export interface Contact_Address{
    addrId:string,
    address:string
}
export interface Search_User{
    name?:string,
    fromname?:string
}
export interface InvitesData{
    reqs:Array<Moralis.Object>,
    pends:Array<Moralis.Object>
}
export interface Pending{
    friendName:string,
    createdAt:Date,
    objectId:string
}
export interface AcctFill{
    value:number,
    acct:string,
    selected:boolean
}
export interface AcceptInvite{
    id:string,
    accts:Array<string>,
    fnick:string
}
export interface _ConfirmInvite{
    fnick:string,
    selectedAccts:Array<string>
}
export interface _FetchFriendType{
    user:Moralis.Object,
    userEnt:Array<{id:string,addr:string}>,
    friend:Moralis.Object,
    friendEnt:Array<{id:string,addr:string}>
}
export interface editAcctType{
    uid:string,
    fid:string,
    facct:Array<string>,
    uacct:string
}
export interface TransferPost{
    senderName:string|undefined,
    receiverName:string,
    units:string,
    catg:string,
    desc:string,
    network:string,
    sendAddr:string,
    recvAddr:string,
    transactionhash:string|undefined
    tokenAddress:string,
    tstamp:string
}
export interface StatusData{
    senderName:string|undefined,
    receiverName:string,
    units:string,
    catg:string,
    desc:string,
    network:string,
    sendAddr:string,
    recvAddr:string,
    transactionhash:string|undefined,
    confirm:boolean,
    gas:BigInt|undefined,
    tstamp:string,
    tokenAddress:string
}
export interface BalanceCheck{ 
    token_address: string; 
    name: string; 
    symbol: string; 
    logo?: string | undefined; 
    thumbnail?: string | undefined; 
    decimals: number; 
    balance: string; 
}
export interface metaData{
    address: string;
    name: string;
    symbol: string;
    decimals: string;
    logo?: string | undefined;
    logo_hash?: string | undefined;
    thumbnail?: string | undefined;
    block_number?: string | undefined;
    validated?: string | undefined;
}

export interface HistoryView{
    senderName:string|undefined,
    receiverName:string,
    units:string,
    transactionhash:string|undefined,
    tstamp:string,
    sendAddr:string,
    recvAddr:string
}

export interface GeneralCount{
    name:string,
    In:number,
    Out:number
}
export interface GeneralGraphPlot{
    name:string,
    value:number
}
export interface BarPlot{
    name:string,
    series:Array<GeneralGraphPlot>
}
