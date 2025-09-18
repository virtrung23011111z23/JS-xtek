import { useState } from "react";
import { UseDataOrder } from "../../lib/data/dataOrder";
import { useProductStronge } from "../../lib/data/dataProduct";
import { FaCaretDown, FaCaretUp } from "react-icons/fa";
import { IoMdCloseCircleOutline } from "react-icons/io";
import ButtonBackShop  from "../compoment/ButtonBackShop";
import Swal from 'sweetalert2';
export default function Order() {
    const { loading, err, data } = UseDataOrder();
    console.log(data)
    const { productList } = useProductStronge()
    const [open, setOpen] = useState({
        status: false,
        id: 0
    });
    if (loading) return <div>....Đang load...</div>
    if (err) return <div>lỗi rồi...</div>
    const handleRomove = async (id: number) => {
        const result = await Swal.fire({
            title: `Xóa ?`,
            text: "Hành động này không thể hoàn tác.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Xóa",
            cancelButtonText: "Hủy",
            reverseButtons: true,
        });
        if (!result.isConfirmed) return;
        if (result.isConfirmed) {
            try {
                const res = await fetch(`http://localhost:5000/api/order/${id}`, { method: 'DELETE' });

                if (!res.ok) {
                    const text = await res.text();
                    await Swal.fire({
                        title: 'Lỗi',
                        text: `Xóa thất bại: ${res.status} ${text}`,
                        icon: 'error'
                    });
                    return;
                }

                await Swal.fire({
                    title: 'Đã xóa',
                    text: 'Đơn hàng đã được xóa',
                    icon: 'success'
                });
                window.location.reload();
            } catch (err) {
                await Swal.fire({
                    title: 'Lỗi mạng',
                    text: 'Không thể kết nối tới server',
                    icon: 'error'
                });
                console.error(err);
            }
        }

    };
    return (
        <>
            <div className="wrapper">
                <ul className="cart__header cart__list">
                    <li className="cart__item">Code</li>
                    <li className="cart__item">Customer Name</li>
                    <li className="cart__item" >Date</li>
                    <li className="cart__item">Item Numbers</li>
                    <li className="cart__item">Total Quantity</li>
                    <li className="cart__item">Total Price</li>
                    <li className="cart__item">Return</li>
                </ul>
                {data.length ? (data.map((order) => {
                    let countItems = 0;
                    let totalAll = 0;
                    order.details.forEach((detail) => {
                        const detailPart = productList.find(p => p.id == detail.id);
                        if (!detailPart) return;
                        totalAll = totalAll + detailPart.price * detail.count;
                        countItems = countItems + detail.count;
                    })
                    return (
                        <div key={order.idOrder}>
                            <ul className="cart__list">
                                <div className="order-Cart cart__item">
                                    <li className="cart__item">{order.idOrder}</li>
                                    <span onClick={() => setOpen(prev => ({ status: !prev.status, id: order.idOrder }))}>Details{open.status && order.idOrder == open.id ? <FaCaretUp size={16} /> : <FaCaretDown size={16} />} </span>
                                </div>
                                <li className="cart__item">{order.customer.name}</li>
                                <li className="cart__item" >{new Date(order.date).toLocaleDateString()}</li>
                                <li className="cart__item">{order.details.length}</li>
                                <li className="cart__item">{countItems}</li>
                                <li className="cart__item">${totalAll}</li>
                                <li className="cart__item"><button className="cart__clear" onClick={() => handleRomove(order.idOrder)}><IoMdCloseCircleOutline size={30} /></button></li>
                            </ul>
                            <div className={`Details__order ${open.status && order.idOrder == open.id ? "active" : ""}`}>
                                {order.details.map((detailsor) => {
                                    const detailsorPart = productList.find(p => p.id == detailsor.id);
                                    if (!detailsorPart) return null;
                                    return (
                                        <ul key={detailsor.id} className="Details__list">
                                            <li><img src={detailsorPart.src} /></li>
                                            <li>{detailsorPart.name}</li>
                                            <li>{detailsor.count}</li>
                                            <li>${detailsorPart.price}</li>
                                        </ul>
                                    )
                                }
                                )}
                            </div>
                        </div>
                    )
                }
                )
                ) : (<div className="unOrder">Không có sản phẩm trong giỏ hàng</div>)
                }
                <ButtonBackShop />
            </div>
        </>
    )
} 