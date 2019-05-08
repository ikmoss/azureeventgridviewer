import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Chip from '@material-ui/core/Chip';
import DeleteIcon from '@material-ui/icons/Delete';
import { lighten } from '@material-ui/core/styles/colorManipulator';
import {HubConnectionBuilder} from '@aspnet/signalr';

let counter = 0;
function createData(eventId, eventType, subject, data, topic, time) {
  counter += 1;
  return { id: counter, eventId, eventType, subject, data, topic, time };
}

function desc(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function stableSort(array, cmp) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = cmp(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map(el => el[0]);
}

function getSorting(order, orderBy) {
  return order === 'desc' ? (a, b) => desc(a, b, orderBy) : (a, b) => -desc(a, b, orderBy);
}

const rows = [
  { id: 'Topic', numeric: false, disablePadding: true, label: 'Topic' },
  { id: 'Type', numeric: false, disablePadding: false, label: 'Event Type' },
  { id: 'Subject', numeric: false, disablePadding: false, label: 'Subject' },
  { id: 'Time', numeric: false, disablePadding: false, label: 'Time' },
];

class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount } = this.props;

    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={numSelected === rowCount}
              onChange={onSelectAllClick}
            />
          </TableCell>
          {rows.map(
            row => (
              <TableCell
                key={row.id}
                align={row.numeric ? 'right' : 'left'}
                padding={row.disablePadding ? 'none' : 'default'}
                sortDirection={orderBy === row.id ? order : false}
              >
                <Tooltip
                  title="Sort"
                  placement={row.numeric ? 'bottom-end' : 'bottom-start'}
                  enterDelay={300}
                >
                  <TableSortLabel
                    active={orderBy === row.id}
                    direction={order}
                    onClick={this.createSortHandler(row.id)}
                  >
                    {row.label}
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
            ),
            this,
          )}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    
  },
  actions: {
    color: theme.palette.text.secondary,
    flex: '1 1 auto'
  },
  filters: {
    flex: '1 1 100%',
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection:'row-reverse',
  },
  title: {
    display: 'flex',
    flex: '0 0 auto',
    alignItems:'center',
    flexDirection:'row',
  },
});

