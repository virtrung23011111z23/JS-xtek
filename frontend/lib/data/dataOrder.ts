import type {HistoryCartProps,} from "../../types/historycart"
import { useState,useEffect } from "react";
export async function GetDataOrder(): Promise<HistoryCartProps[]>{
    const res = await fetch("http://localhost:5000/api/order")
    if (!res.ok) throw new Error("Lỗi không tìm thấy dữ liệu");
    return res.json()
}
export function UseDataOrder(){
    const [data,setData] =useState<HistoryCartProps[]>([]);
    const [loading,setLoading] = useState(true)
    const [err,setErr] =useState(null)
    useEffect(() => {
        GetDataOrder()
        .then(data => setData(data))
        .catch(err => setErr(err))
        .finally(() => setLoading(false));
    },[]);
    return {loading,err,data}
}