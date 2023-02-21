import React from "react";

export default function Product({ product }) {
   return <>
    <div className="content">
      <h1>{ product.name }</h1>
    </div>
   </>
}