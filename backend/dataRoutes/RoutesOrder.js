import express from 'express'
import {getOrders,postOrder,removeOrder} from '../dataCotroller/OrderCotroller.js'
const router = express.Router()

router.post('/',postOrder)
router.get('/',getOrders)
router.delete('/:id',removeOrder)
export default router