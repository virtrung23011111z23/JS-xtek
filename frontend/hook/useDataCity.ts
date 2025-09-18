import { useEffect, useState } from "react"
import {GetDataCity} from "../lib/data/dataCity"
import type {CityProps} from "../types/city"
export const useDataCity = () =>{
    const [data,setData] =useState<CityProps[]>([]);
    const [loading,setLoading] = useState(true)
    const [err,setErr] =useState(null)
    useEffect(() => {
        GetDataCity()
        .then(data => setData(data))
        .catch(err => setErr(err))
        .finally(() => setLoading(false));
    },[]);
    return {data,loading,err}
}