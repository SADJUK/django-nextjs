import React, {Fragment} from 'react';
import styles from './TopBar.module.scss'
import {useRouter} from "next/navigation";
// import {useTranslation} from "next-i18next";
import PropTypes from "prop-types";
import Link from "next/link";

function LanguageSelect() {
  const router = useRouter();
  console.log(router)
  return <div className={styles.LanguageSelect}>
    {
      // router.locales.map((locale) => {
      //   return <Link
      //     key={locale}
      //     href={router.asPath}
      //     locale={locale}
      //     className={locale === router.locale ? styles.activeLanguage: ''}
      //   >
      //     {locale}
      //   </Link>
      // })
    }
  </div>
}


function Categories({ categories, activeCategory }) {
  return <div className={styles.TopBar__Categories}>
    {
      categories.map((category) => (
          <Link
            key={category.slug}
            className={`${ (activeCategory && activeCategory.slug) === category.slug ? styles.activeCategory: ''}`}
            href={`/${category.slug}`}
          >
            {category.name}
          </Link>
      ))
    }
  </div>
}


export default async function TobBar({categories, activeCategory = null}) {
  // const { t } = useTranslation('top-bar');
  return <Fragment>
    {/*<span>{t('title')}</span>*/}
    <div className={styles.TopBar}>
      <Categories categories={categories} activeCategory={activeCategory}/>
      {/*<LanguageSelect/>*/}
    </div>
  </Fragment>
}

TobBar.propTypes = {
  'categories': PropTypes.array.isRequired,
  'active': PropTypes.bool
}