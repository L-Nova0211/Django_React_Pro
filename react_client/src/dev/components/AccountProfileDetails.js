import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  TextField
} from '@material-ui/core';
import { Component } from 'react';
import { connect } from 'react-redux';
import { updateAccount } from 'src/actions/authAction';
import { bindActionCreators } from 'redux';
import store from 'src/store';

class AccountProfileDetails extends Component {
  state = {
    nickname: '',
    email: '',
    amazon_email: '',
    amazon_password: '',
  }

  handleChange = (event) => {
    this.setState({
      ...this.state,
      [event.target.name]: event.target.value
    });
  };

  updateAccount = () => {
    updateAccount(store.dispatch, {
      nickname: this.state.nickname,
      email: this.state.email,
      amazon_email: this.state.amazon_email,
      amazon_password: this.state.amazon_password,
    })
  }

  componentDidMount() {
    let { user } = this.props;
    this.setState({
      ...this.state,
      nickname: user.nickname,
      email: user.email,
      amazon_email: user.amazon_email,
      amazon_password: user.amazon_password,
    })
  }

  render() {
    let {
      nickname, email, amazon_email, amazon_password,
    } = this.state;
    return (
      <form
        autoComplete="off"
        noValidate
      >
        <Card>
          <CardHeader
            subheader="The information can be edited"
            title="Profile"
          />
          <Divider />
          <CardContent>
            <Grid
              container
              spacing={3}
            >
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the nick name"
                  label="Nick name"
                  name="nickname"
                  onChange={this.handleChange}
                  required
                  value={nickname}
                  variant="outlined"
                />
              </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  label="Email Address"
                  name="email"
                  onChange={this.handleChange}
                  required
                  value={email}
                  variant="outlined"
                />
              </Grid>
            </Grid>
            
            <Grid
              container
              spacing={3}
            >
            <Grid
              item
              md={6}
              xs={12}
            >
              <TextField
                fullWidth
                label="Amazon Email"
                name="amazon_email"
                onChange={this.handleChange}
                required
                value={amazon_email}
                variant="outlined"
              />
            </Grid>
              <Grid
                item
                md={6}
                xs={12}
              >
                <TextField
                  fullWidth
                  helperText="Please specify the nick name"
                  label="Amazon password"
                  name="amazon_password"
                  type="password"
                  onChange={this.handleChange}
                  required
                  value={amazon_password}
                  variant="outlined"
                />
              </Grid>
            </Grid>
          </CardContent>
          <Divider />
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'flex-end',
              p: 2
            }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={this.updateAccount}
            >
              Save details
            </Button>
          </Box>
        </Card>
      </form>
    );
  }
};

const mapStateToProps = (state) => ({
  user: state.auth.user
})

export default connect(mapStateToProps)(AccountProfileDetails);
