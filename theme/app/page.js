// "use client";
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {useRouter} from "next/navigation";
// import {useEffect} from "react";


export default function Home() {
  const router = useRouter()
  // router.push(url, as, options)
  //   useEffect(() => {
  //     router.push({
  //       pathname: '[category-or-product]',
  //       query: {
  //         'category-or-product': 'winter',
  //       }
  //     })
  // }, )

  return <p>Redirecting...</p>
}
