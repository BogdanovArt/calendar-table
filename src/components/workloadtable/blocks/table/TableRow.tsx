import React from 'react';

export const TableRow = (props: any) => {
  return (
    <div
      className={[
        props.styles['table__row'],
        props.className
      ].join(' ')}
    >
      {props.children}
    </div>
  )
};
