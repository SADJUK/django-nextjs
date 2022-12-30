// 'use client';
import React, {Fragment} from "react";
import styles from './page.module.scss'
import Products from "../../components/Products/Products";
// import {serverSideTranslations} from "next-i18next/serverSideTranslations";
// import {useRouter} from "next/navigation";

const domain = 'http://localhost:8000'

async function getProducts(slug) {
   let res = await fetch(`${domain}/api/catalog/categories/${slug}/products`);
   return res.json();
}

async function getCategory(slug) {
   let res = await fetch(`${domain}/api/catalog/categories/${slug}`);
   return  res.json();
}

export default async function Page({params}) {
  // const router = useRouter();
  const productsData = getProducts(params['categoryOrProduct']);
  const categoryData = getCategory(params['categoryOrProduct']);

  // Wait for the promises to resolve
  const [products, category] = await Promise.all([productsData, categoryData]);
  return <>
    <div className="content">
      <h1>{ category.name }</h1>
      <Products products={products}></Products>
    </div>
  </>
}

// export async function getServerSideProps(context) {
//   let {params} = context;
//   let domain = 'http://localhost:8000'
//   // let res = await fetch(`${domain}/api/catalog/categories`);
//   // let categories = await res.json()
//   // let res1 = await fetch(`${domain}/api/catalog/categories/${params['category-or-product']}/products`);
//   // const products = await res1.json();
//   // let res2 = await fetch(`${domain}/api/catalog/categories/${params['category-or-product']}`)
//   // let category = await res2.json();
//   return {props: {
//       ...(await serverSideTranslations(context.locale, [
//         'top-bar',
//       ])),
//       // categories,
//       // products,
//       // category
//   }}
// }