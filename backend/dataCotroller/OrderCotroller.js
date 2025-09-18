let orders = [];
export function postOrder(req,res) {
  const infoOrder = req.body;
  if (!infoOrder) return res.status(400).json({ message: 'Missing body' });
  orders.push(infoOrder);
  return res.status(201).json(infoOrder);
}
export function removeOrder(req, res) {
  const { id } = req.params;
  orders = orders.filter(item => String(item.idOrder) !== String(id));
}
export function getOrders(req, res) {
  return res.json(orders);
}