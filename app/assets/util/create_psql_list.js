export default function createPsqlList(items) {
  let order = '';
  items.forEach((item, index) => {
    order += `${index === 0 ? '' : ', '}${item}`;
  });
  order = `{${order}}`;
  return order;
}
