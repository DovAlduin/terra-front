import React from 'react';
import PropTypes from 'prop-types';
import {
  Table as BluePrintTable,
  TableLoadingOption,
} from '@blueprintjs/table';
import '@blueprintjs/table/lib/css/table.css';

import { getColumns } from './column';
import './styles.scss';

export const LOADING_ROWS_LEN = 100;
export const LOADING_COLS = Array.from({ length: 10 }, () => ({
  label: '',
}));
export const LOADING_DATA =
  Array.from({ length: LOADING_ROWS_LEN }, () =>
    Array.from({ length: LOADING_COLS.length }, () => ''));
const LOADING_OPTIONS = [
  TableLoadingOption.CELLS,
  TableLoadingOption.COLUMN_HEADERS,
  TableLoadingOption.ROW_HEADERS,
];
export class Table extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string.isRequired,
      display: PropTypes.bool,
      sortable: PropTypes.bool,
      editable: PropTypes.bool,
      format: PropTypes.shape({ type: PropTypes.string }),
    }).isRequired).isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
  };

  state = {
    sortedIndexMap: null,
  };

  get columns () {
    const { columns, loading } = this.props;
    return loading ? LOADING_COLS : columns;
  }

  get data () {
    const { data, loading } = this.props;
    return loading ? LOADING_DATA : data;
  }

  getCellData = (rowIndex, columnIndex) => {
    const { data } = this;
    const { sortedIndexMap: initialSortedIndexMap } = this.state;
    const sortedIndexMap = initialSortedIndexMap || data.map((_, k) => k);
    const cell = data[sortedIndexMap[rowIndex]][columnIndex];
    return this.formatCell(cell, columnIndex);
  };

  formatCell = (cell, columnIndex) => {
    const { columns } = this;
    const { format: { type } = {} } = columns[columnIndex];
    switch (type) {
      case 'date':
        return new Date(cell).toLocaleDateString();
      default:
        return cell;
    }
  }

  sortColumn = (columnIndex, order, type) => {
    const { data } = this.props;
    const sortedIndexMap = data.map((_, i) => i);
    sortedIndexMap.sort((a, b) => {
      const orderA = order === 'asc' ? a : b;
      const orderB = order === 'asc' ? b : a;
      return this.compare(data[orderA][columnIndex], data[orderB][columnIndex], type);
    });
    this.setState({ sortedIndexMap });
  };

  compare = (a, b, type) => {
    switch (type) {
      case 'number':
        return a - b;
      case 'date':
        return new Date(a) - new Date(b);
      default:
        return `${a}`.localeCompare(b);
    }
  }

  render () {
    const { locales, loading } = this.props;
    const { columns, data } = this;
    const cols = getColumns({ columns, locales })
      .map(col => col.getColumn(this.getCellData, this.sortColumn));

    return (
      <BluePrintTable
        className="component-table"
        numRows={data.length}
        loadingOptions={loading
          ? LOADING_OPTIONS
          : undefined}
      >
        {cols}
      </BluePrintTable>
    );
  }
}

export default Table;
