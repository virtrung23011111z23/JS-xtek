
import { useCallback, useEffect, useState, type ChangeEvent } from "react";
import { useDataCity } from "../../hook/useDataCity";
import type { customerProps } from "../../types/customer";
import type { DistrictProps, VillageProps } from "../../types/city";
import { EmaiCheck, PhoneCheck, FirtNameRegex, NameRegex } from "../../hook/customerCheck";
import { useCartStronge, keyLocalStorageItemCart } from "../../lib/data/dataCart";
import { useProductStronge } from "../../lib/data/dataProduct";
import { IoIosArrowDown, IoMdAdd, IoIosRemove, IoMdCloseCircleOutline, IoMdClose } from "react-icons/io";
import ButtonBackShop from "../compoment/ButtonBackShop";
import type { CartItemsProps } from "../../types/cart"
import type { HistoryCartProps } from "../../types/historycart";
import Swal from 'sweetalert2';
import { UseDataOrder } from "../../lib/data/dataOrder"


const IdRadum = (order: HistoryCartProps[]) => {
    const idRadum = Math.floor(Math.random() * 10000);
    if (!order.length) return idRadum;
    const idCheckOrder = order.find(p => p.idOrder === idRadum);
    if (idCheckOrder) return IdRadum(order);
    return idRadum;
}
export default function Cart() {
    const { productList } = useProductStronge()
    const [buyModel, setBuyModal] = useState<boolean>(false)
    const [total, setTotal] = useState(0)
    const [cityId, setCityId] = useState<string>("");
    const [district, setDistrict] = useState<DistrictProps[]>([])
    const [districtId, setDistrictId] = useState<string>("");
    const [village, setVillage] = useState<VillageProps[]>([])
    const [villageId, setVillageId] = useState<string>("");
    const { cartItems, setCartItems } = useCartStronge();
    const { data: dataCity, loading: loadingCity, err: errCity } = useDataCity();
    const { loading, err, data: dataOrder } = UseDataOrder();
    const initialCustomer: customerProps = {
        firstName: "",
        name: "",
        email: "",
        phone: "",
        address: "",
    };
    const [errMesagge, setErrMesagge] = useState<customerProps>(initialCustomer);
    const [infoCotumer, setInfoCotumer] = useState<customerProps>(initialCustomer);
    const handleCount = useCallback((idInput: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const countInput = e.target.value;
        setCartItems(prev => prev.map(items =>
            idInput == items.id ? { ...items, count: Number(countInput) } : items
        ))
    }, []);

    const handleUpCount = (idCount: number, iCount: number) => {
        setCartItems(prev => prev.map(items =>
            items.id == idCount ? { ...items, count: iCount + 1 } : items
        ))
    };

    const handleDownCount = (idCount: number, iCount: number) => {
        if (iCount == 1) {
            setCartItems(prev => prev.filter(i => i.id !== idCount))
        } else {
            setCartItems(prev => prev.map(items =>
                items.id == idCount ? { ...items, count: iCount - 1 } : items
            ))
        }
    };

    const handleClear = (iddCart: number) => {
        setCartItems(prev => prev.filter(item => item.id !== iddCart))
    };

    const handleBluer = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        let errMsg = "";
        if (name == "firstName" && value.trim() === "" || name == "name" && value.trim() === "") {
            errMsg = "Yêu cầu bạn nhập đủ họ và tên"
        } else if (name == "firstName" && !FirtNameRegex(value) || name == "name" && !NameRegex(value)) errMsg = "Họ chỉ được các chữ không gồm số,Tên chỉ gồm các chữ cái không chữ, không có khoảng trắng";
        if (name == "email" && value.trim() === "") {
            errMsg = "Trường dữ liệu bắt buộc phải nhập";
        } else if (name == "email" && !EmaiCheck(value)) errMsg = "Yêu cầu bạn nhập đúng định dạng email";
        if (name == "phone" && value.trim() === "") {
            errMsg = "Trường dữ liệu bắt buộc phải nhập";
        } else if (name == "phone" && !PhoneCheck(value)) errMsg = "Yêu cầu bạn nhập đúng số điện thoại";
        if (name == "address" && value.trim() === "") errMsg = "Trường dữ liệu bắt buộc phải nhập";
        setErrMesagge(prev => ({ ...prev, [name]: errMsg }));
    };

    useEffect(() => {
        localStorage.setItem(keyLocalStorageItemCart, JSON.stringify(cartItems))
        let totalPart = 0;
        cartItems.map((i) => {
            const numberProduct = productList.find(p => p.id === i.id);
            if (!numberProduct) return null;
            totalPart = totalPart + numberProduct.price * i.count
        })
        setTotal(totalPart)
    }, [cartItems, productList]);

    useEffect(() => {
        setVillageId("");
        const distrisPart = dataCity.find(p => p.name === cityId);
        setDistrict(distrisPart ? distrisPart.districts : []);
    }, [cityId, dataCity]);

    useEffect(() => {
        setVillageId("");
        const villagePart = district.find(p => p.name === districtId);
        setVillage(villagePart ? villagePart.wards : []);
    }, [districtId, district]);
    const handlFormOrder = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setInfoCotumer(prev => ({ ...prev, [name]: value }));
    }
    const handleOrder = async (e: React.FormEvent<HTMLFormElement>) => {
        const nameCountMaxOut: string[] = [];
        e.preventDefault();
        cartItems.forEach((cart) => {
            const countCheckPart = productList.find(i => cart.id === i.id)
            if (!countCheckPart) return null;
            else if (countCheckPart?.quantity < cart.count) nameCountMaxOut.push(countCheckPart.name);
        });
        if (nameCountMaxOut.length > 0) {
            const countCheck = nameCountMaxOut.join(" - ");
            await Swal.fire({
                title: "Vượt quá số lượng rồi",
                text: `${countCheck} đang vượt quá số lượng còn lại`,
                icon: 'error',
                confirmButtonText: "Nhập lại",
            })
            return;
        }
        const addressPart = infoCotumer.address
        infoCotumer.address = [cityId, districtId, villageId, addressPart].join(' - ');
        const OrderList: HistoryCartProps = { idOrder: IdRadum(dataOrder), customer: infoCotumer, details: cartItems, date: new Date() }
        try {
            const reponse = await fetch('http://localhost:5000/api/order', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(OrderList)
            });
            if (reponse.ok) {
                window.localStorage.removeItem(keyLocalStorageItemCart);
                setCartItems([]);
                const result = await Swal.fire({
                    title: "Thanks you",
                    text: "Bạn đã đặt hàng thành công",
                    icon: "success",
                    confirmButtonText: "OK",
                    timer: 2000,
                    timerProgressBar: true,
                });

                if (result.isConfirmed || result.dismiss === Swal.DismissReason.timer) {
                    window.location.reload();
                }
            } else {
                const text = await reponse.text().catch(() => null);
                console.error("Server error response:", text);
                await Swal.fire({
                    title: "Có tý trục trặc",
                    text: "Không thể gửi yêu cầu mong bạn thông cảm, hãy thử lại sau ít phút hoặc liên hệ chăm sóc khách hàng",
                    icon: 'error',
                    confirmButtonText: "Thử lại"
                });
            };
        } catch (err) {
            console.error('Error:', err);
            await Swal.fire({
                title: "Lỗi nghiêm trọng rồi :((",
                text: "Vui lòng liên hệ chăm sóc khách hàng để sửa lỗi ngay nhé",
                icon: "warning",
                confirmButtonText: "Oke"
            })
        }
    }
    if (loading || loadingCity) return <div>Loading....</div>
    if (err || errCity) return <div >{err}</div>
    return (
        <>{cartItems.length ? (
            <>
                <div className="wrapper">
                    <ul className="cart__header cart__list">
                        <li className="cart__name">Product Name</li>
                        <li className="cart__quanty">Quantity</li>
                        <li className="cart__item" >Subtotal</li>
                        <li className="cart__item">Total</li>
                        <li className="cart__item">Clear Cart</li>
                    </ul>
                    {cartItems.map((cart: CartItemsProps) => {
                        const numberProduct = productList.find(p => p.id === cart.id);
                        if (!numberProduct) return null;
                        return (
                            <ul key={cart.id} className="cart__list">
                                <li className="cart__name" ><div className="cart__product__Info">
                                    <img src={numberProduct.src} />
                                    <div className="cart__product__des">
                                        <h3>{numberProduct.name}</h3>
                                        <p>Quantity: {numberProduct.quantity}</p>
                                    </div>
                                </div>
                                </li>
                                <li className="cart__quanty">
                                    <button className="cart__update--count" onClick={() => handleUpCount(cart.id, cart.count)}><IoMdAdd size={24} /></button>
                                    <input type="number" className="cart__input" value={cart.count} onChange={(e) => handleCount(cart.id, e)} />
                                    <button className="cart__update--count" onClick={() => handleDownCount(cart.id, cart.count)}><IoIosRemove size={24} /></button>
                                </li>
                                <li className="cart__item">${numberProduct.price}</li>
                                <li className="cart__item">${numberProduct.price * cart.count}</li>
                                <li className="cart__item"><button className="cart__clear" onClick={() => handleClear(cart.id)}><IoMdCloseCircleOutline size={30} /></button></li>
                            </ul>)
                    })}
                    <div className="cart__total">
                        <p>Total: ${total}</p>
                    </div>
                    <div className="cart__button">
                        <ButtonBackShop />
                        <button className="cart__buy" onClick={() => setBuyModal(true)}>Buy</button>
                    </div>
                </div>
                <div className={`modal__fixed ${buyModel ? "active" : ""}`}>
                    <div className="modal__buy">
                        <div className="modal__buy--header">
                            <h3>Thông tin người mua</h3>
                            <button className="btn" onClick={() => setBuyModal(false)}><IoMdClose size={20} /></button>
                        </div>
                        <form className="form__buy" onSubmit={handleOrder}>
                            <div className="form__item">
                                <label>Họ và tên <span>*</span></label>
                                <div className="form__input-box">
                                    <input type="text" name="firstName" placeholder="Họ" onBlur={handleBluer} onChange={handlFormOrder} />
                                    <input type="text" name="name" placeholder="Tên" onBlur={handleBluer} onChange={handlFormOrder} />
                                </div>
                                {errMesagge.firstName && <span>{errMesagge.firstName}</span> || errMesagge.name &&
                                    <span>{errMesagge.name}</span>}
                            </div>
                            <div className="form__item">
                                <label>Email <span>*</span></label>
                                <div className="form__input-box">
                                    <input type="email" name="email" placeholder="Email" onBlur={handleBluer} onChange={handlFormOrder} />
                                </div>
                                {errMesagge.email &&
                                    <span>{errMesagge.email}</span>}
                            </div>
                            <div className="form__item">
                                <label>Số điện thoại <span>*</span></label>
                                <div className="form__input-box">
                                    <input type="text" name="phone" placeholder="Số điện thoại" onBlur={handleBluer} onChange={handlFormOrder} />
                                </div>
                                {errMesagge.phone &&
                                    <span>{errMesagge.phone}</span>
                                }
                            </div>
                            <div className="form__item">
                                <label>Địa chỉ <span>*</span></label>
                                <div className="form__input-box">
                                    <div className="form__select-box active">
                                        <select id="select-city" name="select-city" onChange={(e) => setCityId(e.target.value)} >
                                            <option value="" hidden>-- Chọn Tỉnh/Thành phố --</option>
                                            {dataCity.map((city, i) =>
                                                <option key={i} value={city.name}>{city.name}</option>
                                            )}
                                        </select>
                                        <IoIosArrowDown className="form__select-icon" size={20} />
                                    </div>
                                    <div className={`form__select-box ${cityId ? 'active' : ''}`}>
                                        <select id="select-district" name="select-district" onChange={(e) => setDistrictId(e.target.value)}>
                                            <option value="" hidden>-- Chọn Huyện/Quận phố --</option>
                                            {district.map((district) =>
                                                <option key={district.codename} value={district.name}>{district.name}</option>)}
                                        </select>
                                        <IoIosArrowDown className="form__select-icon" size={20} />
                                    </div>
                                    <div className={`form__select-box ${districtId ? 'active' : ''}`}>
                                        <select id="select-village" name="select-village" onChange={(e) => setVillageId(e.target.value)}>
                                            <option value="" hidden>-- Chọn Phường/Xã phố --</option>
                                            {village.map((village) =>
                                                <option key={village.codename} value={village.name}>{village.name}</option>)}
                                        </select>
                                        <IoIosArrowDown className="form__select-icon" size={20} />
                                    </div>
                                </div>
                                <input type="text" name="address" className="form__adress" placeholder="Địa chỉ" value={infoCotumer.address} onChange={handlFormOrder} onBlur={handleBluer} />
                                {errMesagge.address &&
                                    <span>{errMesagge.address}</span>}
                            </div>
                            <div className="form__item">
                                <label>Lời nhắn </label>
                                <div className="form__input-box">
                                    <textarea name="message" placeholder="Lời nhắn" />
                                </div>
                            </div>
                            <div className="form__btn">
                                <button className="btn btn-err" type="button" onClick={() => setBuyModal(false)} >Hủy</button>
                                <button className="btn btn-submit" disabled={
                                    !!(
                                        errMesagge.firstName.trim() ||
                                        errMesagge.name.trim() ||
                                        errMesagge.email.trim() ||
                                        errMesagge.address.trim() ||
                                        errMesagge.phone.trim()
                                    ) || !villageId
                                } type="submit">Xác nhận</button>
                            </div>
                        </form>
                    </div>
                </div>
            </>
        ) : (
            <div className="wrapper">
                <div className="cart__no">
                    <img src="src/assets/img/cocart.png" alt="no-cart" />
                </div>
                <ButtonBackShop />
            </div >
        )
        }
        </>
    )
}