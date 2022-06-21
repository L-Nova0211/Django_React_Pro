import { Component, useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { experimentalStyled } from '@material-ui/core';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import SubToolbar from './SubToolbar';

import store from 'src/store';
import { ROLE_G, ROLE_E, ROLE_A, ROLE_B, ROLE_C } from 'src/config';
import { connect } from 'react-redux';

const DashboardLayoutRoot = experimentalStyled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const DashboardLayoutWrapper = experimentalStyled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  })
);

const DashboardLayoutContainer = experimentalStyled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = experimentalStyled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const allowedUrl = {
  [ROLE_A]: ["/dev/dashboard", "/dev/account", "/dev/customers", "/dev/products", "/dev/product", ],
  [ROLE_B]: ["/dev/dashboard", "/dev/account", "/dev/products", "/dev/product", ],
  [ROLE_C]: ["/dev/account", "/dev/customers", "/dev/products", "/dev/product", ],
  [ROLE_E]: ["/dev/products", "/dev/product", "/dev/account", "/dev/myurls",  ],
}

class DevLayoutContainer extends Component {
  render() {
    const { 
      role, 
      is_busy, 
      is_authorized, 
      isMobileNavOpen, 
      setMobileNavOpen, 
      navigate,
      location,
    } = this.props;

    if (is_busy == true) {
      return ("Loading")
    } else {
      if (!is_authorized) {
        navigate('/login', {
          replace: true 
        });
        return ("")
      } else {

        if (allowedUrl[role].filter(url => location.pathname.includes(url)).length == 0) {
          navigate(allowedUrl[role][0], {
            replace: true 
          });
          return ("")
        } else {
          let home_url = "";
          if (role == ROLE_A) {
            home_url = "/dev/dashboard"
          } else {
            home_url = "/dev/products"
          }
          if (true || role != ROLE_E) {
            return (
              <DashboardLayoutRoot>
                <Navbar home_url={home_url} onMobileNavOpen={() => {
                  setMobileNavOpen(true)
                }}/>
                <Sidebar
                  onMobileClose={() => setMobileNavOpen(false)}
                  openMobile={isMobileNavOpen}
                />
                <DashboardLayoutWrapper>
                  <DashboardLayoutContainer>
                    <DashboardLayoutContent>
                      {/* <SubToolbar></SubToolbar> */}
                      <Outlet />
                    </DashboardLayoutContent>
                  </DashboardLayoutContainer>
                </DashboardLayoutWrapper>
              </DashboardLayoutRoot>
            );
          } else {
            return (
              <DashboardLayoutRoot>
                <Navbar home_url={home_url} onMobileNavOpen={() => setMobileNavOpen(true)} />
                {/* <DashboardLayoutWrapper> */}
                  <DashboardLayoutContainer>
                    <DashboardLayoutContent>
                      {/* <SubToolbar></SubToolbar> */}
                      <Outlet />
                    </DashboardLayoutContent>
                  </DashboardLayoutContainer>
                {/* </DashboardLayoutWrapper> */}
              </DashboardLayoutRoot>
            );
          }
        }
      }
    }
  }
};

const DevLayout = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  return (
    <DevLayoutContainer 
    navigate={navigate}
    location={location}
    isMobileNavOpen={isMobileNavOpen} 
    setMobileNavOpen={setMobileNavOpen} 
    {...props} 
    ></DevLayoutContainer>
  )
}

const mapStateToProps = (state) => ({
  role: state.auth.role,
  is_busy: state.auth.is_busy,
  is_authorized: state.auth.is_authorized,
})

export default connect(mapStateToProps)(DevLayout);
