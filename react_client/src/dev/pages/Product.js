import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { Component, useReducer } from 'react'
import {
  Box,
  Container,
  Grid
} from '@material-ui/core';
import ProductImageInfo from 'src/dev/components/ProductImageInfo';
import ProductDetailInfo from 'src/dev/components/ProductDetailInfo';

import { connect } from 'react-redux'
import store from 'src/store';
import { doGetAllProducts } from 'src/actions/productActions';
import { getCategories } from 'src/actions/categoryActions';

class ProductContainer extends Component {
  componentDidMount() {
    let { products, categories } = this.props;
    setTimeout(() => {
      if (products.length === 0) {
        doGetAllProducts(store.dispatch)
      }
      if (categories.length === 0) {
        getCategories(store.dispatch)
      }
    }, 500)
  }
  render() {
    let { products, loading, id } = this.props;
    let product = {};
    if (products.length > 0) {
      product = (products.filter((product) => (product.asin == id)))[0]
    }
    return (
      <>
        <Helmet>
          <title>Product | Material Kit</title>
        </Helmet>
        <Box
          sx={{
            backgroundColor: 'background.default',
            minHeight: '100%',
            py: 3,
            // marginTop: "64px",
          }}
        >
          <Container maxWidth="lg">
            <Grid
              container
              spacing={3}
            >
              { loading ? "Loading" :
              <>
                <Grid
                  item
                  lg={4}
                  md={6}
                  xs={12}
                >
                  <ProductImageInfo product={product}/>
                </Grid>
                <Grid
                  item
                  lg={8}
                  md={6}
                  xs={12}
                >
                  <ProductDetailInfo product={product}/>
                </Grid>
              </>
              }
            </Grid>
          </Container>
        </Box>
      </>
    )
  }
};

const Product = (props) => {
  let { id } = useParams()
  return (
    <ProductContainer id={id} {...props}></ProductContainer>
  )
}

const mapStateToProps = (state) => ({
  products: state.product.products,
  loading: state.product.loading,
  categories: state.category.categories
})

export default connect(mapStateToProps)(Product);
