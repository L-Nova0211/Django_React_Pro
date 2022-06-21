import { Component } from 'react';
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
import { connect } from 'react-redux';
import Parse from 'html-react-parser';
import './ProductDetailInfo.css';
import { Formik } from 'formik';
import * as Yup from 'yup';

import { updateProductDetail, updateProductInfo, } from 'src/actions/managerActions';
import store from 'src/store';
import { Upload } from 'react-feather';

import { ROLE_B, ROLE_A } from 'src/config';

class ProductDetailInfo extends Component {
    state = {
        title: '',
        category_id: -1,
        info: [],
        description: [],
        own_description: ""
    };

    handleChange = (event) => {
        if ((this.props.role & ROLE_B) === ROLE_B) {
            this.setState({ 
                [event.target.name]: event.target.value
            })
        } else {
            alert("Cannot edit. Please contact manager");
        }
    };

    handleChangeInfo = (id) => (e) => {
        
    }

    updateProductDetail = () => {
        if ((this.props.role & ROLE_B) === ROLE_B) {
            let {
                title = "",
                own_description = ""
            } = this.state;
            updateProductDetail(store.dispatch, {
                id: this.props.product.id,
                asin: this.props.product.asin,
                title: title,
                own_description: own_description
            })
        }
    }

    componentDidMount() {
        let { product } = this.props;
        console.log("-------------------")
        console.log(product)
        let descriptions = product.contents.split("~")
        this.setState({
            title: product.title,
            // category_id: product.category_id,
            own_description: product.own_description,
            
            description: descriptions,
        })
    }

    render() {
        console.log("LOG")
        const {
            title,
            // category_id,
            seller,
            stocks,
            shipper,
            price,
            description,
            own_description
        } = this.state;
        const { categories, role, product } = this.props;
        const { id, info_list } = product;
        // let category = "";
        // if (categories.length > 0) {
        //     category = categories.filter(cate => (cate.id == category_id))[0]
        // }
        return (
        <Card className="product-detail">
            <CardHeader
                subheader="The information can be edited"
                title="Product Information"
            />
            <Box
                sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                p: 2
                }}
            >
                { (role & ROLE_B) === ROLE_B ? <Button
                color="primary"
                variant="contained"
                style={{ marginRight: "2rem"}}
                onClick={this.updateProductDetail}
                >
                Update Data
                </Button> : ""
                }
            </Box>
            <Divider />
            <CardContent>
                <Grid
                container
                spacing={3}
                >
                    <Grid
                        item
                        md={12}
                        xs={12}
                    >
                        <TextField
                        fullWidth
                        helperText="This is product name.."
                        label="Product name"
                        name="title"
                        onChange={this.handleChange}
                        required
                        value={title}
                        variant="outlined"
                        />
                    </Grid>
                    <Grid
                        item
                        md={12}
                        xs={12}
                    >
                        <TextField
                        fullWidth
                        helperText=""
                        label="Description"
                        name="own_description"
                        onChange={this.handleChange}
                        required
                        value={own_description}
                        variant="outlined"
                        multiline
                        />
                    </Grid>

                    <Grid
                        item
                        md={12}
                        xs={12}
                    >
                    { info_list && info_list.length > 0 && info_list.map((productinfo, id) => (
                    <Formik
                    key={id}
                    initialValues={{
                        seller: productinfo.seller,
                        stocks: productinfo.stocks,
                        shipper: productinfo.shipper,
                        price: productinfo.price,
                        stocks_status: productinfo.stocks_status
                    }}
                    validationSchema={Yup.object().shape({
                        seller: Yup.string(),
                        stocks: Yup.string(),
                        shipper: Yup.string(),
                        price: Yup.number(),
                        stocks_status: Yup.number()
                    })}
                    onSubmit={(data) => {
                        if ((this.props.role & ROLE_B) === ROLE_B) {
                            let {
                                seller = "",
                                stocks = 0,
                                shipper = "",
                                price = 0,
                            } = data;
                            updateProductInfo(store.dispatch, {
                                id: productinfo.id,
                                seller: seller,
                                stocks: stocks,
                                shipper: shipper,
                                price: price,
                            })
                        }
                        return true;
                    }}
                    >
                    {({
                        errors,
                        handleBlur,
                        handleChange,
                        handleSubmit,
                        isSubmitting,
                        touched,
                        values
                    }) => (
                        <form onSubmit={handleSubmit}>
                            <Grid container
                                sx={{
                                    paddingBottom: "10px"
                                }}
                            >
                            <Grid
                                item
                                xs={11}
                            >
                                <Grid
                                container
                                >
                                <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    xs={6}
                                >
                                    <TextField
                                    fullWidth
                                    label="Seller"
                                    name="seller"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    value={values.seller}
                                    variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    xs={6}
                                >
                                    <TextField
                                    fullWidth
                                    label="Number of Stocks"
                                    name="stocks"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={ `${values.stocks_status == 0 ? values.stocks : 
                                        ( values.stocks_status == 1 ? "Cannot get" : 
                                        ( values.stocks_status == 2 ? `Limitation ${values.stocks}` : 
                                        ( values.stocks_status == 3 ? "Over 999" : "")))}`}
                                    variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    xs={6}
                                >
                                    <TextField
                                    fullWidth
                                    label="Shipper"
                                    name="shipper"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    value={(values.shipper)}
                                    variant="outlined"
                                    />
                                </Grid>
                                <Grid
                                    item
                                    lg={6}
                                    md={12}
                                    xs={6}
                                >
                                    <TextField
                                    fullWidth
                                    label="Price (yen)"
                                    name="price"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    required
                                    value={values.price}
                                    variant="outlined"
                                    />
                                </Grid>
                                </Grid>
                            </Grid>
                            { (role & ROLE_B) === ROLE_B ? 
                            <Grid item xs={1} sx={{
                                paddingTop: "20px",
                                paddingLeft: "20px",
                            }}>
                                {/* <Grid item> */}
                                <Upload 
                                    style={{cursor: "pointer"}}
                                    onClick={handleSubmit}
                                ></Upload>
                                {/* </Grid> */}
                            </Grid>
                            : ""}
                            </Grid>
                        </form>
                    )}
                    </Formik>
                    )) }
                    </Grid>

                    { description.map((descript, id) => (
                        <Grid
                            key={id}
                            item
                            md={12}
                            xs={12}
                            sx={{
                                overflow: "auto",
                            }}
                        >
                            {Parse(descript.replace(/href/gi,"asdf").replace(/class/gi,"asdf"))}
                            {/* <TextField
                            fullWidth
                            label="Description"
                            name="description"
                            // onChange={this.handleChange}
                            required
                            value={``}
                            variant="outlined"
                            multiline={true}
                            /> */}
                        </Grid>
                    ))}
                </Grid>
            </CardContent>
            <Divider />
        </Card>
        );
    }
};

const mapStateToProps = (state) => ({
    role: state.auth.role,
    categories: state.category.categories,
})

export default connect(mapStateToProps)(ProductDetailInfo);
