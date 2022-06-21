import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Pagination,
  Fab,
} from '@material-ui/core';

import { Add as AddIcon } from '@material-ui/icons/Add';
import ProductListToolbar from 'src/dev/components/ProductListToolbar';
import ProductCard from 'src/dev/components/ProductCard';
import { Component } from 'react';
import { connect } from 'react-redux';
import store from 'src/store';
import { doGetAllProducts } from 'src/actions/productActions';
import RequestUrl from 'src/dev/components/RequestUrl';
import { ROLE_A } from 'src/config';

class Products extends Component {
  state = {
    page: 1,
    cntperpage: 12,
    product_name: "",
    price_from: 0,
    price_to: 9999999,
    seller: "",
    shipper: "",
    stocks: 0,
  }
  componentDidMount() {
    setTimeout(() => {
      if (this.props.products.length == 0) {
        doGetAllProducts(store.dispatch)
      }
    }, 500);
  }

  filterProducts = (filtered) => {
    this.setState({
      product_name: filtered.product_name,
      price_from: filtered.price_from,
      price_to: filtered.price_to,
      seller: filtered.seller,
      shipper: filtered.shipper,
      stocks: filtered.stocks,
    })
  }

  render() {
    let { products, loading, activeCategory, user } = this.props;
    let { page, cntperpage, product_name, price_from, price_to, seller, shipper, stocks } = this.state;
    console.log(products)
    let filtered_products = products.filter(product => {
      // activeCategory == product.category_id
      let result = true
      if (result && product_name != "" && product.title.toUpperCase().indexOf(product_name.toUpperCase()) < 0) {
        result = false
      }
      if (result && parseFloat(product.price) < parseInt(price_from)) {
        result = false
      }
      if (result && parseFloat(product.price) > parseInt(price_to)) {
        result = false
      }
      if (result && seller != "" && product.info.length > 0) {
        let i;
        for (i = 0; i < product.info.length; i ++) {
          if (product.info[i].seller.indexOf(seller) >= 0) {
            break;
          }
        }
        if (i < product.info.length) {
          result = true;
        } else {
          result = false;
        }
      }
      if (result && shipper != "" && product.info.length > 0) {
        let i;
        for (i = 0; i < product.info.length; i ++) {
          if (product.info[i].shipper.indexOf(shipper) >= 0) {
            break;
          }
        }
        if (i < product.info.length) {
          result = true;
        } else {
          result = false;
        }
      }
      // if (result && seller != "" && product.seller.indexOf(seller) < 0) {
      //   result = false
      // }
      // if (result && shipper != "" && product.shipper.indexOf(shipper) < 0) {
      //   result = false
      // }
      if (result && parseInt(product.stocks) < stocks) {
        result = false
      }
      
      if (user.role == ROLE_A) {
        return result;
      }

      if (activeCategory != product.category_id) {
        result = false;
      }

      return result 
    });

    return (
      <>
        <Helmet>
          <title>Products | Material Kit</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
            paddingTop: "44px"
          }}
        >
          <Container maxWidth={false}>
            <Grid
              container
            >
              <Grid
                item
                lg={12}
                sm={12}
              >
                <ProductListToolbar filterProducts={this.filterProducts}/>
              </Grid>
              <Grid
                item
                lg={12}
                sm={12}
              >
                { loading ? "" : 
                <>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3
                  }}
                >
                  <Pagination
                    color="primary"
                    count={Math.ceil(filtered_products.length / cntperpage)}
                    size="small"
                    page={page}
                    onChange={(e, page) => this.setState({page: page})}
                  />
                </Box>
                <Box sx={{ pt: 3 }}>
                  <Grid
                    container
                    spacing={3}
                  >
                    {filtered_products.slice((page-1) * cntperpage, (page) * cntperpage).map((product) => (
                      <Grid
                        item
                        key={product.asin}
                        lg={2}
                        md={3}
                        sm={4}
                        xs={6}
                      >
                        <ProductCard product={product} key={product.asin}/>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    pt: 3
                  }}
                >
                  <Pagination
                    color="primary"
                    count={Math.ceil(filtered_products.length / cntperpage)}
                    size="small"
                    page={page}
                    onChange={(e, page) => this.setState({page: page})}
                  />
                </Box>
                </>
                }
              </Grid>
            </Grid>
          </Container>
          {/* <RequestUrl /> */}
        </Box>
      </>
    );
  }
} 

const mapStateToProps = (state) => ({
  user: state.auth.user,
  products: state.product.products,
  loading: state.product.loading,
  activeCategory: state.category.activeCategory
})

export default connect(mapStateToProps)(Products);
