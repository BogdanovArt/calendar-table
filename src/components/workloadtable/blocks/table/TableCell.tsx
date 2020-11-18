import React from 'react';

export const TableCell = React.forwardRef((props: any, ref?: React.Ref<HTMLDivElement>) => {
  return (
    <div
      className={[
        props.styles.table__cell,
        props.className
      ].join(' ')}
      ref={ref}
      onClick={props.action ? props.action : null}
    >
      <div className={props.styles['content']}>
        {props.children}
      </div>
    </div>
  )
});
