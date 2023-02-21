import {DOMAIN} from "components/settings";
import Category from "components/Category";

async function getProducts(slug, filtrationSearchParams) {
   let res = await fetch(`${DOMAIN}/api/catalog/categories/${slug}/products?${filtrationSearchParams}`);
   return res.json();
}

async function getFilters(slug, filtrationSearchParams) {
   let res = await fetch(`${DOMAIN}/api/catalog/categories/${slug}/filters?${filtrationSearchParams}`);
   return res.json();
}


async function getCategory(slug) {
   let res = await fetch(`${DOMAIN}/api/catalog/categories/${slug}`);
   return res.json();
}


export default async function CategoryPage({ params, searchParams }) {
   let filtersParams = {};
   let pageParams = params['category-or-product'];
   let filterKey, filterValue, pageParam;
   const categorySlug = pageParams[0];
   for (let i = 1 ; i < pageParams.length; i++) {
     pageParam = decodeURIComponent(pageParams[i]);
     if (pageParam.indexOf('=') === -1) {
       // todo redirect
     }
     [filterKey, filterValue] = pageParam.split('=');
     if ( searchParams[filterKey] ) {
       // todo redirect
     }
     filtersParams[filterKey] = filterValue;
   }
   filtersParams = {
     ...filtersParams,
     ...searchParams
   }
   let filtrationSearchParams = (new URLSearchParams(filtersParams)).toString();
   let [category, products, filters] = await Promise.all([
     getCategory(categorySlug),
     getProducts(categorySlug, filtrationSearchParams),
     getFilters(categorySlug, filtrationSearchParams),
   ]);
   return <Category
     category={category}
     products={products}
     filters={filters}
     baseUrl={decodeURIComponent(`/${pageParams.join('/')}`)}
     filtersParams={filtersParams}
   />
}