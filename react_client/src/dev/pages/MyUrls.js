import { Helmet } from 'react-helmet';
import {
  Box,
  Container,
  Grid,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from '@material-ui/core';
import moment from 'moment';

import { Component } from 'react';
import { connect } from 'react-redux';

import Categories from 'src/dev/components/Categories';

import store from 'src/store';
import { getCategories, proposeCategory, updateCategory, proposeScraping } from 'src/actions/categoryActions'
import { isUndefined } from 'lodash';

function isURL(str) {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

class MyUrls extends Component {
    state = {
        id: "",
      category_name: "",
      category_url: "",
      editing: false,
    }
    handleChange = (event) => {
        this.setState({
            [event.target.name]: event.target.value
        });
    };

    
    handleAdd = () => {
        if (this.props.user.bid <= 0) {
            alert("you ran out of bid")
            return;
        }
        if (this.state.category_name != "" && this.state.category_url != "") {
            if (isURL(this.state.category_url)) {
                if (this.state.editing) {
                    updateCategory(store.dispatch, {
                        id: this.state.id,
                        name: this.state.category_name,
                        url: this.state.category_url,
                    });
                    this.setState({
                        editing: false,
                        category_name: "",
                        category_url: "",
                    })
                } else {
                    proposeCategory(store.dispatch, {
                        name: this.state.category_name,
                        url: this.state.category_url,
                    })
                    this.setState({
                        editing: false,
                        category_name: "",
                        category_url: "",
                    })
                }
            } else {
                alert("Invalid url")
            }
        } else {
            alert("Fill the mandetary")
        }
    }

    handleEdit = (id, name, url) => {
        if (this.state.id == id) {
            this.setState({
                id: "",
                editing: false,
                category_name: "",
                category_url: "",
            })
        } else {
            this.setState({
                id: id,
                editing: true,
                category_name: name,
                category_url: url,
            })
        }
    }

    handleScrapePropose = () => {
        if (this.props.user.lastPropose && new Date().getTime() - new Date(this.props.user.lastPropose).getTime() < 7 * 3600 * 24) {
            alert("You have to wait for " + (Date() - Date(this.props.user.lastPropose)) / 3600 / 24 + " for next propose." );
            // return;
        }
        var today = new Date();
        var dd = String(today.getDate() + 7).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        today = mm + '/' + dd + '/' + yyyy;
        var agree = prompt("Your next propose is " + today + ". \nUntil that day you cannot propse.", "yes");

        if (agree != null && agree.toUpperCase() == "YES") {
            proposeScraping(store.dispatch)
        }
    }

    componentDidMount() {
        if (this.props.categories.length == 0) {
            getCategories(store.dispatch)
        }
    }

    render() {
        let { categories, user } = this.props;
        let { category_name, category_url } = this.state;

        let proposeBtnColor = (user.lastPropose && new Date().getTime() - new Date(this.props.user.lastPropose).getTime() < 7 * 3600 * 24) ? "warning" : "primary";

        return (
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
                    lg={12}
                    sm={12}
                    xl={12}
                    xs={12}
                >
                    <Card>
                        <CardHeader
                        subheader="you can add category to scrap"
                        title="Categories"
                        />
                        <Divider />
                        <CardContent>
                        <Grid
                            container
                            spacing={3}
                        >
                            <Grid
                            item
                            md={4}
                            xs={12}
                            >
                            <TextField
                                fullWidth
                                helperText="Please specify the category"
                                label="Category"
                                name="category_name"
                                onChange={this.handleChange}
                                required
                                value={category_name}
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
                                helperText="Please specify the category's url"
                                label="URL"
                                name="category_url"
                                onChange={this.handleChange}
                                required
                                value={category_url}
                                variant="outlined"
                            />
                            </Grid>
                            <Grid
                            item
                            md={2}
                            xs={12}
                            >
                                <Button
                                color="primary"
                                variant="contained"
                                sx={{padding: '1rem',width: '100%'}}
                                onClick={this.handleAdd}
                                >
                                { this.state.editing ? "Update" : `Add (${user.bid})` }
                                </Button>
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
                            <Table>
                            <TableHead>
                            <TableRow>
                                <TableCell>
                                    No
                                </TableCell>
                                <TableCell>
                                Category
                                </TableCell>
                                <TableCell>
                                Url
                                </TableCell>
                                <TableCell>
                                User
                                </TableCell>
                                <TableCell>
                                Registed at
                                </TableCell>
                                <TableCell>
                                Progress
                                </TableCell>
                                <TableCell>
                                Actions
                                </TableCell>
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {categories.map((customer, id) => customer.member == user.email ? (
                                <TableRow
                                hover
                                key={id}
                                selected={id == -1}
                                >
                                <TableCell>
                                    { id + 1 }
                                </TableCell>
                                <TableCell>
                                    <Typography
                                        color="textPrimary"
                                        variant="body1"
                                    >
                                    {customer.name}
                                    </Typography>
                                </TableCell>
                                <TableCell>
                                    <a href={customer.url} target="_blank">{ customer.url }</a>
                                </TableCell>
                                <TableCell>
                                    <a href={customer.member} target="_blank">{ customer.member }</a>
                                </TableCell>
                                <TableCell>
                                    {moment(customer.registered_at).format('DD/MM/YYYY HH:mm')}
                                </TableCell>
                                <TableCell>
                                    {(customer.is_scraped == 0 ? "Ready" : ( customer.is_scraped == 1 ? "Completed" : "Running"))}
                                </TableCell>
                                <TableCell>
                                    <Button
                                        color="warning"
                                        variant="contained"
                                        onClick={() => this.handleEdit(customer.id, customer.name, customer.url)}
                                        sx={{
                                        marginLeft: "1rem"
                                        }}
                                    >
                                    { customer.id == this.state.id ? "Cancel" : "Edit" }
                                    </Button>
                                </TableCell>
                                </TableRow>
                            ) : "")}
                            </TableBody>
                        </Table>
                        
                        </Box>
                    </Card>
                </Grid>
                </Grid>
                
                <Button
                    color={proposeBtnColor}
                    variant="contained"
                    sx={{
                        fontSize: "2rem",
                        padding: '1rem',
                        borderRadius: "1000px",
                        position: "fixed",
                        right: "30px",
                        bottom: "30px",
                    }}
                    onClick={this.handleScrapePropose}
                >
                    Propose scraping
                </Button>
            </Container>
            </Box>
        </>
        );
    }
} 

const mapStateToProps = (state) => ({
    user: state.auth.user,
    categories: state.category.categories
})

export default connect(mapStateToProps)(MyUrls);
