import type { CartItemsProps } from "./cart"
import type { customerProps } from "./customer"
export interface HistoryCartProps {
    idOrder: number,
    customer: customerProps,
    details: CartItemsProps[],
    date: Date ,
}
