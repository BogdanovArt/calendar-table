import * as React from 'react';
import {getFlatColumns} from 'utils';

import {IEntityOrder, IRowHeader, IRowReference, ITableData, IUserHeader, IProjectHeader, ITask,} from '../../interfaces';
import {Entities, RowActions} from '../../enums';
import {TableCell, TableRow} from '../../blocks';
import styles from '../../workload.module.scss';
import { CellTypes } from './enums';

interface ITableProps extends ITableData {
  expandHandler: ExpandActions;
  weekClickHandler: (week?: number) => void;
  activeRef: React.RefObject<HTMLDivElement> | undefined;
  active: string;
}

type ExpandActions = (
  entity: Entities,
  target: string,
  ids: IEntityOrder,
  type: string,
  index: number
) => void;

type RenderRowArguments = {
  rows: Array<IRowHeader>;
  reference: IRowReference;
  level: number;
  ids?: IEntityOrder;
  parentID?: string;
}

class TableBody extends React.Component<ITableProps, {}> {

  static defaultProps: ITableProps = {
    headers: [],
    columns: {},
    activeRef: undefined,
    active: '',
    expandHandler: () => null,
    weekClickHandler: () => null,
  }

  renderTopLevel(level = 0): JSX.Element[][] {
    const { headers, columns } = this.props;
    const rowReference: IRowReference = getFlatColumns({
      columns: JSON.parse(JSON.stringify(columns)),
      lastLevel: 2
    });
    return this.renderRows({ 
      rows: headers,
      reference: rowReference,
      level: 0
    });
  }

  renderRows({
    rows,
    reference,
    level = 0,
    ids = {},
    parentID,
  }: RenderRowArguments): JSX.Element[][] {
    return rows.map((row: IRowHeader, index: number) => {
      const keyRef = row.entity === Entities.TASK
        ? index
        : row.key;
      const id = parentID ? `${parentID}-${keyRef}` : `${keyRef.toString()}`;
      const newIDs: IEntityOrder = row.expandable
        ? { ...ids, ...{ [row.entity || 'table']: row.key }}
        : { ...ids };

      const action = (): void | '' => row.expandable
        && this.props.expandHandler(
          row.entity || Entities.USER,
          row.expandable,
          newIDs,
          (row.items && row.items.length) ? RowActions.REMOVE : RowActions.ADD,
          index
        );

      const headerCell = this.renderHeaderCell(row, level, action);
      let subRows: JSX.Element[] = [];
      if (row.items && row.items.length) {
        subRows = this.renderRows({
          rows: row.items,
          reference,
          level: level + 1,
          ids: newIDs,
          parentID: id
        }).flat();
      }
      return [
        <TableRow
          key={`${parentID}-${index}` || row.toString()}
          expandable={row.expandable}
          expanded={row.items && row.items.length}
          styles={styles}
        >
          { this.renderRowCells(headerCell, reference, id) }
        </TableRow>,
        ...subRows
      ];
    });
  }

  renderHeaderCell(
    row: IRowHeader,
    level: number,
    action: () => void,
  ): JSX.Element {
    return (
      <TableCell
        key={`level-${level}`}
        styles={styles}
        className={[
          styles['table__cell'],
          styles[`level-${level}`],
          styles['table__cell--heading'],
          row.key === 'heading' ? styles['table__cell--col-heading'] : '',
          row.expandable ? styles['table__cell--expandable'] : '',
          (row.items && row.items.length) ? styles['table__cell--expanded'] : ''
        ].join(' ')}
        action={action}
      >
        <div className={styles['table__cell--wrapper']}>
          { row.title }
        </div>
      </TableCell>
    )
  }

  getColorClass(def?: string | number) {
    if (def) {
      switch (true) {
        case def >= 111:
          return 'overloaded';
        case def >= 96:
          return 'no-chance';
        case def >= 86:
          return 'all-is-lost';        
        case def >= 76:
          return 'very-bad';        
        case def >= 66:
          return 'bad';        
        case def >= 56:
          return 'attention';
        case def >= 46:
          return 'about-to-foul';
        case def >= 36:
          return 'so-so';
        case def >= 26:
          return 'normal';
        case def >= 16:
          return 'good';
        case def >= 6:
          return 'nearly-perfect';
        default:
          return 'perfection';
      }
    }
    return '';
  }

  renderRowCells(
    header: JSX.Element,
    rowRef: IRowReference,
    keyRef: string | number,
  ): JSX.Element[] {
    const weeks = Object.keys(rowRef).sort();
    const rowCells = weeks.map((key: string, index: number) => {
      let cell = rowRef[key][keyRef];
      const isHeading = keyRef === 'heading';
      const className = this.getColorClass(cell ? cell.deficiency : undefined);
      const activeWeek = key === this.props.active;
      const action = (): void => this.props.weekClickHandler(cell.index);
      return (
        <TableCell
          key={`${keyRef}-${index}`}
          styles={styles}
          ref={(activeWeek && isHeading) ? this.props.activeRef : undefined}
          className={[
            activeWeek ? styles['table__cell--col-active'] : '',
            isHeading ? styles['table__cell--col-heading'] : '',
            styles[className]
          ].join(' ')}
          action={isHeading && action}
        >
          <div className={styles['table__cell--wrapper']}  title={cell ? cell.title : '--'}>
            { this.renderCell(cell, cell ? cell.type : '') }    
          </div>
          { activeWeek ? <div className={styles['table__cell--col-pseudo']} /> : null }
        </TableCell>);
    });
    return [header, ...rowCells];
  }

  renderCell(cell: IUserHeader | IProjectHeader | ITask | undefined, type?: string): JSX.Element | string {
    if (cell) {
      switch(type) {
        case CellTypes.HEADING:
          return (
            <div className={styles['col--heading']}>
             <span className={styles['col--index']}>{ cell.index }</span>
             <div className={styles['col--title']}>{ cell.title }</div>
            </div>
          );
        case CellTypes.TASK:
          return (
            <div className={styles['type__task']}>
             <a href={(cell as ITask).link} target="_blank" className={styles[this.getStatusClass((cell as ITask).status)]}>
              <span className={styles['task--title']}>{ cell.title }</span>
             </a>
             <div className={styles['type__task--info']}>
              <span>#{ (cell as ITask).id }</span>
              <span>{ (cell as ITask).time }</span>
             </div>
            </div>
          );
        default:
          return cell.title;
      }
    }
    return '--';
  }
  
  getStatusClass = (status?: number): string => {
    switch (status) {
      case 1:
        return 'new';
      case 2:
        return 'going';
      case 3:
        return 'late';
      case 4:
        return 'waiting';
      default:
        return 'finished';
    }
  }

  render(): JSX.Element {
    return (
      <div className={styles.table}>
        { this.renderTopLevel() }
      </div>
    );
  }
}

export default TableBody;
