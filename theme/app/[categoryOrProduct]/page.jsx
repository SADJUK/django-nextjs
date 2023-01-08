import React, {Fragment} from "react";
import styles from './page.module.scss'
import Products from "../../components/Products/Products";
// import {serverSideTranslations} from "next-i18next/serverSideTranslations";

const domain = 'http://localhost:8000'

async function getProducts(slug) {
   let res = await fetch(`${domain}/api/catalog/categories/${slug}/products`);
   return res.json();
}

async function getCategory(slug) {
   let res = await fetch(`${domain}/api/catalog/categories/${slug}`);
   return res.json();
}

export default async function Page({params}) {
  const productsData = getProducts(params['categoryOrProduct']);
  const categoryData = getCategory(params['categoryOrProduct']);
  const [products, category] = await Promise.all([productsData, categoryData]);
  return <>
    <div className="content">
      <h1>{ category.name }</h1>
      <Products products={products}></Products>
    </div>
  </>
}