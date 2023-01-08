import React from 'react';
import TobBar from "../components/TopBar";
import { dir } from 'i18next'
import {useRouter} from "next/navigation";

const languages = ['uk', 'en']

export default async function RootLayout({
  children,
}) {
  let domain = 'http://localhost:8000'
  const router = useRouter();
  let res = await fetch(`${domain}/api/catalog/categories`);
  let categories = await res.json();
  
  return (
    <html lang={language} dir={dir(language)}>
      <body>
        <TobBar categories={categories} ></TobBar>
      {children}
      </body>
    </html>
  );
}