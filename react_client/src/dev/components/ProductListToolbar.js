import { Component } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  SvgIcon,
  Grid,
  IconButton,
  
} from '@material-ui/core';
import { Search as SearchIcon, UserCheck, Users, Bookmark } from 'react-feather';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYenSign } from '@fortawesome/free-solid-svg-icons'
import InputIcon from '@material-ui/icons/Input';
import { connect } from 'react-redux';
import store from 'src/store';
import { getCategories } from 'src/actions/categoryActions';
import { ROLE_A } from 'src/config';

export const CHANGE_ACTIVE_CATEGORY = "CHANGE_ACTIVE_CATEGORY";

function isNumeric(str) {
  if (typeof str != "string") return false // we only process strings!  
  return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
         !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
}

class ProductListToolbar extends Component {
  state = {
    product_name: "",
    price_from: 0,
    price_to: 9999999,
    seller: "",
    shipper: "",
    stocks: 0,
    
    // filter_product_name: "",
    // filter_price_from: 0,
    // filter_price_to: 9999999,
    // filter_seller: "",
    // filter_shipper: "",
    // filter_stocks: 0,
  }
  handleChangeState = (e) => {
    if (["price_from", "price_to", "stocks"].indexOf(e.target.name) >= 0) {
      if (isNumeric(e.target.value)) {
        this.setState({
          [e.target.name]: e.target.value
        })
      }
    } else {
      this.setState({
        [e.target.name]: e.target.value
      })
    }
  }
  handleChange = (e) => {
    store.dispatch({
      type: CHANGE_ACTIVE_CATEGORY,
      payload: e.target.value
    })
  }

  componentDidMount() {
    if (this.props.categories.length == 0) {
      getCategories(store.dispatch)
    }
  }

  filterProduct = () => {
    let {
      product_name,
      price_from,
      price_to,
      seller,
      shipper,
      stocks,
    } = this.state;
    this.props.filterProducts({
      product_name,
      price_from,
      price_to,
      seller,
      shipper,
      stocks,
    });
  }

  render() {
    let { categories, activeCategory, user } = this.props;
    let {
      product_name,
      price_from,
      price_to,
      seller,
      shipper,
      stocks,
    } = this.state;

    return (
      <Box >
        <Box sx={{ mt: 0 }}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid
                  item
                  lg={12}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  <TextField
                    fullWidth
                    label="Select Category"
                    name="category"
                    onChange={this.handleChange}
                    required
                    select
                    SelectProps={{ native: true }}
                    value={activeCategory}
                    variant="outlined"
                  >
                    {categories.map((category) => (user.role == ROLE_A || category.member == user.email) ? (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ) : "")}
                  </TextField>
{/*                 
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search product"
                    variant="outlined"
                    value={product_name}
                    name="product_name"
                    onChange={this.handleChangeState}
                  />
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            
                            <FontAwesomeIcon icon={faYenSign} />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="From"
                    variant="outlined"
                    value={price_from}
                    name="price_from"
                    onChange={this.handleChangeState}
                  />
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <DollarSign />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="To"
                    variant="outlined"
                    value={price_to}
                    name="price_to"
                    onChange={this.handleChangeState}
                  />
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <UserCheck />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Seller"
                    variant="outlined"
                    value={seller}
                    name="seller"
                    onChange={this.handleChangeState}
                  />
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <Users />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Shipper"
                    variant="outlined"
                    value={shipper}
                    name="shipper"
                    onChange={this.handleChangeState}
                  />

                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <Bookmark />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Over Stocks"
                    variant="outlined"
                    value={stocks}
                    name="stocks"
                    onChange={this.handleChangeState}
                  />
                  
                  <IconButton 
                    color="inherit"
                    onClick={this.filterProduct}
                  >
                    <InputIcon />
                  </IconButton> */}
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={3}
                  sm={12}
                  xs={12}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <SearchIcon />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Search product"
                    variant="outlined"
                    value={product_name}
                    name="product_name"
                    onChange={this.handleChangeState}
                  />
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={3}
                  sm={4}
                  xs={6}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            
                            <FontAwesomeIcon icon={faYenSign} />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="From"
                    variant="outlined"
                    value={price_from}
                    name="price_from"
                    onChange={this.handleChangeState}
                  />
                  
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={3}
                  sm={4}
                  xs={6}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            
                            <FontAwesomeIcon icon={faYenSign} />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="To"
                    variant="outlined"
                    value={price_to}
                    name="price_to"
                    onChange={this.handleChangeState}
                  />
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={3}
                  sm={4}
                  xs={6}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <UserCheck />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Seller"
                    variant="outlined"
                    value={seller}
                    name="seller"
                    onChange={this.handleChangeState}
                  />
                </Grid>
                <Grid
                  item
                  lg={1}
                  md={3}
                  sm={4}
                  xs={6}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >
                  
                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <Users />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Shipper"
                    variant="outlined"
                    value={shipper}
                    name="shipper"
                    onChange={this.handleChangeState}
                  />
                </Grid>
                <Grid
                  item
                  lg={2}
                  md={3}
                  sm={4}
                  xs={6}
                  style={{paddingRight: "6px", paddingBottom: "6px", }}
                >

                  <TextField
                    fullWidth
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SvgIcon
                            fontSize="small"
                            color="action"
                          >
                            <Bookmark />
                          </SvgIcon>
                        </InputAdornment>
                      )
                    }}
                    placeholder="Over Stocks"
                    variant="outlined"
                    value={stocks}
                    name="stocks"
                    onChange={this.handleChangeState}
                  />
                  
                </Grid>
                <Grid
                  item
                  lg={1}
                  md={6}
                  sm={4}
                  xs={6}
                  style={{padding: "4px", textAlign: "center"}}
                >
                  <IconButton 
                    color="inherit"
                    onClick={this.filterProduct}
                  >
                    <InputIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Box>
      </Box>
    );
  }
} 

const mapStateToProps = (state) => ({
  user: state.auth.user,
  categories: state.category.categories,
  activeCategory: state.category.activeCategory
})

export default connect(mapStateToProps)(ProductListToolbar);
