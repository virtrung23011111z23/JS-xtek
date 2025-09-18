import {emailRegex,phoneRegex,firtNameRegex,nameRegex} from "../types/customer"

export function EmaiCheck(email:string){
    return emailRegex.test(email)
}
export function PhoneCheck(phone:string){
    return phoneRegex.test(phone);
}
export function FirtNameRegex(fname:string){
    return firtNameRegex.test(fname)
}

export function NameRegex(name:string){
    return nameRegex.test(name)
}