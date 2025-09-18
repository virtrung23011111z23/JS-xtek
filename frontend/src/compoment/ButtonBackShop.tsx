import { Link } from 'react-router-dom';
import { IoMdArrowRoundBack } from "react-icons/io";
export default function ButtonBackShop() {
    return (
        <Link to="/" className='btn-backshop'><IoMdArrowRoundBack size={10} /> Back to Shopping</Link>
    )
}