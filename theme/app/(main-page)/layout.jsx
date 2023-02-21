import React from 'react';
import {DOMAIN} from "components/settings";
import TobBar from "components/Common/TopBar";
import styles from 'styles/Home.module.css';

export default async function RootLayout({ children }) {
  return (
    <html>
      <body>
        <main className={styles.main}>{children}</main>
      </body>
    </html>
  );
}