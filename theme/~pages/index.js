import {useRouter} from "next/router";
import {useEffect} from "react";


export default function Home() {
  const router = useRouter()
  useEffect(() => {
    router.push({
      pathname: '[category-or-product]',
        query: {
          'category-or-product': 'winter',
        }
      })
  }, )

  return <p>Redirecting...</p>
}
