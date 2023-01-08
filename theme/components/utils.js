import {DOMAIN} from "./settings";
import {serverSideTranslations} from "next-i18next/serverSideTranslations";

export async function getHeaderData({locale}) {
  const res = await fetch(`${DOMAIN}/api/catalog/categories`);
  let categories = await res.json()
  return {
    categories,
    ...(await serverSideTranslations(locale, [
      'top-bar',
    ])),
  }
}