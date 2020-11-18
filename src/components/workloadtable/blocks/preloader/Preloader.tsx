import React from 'react';
import styles from './preloader.module.scss';

export const Preloader = (props: any) => {
  return (
    <div
      className={[
        styles.preloader,
        props.fetching ? styles.fetching : ''
      ].join(' ')}
    >
    </div>
  )
};
