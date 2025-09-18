import type {CityProps} from "../../types/city"
export async function GetDataCity():Promise<CityProps[]>{
    const res = await fetch("https://provinces.open-api.vn/api/v1/?depth=3")
    if (!res.ok) throw new Error("Lỗi không tìm thấy dữ liệu");
    return res.json()
}