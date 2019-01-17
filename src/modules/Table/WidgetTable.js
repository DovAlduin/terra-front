import React from 'react';
import PropTypes from 'prop-types';

import Table from './components/Table';
import Header from './components/Header';

export class WidgetTable extends React.Component {
  static propTypes = {
    columns: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.string]))
      .isRequired,
    data: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.string)).isRequired,
    title: PropTypes.string,
  };

  static defaultProps = {
    title: '',
  }

  constructor (props) {
    super(props);
    const { data } = props;

    this.state = {
      columns: [],
      data,
      dataFiltered: [],
      columnsFiltered: [],
    };
  }

  componentDidMount () {
    this.initColumns();
  }

  onHeaderChange = ({ event, index }) => {
    this.setState(state => {
      const columns = state.columns.map((col, i) => (
        (i !== index)
          ? col
          : {
            ...col,
            display: event.target.checked,
          }
      ));
      this.propsFiltered(columns);
      return {
        ...state,
        columns,
      };
    });
  }

  propsFiltered = columns => {
    const { data } = this.state;
    const { dataFiltered, columnsFiltered } = columns.reduce((acc, col, index) => (
      (col.display !== false)
        ? acc
        : {
          ...acc,
          columnsFiltered: [
            ...acc.columnsFiltered.filter((_, i) => (i + acc.count) !== index),
          ],
          dataFiltered: [
            ...acc.dataFiltered.map(item => item.filter((_, i) => (i + acc.count) !== index)),
          ],
          count: acc.count + 1,
        }
    ), { dataFiltered: data, columnsFiltered: columns, count: 0 });
    this.setState({ dataFiltered, columnsFiltered });
  }

  initColumns = () => {
    const { columns: allColumns } = this.props;
    const columns = allColumns.map(col =>
      ((typeof col !== 'string')
        ? { display: true, ...col }
        : { value: col, sortable: true, display: true }));
    this.setState({ columns });
    this.propsFiltered(columns);
  }


  render () {
    const { columns, dataFiltered, columnsFiltered } = this.state;
    const { title } = this.props;

    return (
      <div className="widget-table">
        <Header title={title} columns={columns} onChange={this.onHeaderChange} />
        <Table columns={columnsFiltered} data={dataFiltered} />
      </div>
    );
  }
}

export default WidgetTable;