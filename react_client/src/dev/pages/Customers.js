import { Component } from 'react';
import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/dev/components/CustomerListResults';
// import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import customers from 'src/__mocks__/customers';
import { connect } from 'react-redux'

import { doGetAllUsers } from 'src/actions/managerActions';
import store from 'src/store';

class CustomerList extends Component {
  componentDidMount() {
    setTimeout(() => {
      if (this.props.users.length == 0) {
        doGetAllUsers(store.dispatch);
      }
    }, 500);
  }
  render() {
    const { loading, users } = this.props;
    return (
      <>
        <Helmet>
          <title>Customers | Material Kit</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3
          }}
        >
          <Container maxWidth={false}>
            {/* <CustomerListToolbar /> */}
            { loading ? "Loading" :
              <Box sx={{ pt: 3 }}>
                <CustomerListResults customers={users} />
              </Box>
            }
          </Container>
        </Box>
      </>
    );
  }
} 

const mapStateToProps = (state) => ({
  users: state.manager.users,
  loading: state.manager.loading,
})

export default connect(mapStateToProps)(CustomerList);
