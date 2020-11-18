import * as React from 'react';
import 'react-day-picker/lib/style.css';

import {
  ELinkTypes,
  IRowCompType,
  IRowLinkType,
  ISort,
  ITable,
  ITableRows,
  queryValue,
  TTableCell
} from 'store/report';
import {TypeComp, TypeLink, TypeMulti, TypeString} from './cells';
import {GLOBAL} from 'globals/enums';

import styles from './table.module.scss';
import {HeadingCell} from './cells/HeadingCell';

const placeholder = (<div className={styles['empty-placeholder']}>{ GLOBAL.NO_DATA }</div>);

interface IState {
}

interface IWrapper extends ITable {
  transport: (key: string, val: queryValue) => void;
  sort: ISort | null;
}

export class TableWrapper extends React.Component <IWrapper, IState> {

  private static cellType(type: string, data: TTableCell) {
    switch (type) {
      case ELinkTypes.TYPE_LINK:
        const {link, title} = data as IRowLinkType;
        return (<TypeLink title={title} link={link}/>);
      case ELinkTypes.TYPE_STRING:
        const value = data as string;
        return (<TypeString value={value}/>);
      case ELinkTypes.TYPE_COMP:
        const DATA = data as IRowCompType;
        return (<TypeComp {...DATA} />);
      case ELinkTypes.TYPE_MULTIPLE:
        const values = data as IRowCompType;
        return (<TypeMulti {...values} />);
      default:
        return placeholder;
    }
  }


  public static defaultProps: IWrapper = {
    type: '',
    headers: [],
    data: [],
    sort: null,
    transport: () => null,
  };

  public render() {
    const {data, headers, sort, transport} = this.props;
    return (
      <>
        <table className={styles.TableWrapper}>
          <tbody>
            <tr className={styles.TableHeading}>
              {headers.map((cell, i) => (<th key={i}><HeadingCell order={sort && cell.key === sort.key ? sort.order : null} toggle={transport} sortKey={cell.key}>{cell.title}</HeadingCell></th>))}
            </tr>
            <tr className={styles.TableRowDivider}><td colSpan={99} /></tr>
            {this.generateBody(data)}
          </tbody>
        </table>
      </>
    );
  }

  private generateBody(rows: ITableRows[]) {
    return rows.length
      ? rows.map((row, i) => (<tr key={i} className={styles.TableRow}>{this.generateRow(row)}</tr>))
      : <tr><td colSpan={99}>{placeholder}</td></tr>
  }

  private generateRow(row: ITableRows) {
    return this.props.headers.map((HCell, i) => {
      return row[HCell.key] ? (<td key={i} className={styles.DataCell}>{TableWrapper.cellType(HCell.type, row[HCell.key])}</td>) : (<td key={i} style={{padding: '10px'}}>{placeholder}</td>);
    })
  }
}
