import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import { fade } from '@material-ui/core/styles/colorManipulator';
import SwapHoriz from '@material-ui/icons/SwapHoriz';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import JsonDataSection from './JsonDataSection';
import AzTable from './AzTable';

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired, 
};

const styles = theme => ({
  root: {
    width: '100%',
  },

  content: {
    marginTop: '100px',
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  title: {
    display: 'none',
    [theme.breakpoints.up('sm')]: {
      display: 'block',
    },
  },
  search: {
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      backgroundColor: fade(theme.palette.common.white, 0.25),
    },
    marginRight: theme.spacing.unit * 2,
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      marginLeft: theme.spacing.unit * 3,
      width: 'auto',
    },
  },
  searchIcon: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputRoot: {
    color: 'inherit',
    width: '100%',
  },
  inputInput: {
    paddingTop: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    paddingBottom: theme.spacing.unit,
    paddingLeft: theme.spacing.unit * 10,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: 200,
    },
  },
  sectionDesktop: {
    display: 'none',
    [theme.breakpoints.up('md')]: {
      display: 'flex',
    },
  },
  sectionMobile: {
    display: 'flex',
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
});

class FullWidthTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      selectedEventsCount:0,
      isRecord: true,
    };
    this.jsonViewerElement = React.createRef();
    this.azTableElement = React.createRef();
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleEnvMenuOpen = event => {
    this.setState({ anchorEl: event.currentTarget });
  };

  handleMenuClose = (event) => {
    const selectedValue = event.target.textContent;
    this.setState({ anchorEl: null, environment:selectedValue });
    this.handleMobileMenuClose();
  };

  handleMobileMenuOpen = event => {
    this.setState({ mobileMoreAnchorEl: event.currentTarget });
  };

  handleMobileMenuClose = () => {
    this.setState({ mobileMoreAnchorEl: null });
  };

  selectedDataChanged = (selectedEvents) => {
    this.setState({selectedEventsCount: selectedEvents.length});
    this.jsonViewerElement.current.jsonDataListChanged(selectedEvents);
  }

  removeSelection = (id) => {
    this.azTableElement.current.handleClick(this, id);
  }

  render() {
    const { anchorEl, mobileMoreAnchorEl } = this.state;
    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const { classes, theme } = this.props;

    const renderMenu = (
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMenuOpen}
        onClose={this.handleMenuClose}
      >
        <MenuItem onClick={this.handleMenuClose}>DEV</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>QA</MenuItem>
        <MenuItem onClick={this.handleMenuClose}>UAT</MenuItem>
      </Menu>
    );

    const renderMobileMenu = (
      <Menu
        anchorEl={mobileMoreAnchorEl}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={isMobileMenuOpen}
        onClose={this.handleMenuClose}
      >
       
        <MenuItem onClick={this.handleEnvMenuOpen}>
          <IconButton color="inherit">
            <SwapHoriz />
          </IconButton>
          <p>Profile</p>
        </MenuItem>
      </Menu>
    );

    const toggleRecord = () => {
      const {isRecord} = this.state;
      this.setState({isRecord: !isRecord});
    }

    return (
      <div className={classes.root}>
      <AppBar position="fixed">
          <Toolbar>
            <Typography className={classes.title} variant="h6" color="inherit" noWrap>
              Az EventGrid Viewer - Beta
            </Typography>
            <div className={classes.grow} />

            <IconButton
                onClick={toggleRecord}
                color="inherit"
              >
              {this.state.isRecord ? <Pause />: <PlayArrowIcon /> }
                
            </IconButton>

            {/*<Typography className={classes.title} variant="h6" color="inherit" noWrap>
              {this.state.environment}
            </Typography>
             <IconButton
                aria-owns={isMenuOpen ? 'material-appbar' : undefined}
                aria-haspopup="true"
                onClick={this.handleEnvMenuOpen}
                color="inherit"
              >
                <SwapHoriz />
              </IconButton> */}
          </Toolbar>
          <AppBar position="static" color="default">
          <Tabs
            value={this.state.value}
            onChange={this.handleChange}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
          >
            <Tab label="Event Log" />
            <Tab label={
              <Badge className={classes.padding} color="secondary" style={{padding:'0 10px'}} badgeContent={this.state.selectedEventsCount > 0 ? this.state.selectedEventsCount: ''}>
               JSON Viewer
              </Badge>
            }
            />
          </Tabs>
        </AppBar>
        </AppBar>
        {renderMenu}
        {renderMobileMenu}
                
        <SwipeableViews className={classes.content}
          axis={theme.direction === 'rtl' ? 'x-reverse' : 'x'}
          index={this.state.value}
          onChangeIndex={this.handleChangeIndex}
        >
          <TabContainer dir={theme.direction}>
            <AzTable ref={this.azTableElement} selectedDataChanged={this.selectedDataChanged} isRecord={this.state.isRecord}/>
            </TabContainer>
          <TabContainer dir={theme.direction}>
         
            <JsonDataSection ref={this.jsonViewerElement} removeSelection={this.removeSelection}/>

          </TabContainer>
        </SwipeableViews>
      </div>
    );
  }
}

FullWidthTabs.propTypes = {
  classes: PropTypes.object.isRequired,
  theme: PropTypes.object.isRequired,
};

export default withStyles(styles, { withTheme: true })(FullWidthTabs);