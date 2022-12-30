import React from 'react';
import TobBar from "../components/TopBar";

export default async function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  let domain = 'http://localhost:8000'
  let res = await fetch(`${domain}/api/catalog/categories`);
  let categories = await res.json();
  return (
    <html lang="en">
      <body>
        <TobBar categories={categories} ></TobBar>
      {children}
      </body>
    </html>
  );
}