import { Html, Head, Main, NextScript } from 'next/document'

export default function Document({menu}) {
  return (
    <Html>
      <Head />
      <body>
        <div className="container">
          <Main />
        </div>
        <NextScript />
      </body>
    </Html>
  )
}
