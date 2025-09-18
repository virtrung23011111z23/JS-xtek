import { useState,useEffect } from "react";
import type { CartItemsProps } from "../../types/cart"


export const keyLocalStorageItemCart = "DANHSACHITEMCART";
export const keyLocalStorageListSP = "DANHSACHSP";

export function useCartStronge() {
    const [cartItems, setCartItems] = useState<CartItemsProps[]>(() => {
        const cartPart = localStorage.getItem(keyLocalStorageItemCart);
        return cartPart ? JSON.parse(cartPart) : [];
    });
    useEffect(() => {
        localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(cartItems))
    }, [cartItems])
    return { cartItems, setCartItems }
}