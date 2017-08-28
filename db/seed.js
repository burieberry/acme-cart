module.exports = (Product, LineItem, Order) => {
  const options = {
    include: [
      { model: LineItem }
    ]
  };

  return Promise.all([
      Product.create({ name: 'foo' }),
      Product.create({ name: 'bar' }),
      Product.create({ name: 'bazz' }),
      LineItem.create({ quantity: 1 }),
      LineItem.create({ quantity: 4 }),
      LineItem.create({ quantity: 2 }),
      Order.create({ address: 'New York', isCart: false }, options),
      Order.create({ address: null, isCart: true }, options),
      Order.create({ address: 'California', isCart: false }, options),
    ])
    .then(([foo, bar, bazz, l1, l2, l3, o1, o2, o3]) => {
      return Promise.all([
        l1.setProduct(foo),
        l1.setOrder(o1),
        l2.setProduct(bar),
        l2.setOrder(o2),
        l3.setProduct(bazz),
        l3.setOrder(o3)
      ])
    })
    .catch(console.error);
}
