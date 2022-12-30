import Link from "next/link";
import Image from "next/image";
import styles from './products.module.scss';
import placeholder200x200 from '../../styles/placeholders/200x200.png';
import { useRouter } from "next/navigation";

function Product({ product }) {
  return <div className={`${ styles.Product }`}>
        <Image
          src={placeholder200x200}
          alt={product.name}>

        </Image>
        <div className="product__name">
          <Link href={`/${product.slug}`} prefetch={false}>{product.name}</Link>
        </div>
  </div>
}

function Products({ products  }) {
  // const router = useRouter();
  return (
      <div className={`${styles.Products}`}>
        {products.results.map(( product ) => <Product key={product.id} product={product}/>)}
      </div>
  )
}

export default Products;