import { Component } from 'react';
import {
    Avatar,
    Box,
    Card,
    CardContent,
    Grid,
    Typography
  } from '@material-ui/core';
  import { green } from '@material-ui/core/colors';
  import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
  import PeopleIcon from '@material-ui/icons/PeopleOutlined';
  import { useNavigate } from 'react-router-dom';
  import { connect } from 'react-redux';
  import { doGetAllUsers } from 'src/actions/managerActions';

  import store from 'src/store';
  
  class TotalCustomers extends Component {
    
    componentDidMount() {
        if (this.props.users.length == 0) {
            doGetAllUsers(store.dispatch)
        }
    }

    render() {
        const { navigate, users } = this.props;
        const count_users = users.length;

        return (
            <Card>
            <CardContent>
                <Grid
                container
                spacing={3}
                sx={{ justifyContent: 'space-between' }}
                >
                <Grid item>
                    <Typography
                    color="textSecondary"
                    gutterBottom
                    variant="h6"
                    >
                    TOTAL USERS
                    </Typography>
                    <Typography
                    color="textPrimary"
                    variant="h3"
                    >
                    { count_users }
                    </Typography>
                </Grid>
                <Grid item>
                    <Avatar
                    sx={{
                        backgroundColor: green[600],
                        height: 56,
                        width: 56
                    }}
                    >
                    <PeopleIcon 
                        cursor="pointer"
                        onClick={() => {
                            navigate('/dev/customers', { replace: true });
                        }}
                    />
                    </Avatar>
                </Grid>
                </Grid>
                <Box
                sx={{
                    alignItems: 'center',
                    display: 'flex',
                    pt: 2
                }}
                >
                <ArrowUpwardIcon sx={{ color: green[900] }} />
                <Typography
                    variant="body2"
                    sx={{
                    color: green[900],
                    mr: 1
                    }}
                >
                    16%
                </Typography>
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    Since last month
                </Typography>
                </Box>
            </CardContent>
            </Card>
        );
    }
}

const TotalCustomersConst = ({users, ...rest}) => {
    const navigate = useNavigate();

    return (
        <TotalCustomers {...rest} users={users} navigate={navigate}></TotalCustomers>
    )
}

const mapStateToProps = (state) => ({
    users: state.manager.users
})

export default connect(mapStateToProps)(TotalCustomersConst);
  