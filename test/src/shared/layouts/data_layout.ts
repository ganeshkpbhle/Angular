export interface User{
    username?:string,
    authData:{
        moralisEth:{
            id:string,
            signature:string,
            data:string
        }
    },
    createdAt:Date,
    updatedAt:Date,
    accounts:Array<string>,
    ethAddress?:string,
    objectId:string,
    ACL?:{},
    sessionToken:string
}