"use client";
import styles from "../category.module.scss";
import {useRouter} from "next/navigation";
// import {useTranslation} from "next-i18next";
import {useState} from "react";

function Filter({filter, activeFilters,  setActiveFilters}) {
  return <div>
    <div className={styles.Filter__name}>{ filter.name }</div>
    {
      filter.options.map((option) => {
        let optionName;
        if ( filter.checked ) {
          if ( option.checked ) {
            optionName = option.name;
          } else {
            optionName = `${option.name} (+${ option.count })`;
          }
        } else {
            optionName = `${option.name} (${ option.count })`
        }
        return <div className={styles.Filter__option} key={option.slug}>
          <label htmlFor={option.slug}>{optionName}</label>
          <input type="checkbox" defaultChecked={option.checked} name={option.slug} onClick={(event) => {
            const optionIndex = activeFilters[filter.slug].indexOf(option.slug);
            if ( event.target.checked && optionIndex === -1 ) {
              activeFilters[filter.slug].push(option.slug);
              setActiveFilters({...activeFilters});
            } else if (!event.target.checked && optionIndex !== -1) {
              activeFilters[filter.slug].splice(optionIndex, 1);
              setActiveFilters({...activeFilters});
            }
          }}/>
        </div>;
      })
    }
  </div>
}



export default function Filters({ filters, category }) {
  const router = useRouter();
  const handleSubmitFilters = (event, activeFilters) => {
    event.preventDefault();
    let urlParts = [category.slug];
    let getParams = {};
    let key, value;
    for ([key, value] of Object.entries(activeFilters)) {
      if ( value.length === 1 ) {
        urlParts.push(`${key}=${value.join(',')}`);
      } else if ( value.length > 1 ) {
        getParams[key] = value.join(',');
      }
    }
    let url = `/${urlParts.join('/')}`;
    if ( Object.keys(getParams).length ) {
      let prefix = '?';
      for ([key, value] of Object.entries(getParams)) {
        url += `${prefix}${key}=${value}`;
        prefix = '&';
      }
    }
    router.push(url);
  }
  let initialActiveFilters = {};
  filters.map((filter) => {
    initialActiveFilters[filter.slug] = [];
    if ( filter.checked ) {
      filter.options.map((option) => {
        if ( option.checked ) {
          initialActiveFilters[filter.slug].push(option.slug);
        }
      })
    }
  });
  let [activeFilters, setActiveFilters] = useState(initialActiveFilters);
  // const { t } = useTranslation('category-filters');
  return <>
    <form className={styles.Filters} onSubmit={(event) => handleSubmitFilters(event, activeFilters)}>
      { filters.map((filter) => <Filter
          key={filter.slug}
          filter={filter}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />) }
      <button type={"submit"}>{'category-filters:apply-filters-button'}</button>
    </form>
  </>
}
