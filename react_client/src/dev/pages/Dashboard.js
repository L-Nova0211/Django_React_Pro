import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import Budget from 'src/dev/components/Budget';
import TotalCustomers from 'src/dev/components/TotalCustomers';
import Categories from 'src/dev/components/Categories';

const Dashboard = () => (
  <>
    <Helmet>
      <title>Dashboard | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3,
        display: "grid"
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={6}
            sm={12}
            xl={6}
            xs={12}
          >
            <Budget />
          </Grid>
          <Grid
            item
            lg={6}
            sm={12}
            xl={6}
            xs={12}
          >
            <TotalCustomers />
          </Grid>
          <Grid
            item
            lg={12}
            sm={12}
            xl={12}
            xs={12}
          >
            <Categories />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>
);

export default Dashboard;
