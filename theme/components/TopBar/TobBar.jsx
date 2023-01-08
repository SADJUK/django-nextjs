"use client";
import React, {Fragment} from 'react';
import styles from './TopBar.module.scss'
import Link from "next/link";
import {useRouter} from "next/router";
import {useTranslation} from "next-i18next";
import PropTypes from "prop-types";

function LanguageSelect() {
  const router = useRouter()
  return <div className={styles.LanguageSelect}>
    {
      router.locales.map((locale) => {
        return <Link
          key={locale}
          href={router.asPath}
          locale={locale}
          className={locale === router.locale ? styles.activeLanguage: ''}
        >
          {locale}
        </Link>
      })
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


export default function TobBar({categories, activeCategory = null}) {
  const { t } = useTranslation('top-bar');
  return <Fragment>
    <span>{t('title')}</span>
    <div className={styles.TopBar}>
      <Categories categories={categories} activeCategory={activeCategory}/>
      <LanguageSelect/>
    </div>
  </Fragment>
}

TobBar.propTypes = {
  'categories': PropTypes.array.isRequired,
  'active': PropTypes.bool
}