export interface customerProps{
    firstName:string,
    name:string,
    email: string,
    phone:string,
    address: string,
}

export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^(?:\+84|0)(?:3|5|7|8|9)\d{8}$/;
export const firtNameRegex = /^(?!.*\d)(?=.*\p{L})[\p{L}\s'-]+$/u;
export const nameRegex = /^(?!.*\d)(?=.*\p{L})[\p{L}'-]+$/u;