import React, {Fragment} from "react";
import {redis} from "utils/redis";
import CategoryPage from "./CategoryPage";
import ProductPage from "./ProductPage";


async function getIsCategory(slug) {
  return redis.sismember('categories-slugs', slug);
}

export default async function CategoryOrProduct({ params, searchParams }) {
  let categoryOrProduct = params['category-or-product'][0];
  const isCategory = await getIsCategory(categoryOrProduct);
  if ( isCategory ) {
    return <CategoryPage params={params} searchParams={searchParams}/>
  } else {
    return <ProductPage params={params} searchParams={searchParams}/>
  }
}