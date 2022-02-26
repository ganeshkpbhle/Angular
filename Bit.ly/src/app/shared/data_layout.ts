export interface _SignIn {
    GId: string,
    FirstName: string,
    LastName: string | null,
    Mobile: string,
    Email: string,
    EmailVerified: number,
    SnType: string,
    Passwd: string
}
export interface _Login{
    Uemail:string,
    Passwd:string
}
export interface _LoginResponse{
    token:string,
    id:number
}
export interface _Logout{
    Del:number|undefined
}
export interface _PostUrl{
    UrlId:string,
    LongUrl:string,
    UserId:number,
    CreatedDate:string
}
export interface _SendMail{
    ToMail:string,
    Subject:string|null,
    Body:string
}
export interface _Vfc{ 
    Id:number 
}
export interface _UrlCompute{
    Id:number,
    Opt:number
}
export interface _ComputeResult{
    name:string,
    value:number
}
interface _UrlItem{
    urlId:string,
    longUrl:string,
    createdDate:string
}
export interface _UrlList{
    name:string,
    urls:Array<_UrlItem>,
    count:number
}
export interface _UserInfo{
    id:number,
    gId:string,
    firstName:string,
    lastName:string,
    mobile:string,
    email:string,
    emailVerified:number,
    snType:string
}
export interface _UpdateProf{
    Id:number,
    FirstName:string,
    LastName:string,
    Mobile:string,
    Email:string
}
export interface _FeedPattn{
    name:string,
    series:Array<_ComputeResult>
}