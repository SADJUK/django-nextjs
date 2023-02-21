import {DOMAIN} from "./settings";
import Category from "./Category";

export async function getHeaderData({locale}) {
  const res = await fetch(`${DOMAIN}/api/catalog/categories`);
  let categories = await res.json()
  return {
    categories,
  }
}


export default async function CategoryPage({props}) {
  return <Category {...props}/>
}