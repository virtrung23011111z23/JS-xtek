import type { dataProductProps } from "../../types/product"
import { useEffect, useState } from 'react';
import { MdAddShoppingCart, MdClose } from "react-icons/md";
import { IoMdAdd, IoIosRemove } from "react-icons/io";
import { useCartStronge } from "../../lib/data/dataCart"
import Swal from 'sweetalert2';
export default function Home() {
    const { cartItems, setCartItems } = useCartStronge()
    const keyLocalStorageListSP = "DANHSACHSP";
    const raw = localStorage.getItem(keyLocalStorageListSP);
    const productList: dataProductProps[] = raw ? JSON.parse(raw) : [];
    const [quantity, setQuantity] = useState<number>(1)
    const [modalQuantity, setModalQuantity] = useState({
        open: false,
        name: "",
        id: 0,
        src: "",
        count: 0
    })
    const openModelAddCart = (name: string, id: number, src: string, quant: number) => {
        setModalQuantity({
            open: true,
            name: name,
            id: id,
            src: src,
            count: quant
        })
    }
    const closeModel = () => {
        setModalQuantity(
            prev => ({ ...prev, open: false })
        )
    }

    const handleAddCart = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const ItemCartId = cartItems.find(i => i.id === modalQuantity.id)
        if (ItemCartId) {
            setCartItems(prev => prev.map((i) => i.id == modalQuantity.id ? { ...i, count: i.count + quantity } : i))

        }
        else {
            setCartItems(prev => [...prev, { id: modalQuantity.id, count: quantity }])
        }
        const resForm = await Swal.fire({
            title: "Thành công",
            text: "Bạn đã thêm vào giỏ hàng",
            icon: "success",
            timer: 2000,
            timerProgressBar: true,
        });
        if (resForm.isConfirmed || resForm.dismiss === Swal.DismissReason.timer) window.location.reload();
    }

    const handleChanhge = (e: React.ChangeEvent<HTMLFormElement>) => {
        e.preventDefault()
    }
    useEffect(() => {
        if (modalQuantity.open === false) setQuantity(1)
    }, [modalQuantity])
    return (
        <>
            <div className="wrapper">
                <div className="product__container">
                    {productList.map((i) =>
                        <div key={i.id} className="product__box">
                            <div className="product__img">
                                <img src={i.src} />
                                <button className="product__add-cart" onClick={() => openModelAddCart(i.name, i.id, i.src, i.quantity)}>
                                    <MdAddShoppingCart size={30} />
                                </button>
                            </div>
                            <div className="product__content">
                                <h2>{i.name}</h2>
                                <div className="product__des">
                                    <p>${i.price}</p>
                                    <p>Quantily:{i.quantity}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className={`modal__fixed ${modalQuantity.open ? "active" : ""}`}>
                <div className="modal__quantity">
                    <div className="modal__header">
                        <button className="btn modal_button-close" onClick={closeModel}>
                            <MdClose size={20} />
                        </button>
                    </div>
                    <div className="modal__Info">
                        <h2>{modalQuantity.name}</h2>
                        <div className="modal__img_product">
                            {modalQuantity.src && <img src={modalQuantity.src} />}
                        </div>
                        <form onSubmit={handleAddCart} className="modal__form_addcart" onChange={handleChanhge}>
                            <input type="hidden" name="id" value={modalQuantity.id} />
                            <div className="modal_form">
                                <button type='button' className={`btn btn_update-quantity ${quantity >= modalQuantity.count ? "disabled" : ""}`} onClick={() => setQuantity(quantity => quantity + 1)}><IoMdAdd /></button>
                                <input type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
                                <button type='button' className={`btn btn_update-quantity ${quantity <= 1 ? "disabled" : ""}`} onClick={() => setQuantity(quantity => quantity - 1)}><IoIosRemove /></button>
                            </div>
                            <button type='submit' className=' modal__btn_addcart'>Add to cart</button>
                        </form>
                    </div>
                </div>
            </div >
        </>
    )
}