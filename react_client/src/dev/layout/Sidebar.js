import { Component } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import PropTypes from 'prop-types';
import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  Hidden,
  List,
  Typography
} from '@material-ui/core';
import {
  AlertCircle as AlertCircleIcon,
  BarChart as BarChartIcon,
  Lock as LockIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  UserPlus as UserPlusIcon,
  Users as UsersIcon
} from 'react-feather';
import NavItem from './NavItem';
import { connect } from 'react-redux';

const items = [
  {
    href: '/dev/dashboard',
    icon: BarChartIcon,
    title: 'Dashboard',
    role: 7,
  },
  {
    href: '/dev/customers',
    icon: UsersIcon,
    title: 'Customers',
    role: 1023,
  },
  {
    href: '/dev/products',
    icon: ShoppingBagIcon,
    title: 'Products',
    role: 1,
  },
  {
    href: '/dev/myurls',
    icon: ShoppingBagIcon,
    title: 'MyUrls',
    role: 1,
  },
  {
    href: '/dev/account',
    icon: UserIcon,
    title: 'Account',
    role: 1,
  },
  {
    href: '/register',
    icon: UserPlusIcon,
    title: 'Register',
    role: 1,
  },
  {
    href: '/404',
    icon: AlertCircleIcon,
    title: 'Error',
    role: 7,
  }
];

class DashboardSidebar extends Component {
  render() {
    let { user, role, openMobile, onMobileClose } = this.props;
  
    const content = (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%'
        }}
      >
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            p: 2
          }}
        >
          {/* <Avatar
            component={RouterLink}
            src={'/static/images/avatars/avatar_6.png'}
            sx={{
              cursor: 'pointer',
              width: 64,
              height: 64
            }}
            to="/dev/account"
          /> */}
          <Typography
            color="textPrimary"
            variant="h5"
          >
            {user.nickname}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            {user.email}
          </Typography>
        </Box>
        <Divider />
        <Box sx={{ p: 2 }}>
          <List>
            {items.map((item) => {
              return ((item.role & role) === item.role) ? (
                <NavItem
                  href={item.href}
                  key={item.title}
                  title={item.title}
                  icon={item.icon}
                />
              ): ""
            })
          }
          </List>
        </Box>
        <Box sx={{ flexGrow: 1 }} />
      </Box>
    );
  
    return (
      <>
        <Hidden lgUp>
          <Drawer
            anchor="left"
            onClose={onMobileClose}
            open={openMobile}
            variant="temporary"
            PaperProps={{
              sx: {
                width: 256
              }
            }}
          >
            {content}
          </Drawer>
        </Hidden>
        <Hidden lgDown>
          <Drawer
            anchor="left"
            open
            variant="persistent"
            PaperProps={{
              sx: {
                width: 256,
                top: 64,
                height: 'calc(100% - 64px)'
              }
            }}
          >
            {content}
          </Drawer>
        </Hidden>
      </>
    );
  }
}

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => { },
  openMobile: false
};

const mapStateToProps = (state) => ({
  user: state.auth.user,
  role: state.auth.role
})

export default connect(mapStateToProps)(DashboardSidebar);
