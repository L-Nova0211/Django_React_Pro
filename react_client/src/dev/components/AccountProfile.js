import moment from 'moment';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Divider,
  Typography,
  Grid
} from '@material-ui/core';

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};

const AccountProfile = (props) => (
  <Card {...props}>
    <CardContent>
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Avatar
          src={user.avatar}
          sx={{
            height: 100,
            width: 100
          }}
        />
        <Typography
          color="textPrimary"
          gutterBottom
          variant="h3"
        >
          {user.name}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {`${user.city} ${user.country}`}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body1"
        >
          {`${moment().format('hh:mm A')} ${user.timezone}`}
        </Typography>
      </Box>
    </CardContent>
    <Divider />
    <CardActions>
        <Grid container>
            <Grid
                item
                lg={2}
                md={3}
                sm={4}
                xs={6}
                style={{padding: "4px", textAlign: "center"}}
            >
                <Avatar
                    src={user.avatar}
                    sx={{
                    height: "auto",
                    width: "auto"
                    }}
                />
            </Grid>
            <Grid
                item
                lg={2}
                md={3}
                sm={4}
                xs={6}
                style={{padding: "4px", textAlign: "center"}}
            >
                <Avatar
                    src={user.avatar}
                    sx={{
                    height: "auto",
                    width: "auto"
                    }}
                />
            </Grid>
        </Grid>
        
        <Grid >
            <Button
                color="primary"
                fullWidth
                variant="text"
            >
                More Avatars
            </Button>
        </Grid>
    </CardActions>
  </Card>
);

export default AccountProfile;
