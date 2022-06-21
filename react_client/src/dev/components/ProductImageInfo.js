import { Component } from 'react';
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
  Grid,
  TextField
} from '@material-ui/core';
import "./ProductImageInfo.css";

const user = {
  avatar: '/static/images/avatars/avatar_6.png',
  city: 'Los Angeles',
  country: 'USA',
  jobTitle: 'Senior Developer',
  name: 'Katarina Smith',
  timezone: 'GTM-7'
};


class ProductImageInfo extends Component {
    state = {
      activeImage: 0
    }
    render() {
        const { product } = this.props;
        let { activeImage } = this.state;
        
        let {
          title,
          imgurls,
          url,
          asin,
        } = product;
        let imageurls = [];
        if (imgurls.length > 0) {
          imageurls = imgurls.split(',');
        }
        return (
            <Card >
              <CardContent>
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  { imageurls.length > 0 && imageurls[activeImage] != "" ? 
                  <Avatar
                    classes={{
                      img: "main-image",
                    }}
                    variant={"square"}
                    src={imageurls.length > 0 ? imageurls[activeImage] : ""}
                    sx={{
                      height: 300,
                      width: 300,
                      'object-fit': "scale-down",
                    }}
                  /> : "No Image to show" }
                  <Typography
                    color="textPrimary"
                    gutterBottom
                    variant="h3"
                  >
                    {title}
                  </Typography>
                </Box>
              </CardContent>
              <Divider />
              {/* <CardActions> */}
                  <Grid container>
                    { imageurls.map( (url, id) => url.includes('http') ? (
                      <Grid
                        key={id}
                        item
                        lg={2}
                        md={3}
                        sm={4}
                        xs={6}
                        style={{padding: "4px", textAlign: "center"}}
                      >
                          <Avatar
                              src={url}
                              sx={{
                              height: "auto",
                              width: "auto"
                              }}
                              variant={"square"}
                              onClick={() => this.setState({activeImage: id})}
                          />
                      </Grid>
                    ) : "")}
                  </Grid>
                  <Grid>
                      <Button
                          color="primary"
                          fullWidth
                          variant="text"
                      >
                          <a href={`https://www.amazon.co.jp/-/jp/dp/${asin}`} target="_blank">Go to Amazon</a>
                      </Button>
                  </Grid>
              {/* </CardActions> */}
            </Card>
        );
    }
} 

export default ProductImageInfo;
