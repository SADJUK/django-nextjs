import Head from "next/head";
import React from "react";
import Products from "../../components/Products/Products";
import {getHeaderData} from "../../components/utils";
import {DOMAIN} from "../../components/settings";

function Product({ product }) {
   return <>
    <div className="content">
      <h1>{ product.name }</h1>
    </div>
   </>
}

function Category({ category, products }) {
  return <>
    <div className="content">
      <h1>{ category.name }</h1>
      <Products products={products}></Products>
    </div>
   </>
}

export default function CategoryOrProduct(props) {
  const { pageType } = props;
  if ( pageType === 'product' ) {
    return <Product {...props}/>
  } else {
    return <Category {...props}/>
  }
}




export async function getServerSideProps(context) {
  let { params } = context;

  let [res, headerData] = await Promise.all([
    fetch(`${DOMAIN}/api/catalog/categories/${params['category-or-product']}`),
    await getHeaderData(context)
  ]);
  let pageType;
  let props;
  if ( res.status === 404 ) {
    res = await fetch(`${DOMAIN}/api/catalog/product/${params['category-or-product']}`);
    const product = await res.json();
    pageType = 'product';
    props = {
      product
    }
  } else {
    const category = await res.json();
    res = await fetch(`${DOMAIN}/api/catalog/categories/${params['category-or-product']}/products`);
    const products = await res.json();
    pageType = 'category';
    props = {
      category,
      products,
    }
  }

  return {props: {
      pageType,
      ...props,
      ...headerData
  }}
}