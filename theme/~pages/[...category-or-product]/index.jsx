import React from "react";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";
import {DOMAIN} from "../../components/settings";
import {redis} from "../../utils/redis";
import dynamic from 'next/dynamic'
const Category = dynamic(() => import('../../components/Category'), );
const Product = dynamic(() => import('../../components/Product'), );

export default function CategoryOrProduct(props) {
  const { pageType } = props;
  if ( pageType === 'product' ) {
    return <Product {...props}/>
  } else {
    return <Category {...props}/>
  }
}


export async function getServerSideProps(context) {
  let { params, locale } = context;
  let categoryOrProduct = params['category-or-product'][0];
  let pageType;
  let props;
  let header;
  const isCategory = await redis.sismember('categories-slugs', categoryOrProduct);
  if ( !isCategory ) {
    let [productData] = await Promise.all([
      fetch(`${DOMAIN}/api/catalog/product/${categoryOrProduct}`),
    ])
    const product = await productData.json();
    // header = headerData
    pageType = 'product';
    props = {
      product
    }
  } else {
      let filtersParams = {};
      let pageParams = params['category-or-product'];
      let filterKey, filterValue, pageParam;
      for (let i = 1 ; i < pageParams.length; i++) {
        pageParam = pageParams[i];
        if (pageParam.indexOf('=') === -1) {
          // todo redirect
        }
        [filterKey, filterValue] = pageParams[i].split('=');
        filtersParams[filterKey] = filterValue;
      }
      let filtrationSearchParams = new URLSearchParams(filtersParams);
    let [categoryData, productsData, filtersData] = await Promise.all([
      fetch(`${DOMAIN}/api/catalog/categories/${categoryOrProduct}`),
      fetch(`${DOMAIN}/api/catalog/categories/${categoryOrProduct}/products?${filtrationSearchParams.toString()}`),
      fetch(`${DOMAIN}/api/catalog/categories/${categoryOrProduct}/filters?${filtrationSearchParams.toString()}`),
    ]);
    const category = await categoryData.json();
    const products = await productsData.json();
    const filters = await filtersData.json();
    // header = headerData
    pageType = 'category';
    props = {
      category,
      products,
      filters,
    }
  }
  const UA = context.req.headers['user-agent'];
  const isMobile = Boolean(UA.match(
    /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
  ))
  return {
    props: {
      pageType,
      ...props,
      // ...header,
      isMobile,
      ...(await serverSideTranslations(locale, [
        'top-bar', 'category-filters'
      ])),
    },
  }
}