let EnhancedTableToolbar = props => {
  const { numSelected, classes, filters, onFilterChange, clearData } = props;
  const onTypeDelete = () => {
    filters.typeFilter = null;
    onFilterChange(filters);
  }

  const onTopicDelete = () => {
    filters.topicFilter = null;
    onFilterChange(filters);
  }

  const onSubjectDelete = () => {
    filters.subjectFilter = null;
    onFilterChange(filters);
  }

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
        {numSelected > 0 ? (
      <div className={classes.title}>

          <Typography color="inherit" variant="subtitle1">
            {numSelected} selected
          </Typography>
      </div>

        ) : (
      <div className={classes.title}>
          
          <Typography>
            Event Grid Event LIst
          </Typography>
          <IconButton onClick={clearData} >
           <DeleteIcon />
         </IconButton>
         </div>
        )} 
     
      <div className={classes.filters}>
        {filters.subjectFilter ? <Chip  onDelete={onSubjectDelete} label={filters.subjectFilter} className={classes.chip}/>: ""}
        {filters.typeFilter ? <Chip  onDelete={onTypeDelete} label={filters.typeFilter} className={classes.chip}/>: ""}
        {filters.topicFilter ? <Chip onDelete={onTopicDelete} label={filters.topicFilter} className={classes.chip}/>: ""}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
  },
  table: {
    minWidth: 1020,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  state = {
    order: 'asc',
    orderBy: 'calories',
    selected: [],
    data: [],
    page: 0,
    rowsPerPage: 15,
    filters: {
      topicFilter: null,
      typeFilter: null,
      subjectFilter: null
    }
  };

  componentDidMount() {
    const hubConnection = new HubConnectionBuilder()
    .withUrl("/gridEventHub")
    .build();

    this.setState({hubConnection}, () => {
        this.state.hubConnection
        .start()
        .then(() => console.log('Connection started!'))
        .catch(err => console.log('Error while establishing connection :('));

        this.state.hubConnection.on('gridupdate', (id, eventType, subject, eventTime, jsonData, topic) => {
            if (!this.props.isRecord)
              return;

            const topicTrimmed = topic.substr(topic.lastIndexOf('/') + 1);
            const jsonObj = JSON.parse(jsonData);
            const dataItem = createData(id, eventType, subject, jsonObj, topicTrimmed, eventTime);
            const data = [dataItem, ...this.state.data];
            this.setState({ data });
        });
    });
}


  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = event => {
    // if (event.target.checked) {
    //   this.setState(state => ({ selected: state.data.map(n => n.id) }));
    //   this.props.selectedDataChanged(this.state.data);
    //   return;
    // }
    this.props.selectedDataChanged([]);
    this.setState({ selected: [] });
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }
    const selectedData = this.state.data.filter(d => newSelected.includes(d.id));
    this.props.selectedDataChanged(selectedData);
    this.setState({ selected: newSelected }); 
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  onEventTypeClick = event => {
    event.preventDefault();
    const typeFilter = event.target.textContent;
    const newFilters = this.cloneFilters();
    Object.assign(newFilters, {typeFilter});
    this.setState({filters: newFilters});
    event.stopPropagation();
  }

  onTopicClick = event => {
    event.preventDefault();
    const topicFilter = event.target.textContent;
    const newFilters = this.cloneFilters();
    Object.assign(newFilters, {topicFilter});
    this.setState({filters: newFilters});
    event.stopPropagation();
  }

  onSubjectClick = event => {
    event.preventDefault();
    const subjectFilter = event.target.textContent;
    const newFilters = this.cloneFilters();
    Object.assign(newFilters, {subjectFilter});
    this.setState({filters: newFilters});
    event.stopPropagation();
  }

  cloneFilters = () => {
    const {topicFilter, typeFilter, subjectFilter} = this.state.filters;
    const newFilters = {
      topicFilter: topicFilter,
      typeFilter: typeFilter,
      subjectFilter: subjectFilter
    };
    return newFilters;
  }

  onFilterChange = (newFilters) => {
    const filters = {
      topicFilter: newFilters.topicFilter,
      typeFilter: newFilters.typeFilter,
      subjectFilter: newFilters.subjectFilter
    };
    this.setState({filters});
  }

  clearData = () => {
    this.setState({
      data:[], 
      selected:[], 
      filters: 
      {
        topicFilter: null,
        typeFilter: null,
        subjectFilter: null
      }
    });
    this.props.selectedDataChanged([]);
  }

  render() {
    const { classes } = this.props;
    const { data, order, orderBy, selected, rowsPerPage, page, filters } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.length - page * rowsPerPage);

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar 
          numSelected={selected.length} 
          filters={filters} 
          onFilterChange={this.onFilterChange}
          clearData={this.clearData}
          />
        <div className={classes.tableWrapper}>
          <Table className={classes.table} aria-labelledby="tableTitle">
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={data.length}
            />
            <TableBody>
              {stableSort(data, getSorting(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map(n => {
                  const isSelected = this.isSelected(n.id);
                  const {typeFilter, subjectFilter, topicFilter} = this.state.filters;

                  let isHidden = typeFilter ? typeFilter != n.eventType : false;
                  isHidden = isHidden ? true: topicFilter ? topicFilter != n.topic : false;
                  isHidden = isHidden ? true: subjectFilter ? subjectFilter != n.subject : false;
                  console.log(isHidden);
                  return (
                    <TableRow
                      hover
                      onClick={event => this.handleClick(event, n.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={-1}
                      key={n.id}
                      selected={isSelected}
                      style={isHidden ? {display:'none'}: {}}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox checked={isSelected} />
                      </TableCell>
                      <TableCell onClick={this.onTopicClick} component="th" scope="row" padding="none">
                        {n.topic}
                      </TableCell>
                      <TableCell onClick={this.onEventTypeClick}>{n.eventType}</TableCell>
                      <TableCell onClick={this.onSubjectClick}>{n.subject}</TableCell>
                      <TableCell>{n.time}</TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination
          rowsPerPageOptions={[15, 30, 100, 200]}
          component="div"
          count={data.length}
          rowsPerPage={rowsPerPage}
          page={page}
          backIconButtonProps={{
            'aria-label': 'Previous Page',
          }}
          nextIconButtonProps={{
            'aria-label': 'Next Page',
          }}
          onChangePage={this.handleChangePage}
          onChangeRowsPerPage={this.handleChangeRowsPerPage}
        />
      </Paper>
    );
  }
}

EnhancedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EnhancedTable);