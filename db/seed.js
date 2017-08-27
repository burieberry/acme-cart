module.exports = (Product, LineItem, Order) => {
  return Promise.all([
      Product.create({ name: 'foo' }),
      Product.create({ name: 'bar' }),
      Product.create({ name: 'bazz' }),
      LineItem.create({ quantity: 1 }),
      LineItem.create({ quantity: 4 }),
      LineItem.create({ quantity: 2 }),
      Order.create({ address: 'New York', isCart: true }),
      Order.create({ address: 'California', isCart: true }),
      Order.create({ address: 'California', isCart: false }),
    ])
    .then(([foo, bar, bazz, lineitem1, lineitem2, lineitem3, o1, o2, o3]) => {
      return Promise.all([
        lineitem1.setProduct(foo),
        lineitem1.setOrder(o1),
        lineitem2.setProduct(bar),
        lineitem2.setOrder(o2),
        lineitem3.setOrder(o3)
      ])
        .then(([lineitem1, lineitem2, lineitem3]) => {
          return lineitem1, lineitem2, lineitem3;
        });
    })
    .catch(console.error);
}
