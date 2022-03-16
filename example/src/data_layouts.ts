export interface User{
    username:string,
    authData:{
        moralisEth:{
            id:string,
            signature:string,
            data:string
        }
    }
}