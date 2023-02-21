import React from 'react';
import {DOMAIN} from "components/settings";
import TobBar from "components/Common/TopBar";
import styles from 'styles/Home.module.css';

export default async function RootLayout({ children }) {
  let res = await fetch(`${DOMAIN}/api/catalog/categories`);
  let categories = await res.json();
  return (
    <html>
      <body>
        <TobBar categories={categories} ></TobBar>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}