import '../styles/globals.css'
import {appWithTranslation} from "next-i18next";
import Layout from "../components/layout";

function App({ Component, pageProps }) {
  return <Layout {...pageProps}>
        <Component {...pageProps} />
    </Layout>
}

export default appWithTranslation(App);