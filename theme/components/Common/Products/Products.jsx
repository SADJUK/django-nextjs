import Link from "next/link";
import Image from "next/image";
import styles from './products.module.scss';
import placeholder200x200 from '../../../styles/placeholders/200x200.png';
import {PAGINATION_PARAM_NAME} from "../../../settings";

function Product({ product }) {
  return <div className={`${ styles.Product }`}>
        <Image
          src={placeholder200x200}
          alt={product.name}>

        </Image>
        <div className="product__name">
          <Link href={`/${product.slug}`}>{product.name}</Link>
        </div>
  </div>
}

function PaginationItem({ pageNumber, baseUrl, filtersParams, children, isActive }) {
  let pageParams = { ...filtersParams }
  pageParams[PAGINATION_PARAM_NAME] = pageNumber;
  let prefix = '?';
  let paginationUrl = baseUrl;
  for (const [key, value] of Object.entries(pageParams)) {
    paginationUrl += `${prefix}${key}=${value}`;
    prefix = '&';
  }
  return <div className={`${styles.PaginationItem} ${ isActive ? styles.active: ''}`} >
    <Link href={paginationUrl}>{children}</Link>
  </div>
}

function Pagination({pagination, baseUrl, filtersParams}) {
  return <div className={styles.Pagination}>
    {pagination.first_page && <PaginationItem pageNumber={pagination.first_page} baseUrl={baseUrl} filtersParams={filtersParams}> {'<<'} </PaginationItem>}
    {pagination.has_prev && <PaginationItem pageNumber={pagination.current - 1} baseUrl={baseUrl} filtersParams={filtersParams}> {'<'} </PaginationItem>}
    {pagination.pages.map(pageNumber => (
      <PaginationItem
        key={pageNumber}
        pageNumber={pageNumber}
        baseUrl={baseUrl}
        filtersParams={filtersParams}
        isActive={pageNumber === pagination.current}
      > { pageNumber } </PaginationItem>
    ))}
    {pagination.has_next && <PaginationItem pageNumber={pagination.current + 1} baseUrl={baseUrl} filtersParams={filtersParams}> {'>'} </PaginationItem>}
    {pagination.last_page && <PaginationItem pageNumber={pagination.last_page} baseUrl={baseUrl} filtersParams={filtersParams}> {'>>'} </PaginationItem>}
  </div>
}



function Products({ products, baseUrl, filtersParams }) {
  const { pagination }  = products;
  return (
    <>
      <div className={`${styles.Products}`}>
        {products && products.results.map(( product ) => <Product key={product.slug} product={product}/>)}
      </div>
      <Pagination pagination={pagination} baseUrl={baseUrl} filtersParams={filtersParams} />
    </>
  )
}

export default Products;