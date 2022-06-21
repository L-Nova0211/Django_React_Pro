import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  AppBar,
  Badge,
  Box,
  Hidden,
  IconButton,
  Toolbar
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import InputIcon from '@material-ui/icons/Input';
import { Logout } from '@material-ui/icons';
import Logo from './Logo';

import { doLogout } from 'src/actions/authAction';
import store from 'src/store';

const Navbar = ({ onMobileNavOpen, home_url, ...rest }) => {
  const [notifications] = useState([]);
  const navigate = useNavigate();
  return (
    <AppBar
      elevation={0}
      {...rest}
    >
      <Toolbar>
        <Hidden lgDown>
          <RouterLink to={ home_url }>
            <Logo />
          </RouterLink>
        </Hidden>
        <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>
        <Box sx={{ flexGrow: 1 }} />
        {/* <Hidden lgDown> */}
          <IconButton color="inherit">
            <Badge
              badgeContent={notifications.length}
              color="primary"
              variant="dot"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>
          <IconButton color="inherit" onClick={() => doLogout(store.dispatch, navigate)}>
            <Logout />
          </IconButton>
        {/* </Hidden> */}
        {/* <Hidden lgUp>
          <IconButton
            color="inherit"
            onClick={onMobileNavOpen}
          >
            <MenuIcon />
          </IconButton>
        </Hidden> */}
      </Toolbar>
    </AppBar>
  );
};

Navbar.propTypes = {
  onMobileNavOpen: PropTypes.func
};

export default Navbar;
