// "use client"
import {DOMAIN} from "components/settings";
import Product from "components/Product";

async function getProduct(slug) {
  let res = await fetch(`${DOMAIN}/api/catalog/product/${slug}`);
  if ( res.status === 200 ) {
    return res.json();
  } else {
    return {};
  }
}


export default async function ProductPage({params}) {
  const productSlug = params['category-or-product'][0];

  let [product] = await Promise.all([
    getProduct(productSlug),
  ]);

  return <Product product={product} />
}