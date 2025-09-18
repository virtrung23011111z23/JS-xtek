export interface CartItemsProps {
    id: number,
    count: number
}
export interface HistoryShopping{
    firstName:string,
    name:string,
    email: string,
    phone:string,
    address: string,
    listproduct:CartItemsProps[]
    date:Date
}