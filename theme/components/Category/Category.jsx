import React from "react";
import styles from "./category.module.scss";
import dynamic from "next/dynamic";
import Filters from "./Filters";
import Products from "../Common/Products/Products";
import MobileProducts from "../Common/Products/MobileProducts";
// const Products = dynamic(() => import('../Common/Products/Products'));
// const MobileProducts = dynamic(() => import('../Common/Products/MobileProducts'));


export default function Category({ category, products, filters, isMobile, filtersParams, baseUrl }) {
  return <>
    <div className={styles.Category}>
      <h1>{ category.name }</h1>
      {
        isMobile
          ? <div>
            <MobileProducts products={products}/>
          </div>
          : <div className={styles.Category__content}>
            <div className={styles.Category__left}>
              <Filters filters={filters} category={category}/>
            </div>
            <div className={styles.Category__middle}>
              <Products products={products} baseUrl={baseUrl} filtersParams={filtersParams}/>
            </div>
          </div>
      }
    </div>
   </>
}