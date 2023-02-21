import '../styles/globals.css'
import {appWithTranslation} from "next-i18next";
import Layout from "../components/layout";
import {getHeaderData} from "../components/utils";

function App({ Component, pageProps, categories }) {
  return <Layout {...pageProps} categories={categories}>
        <Component {...pageProps} />
    </Layout>
}

App.getInitialProps = async (context) => {
  const header = await getHeaderData(context);
  return {
    ...header
  }
};

export default appWithTranslation(App);