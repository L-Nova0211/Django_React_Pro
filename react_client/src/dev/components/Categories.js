import { useState, Component } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
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
import { proposeCategory, getCategories, deleteCategory, toggleCategory } from 'src/actions/categoryActions';
import store from 'src/store';
import { connect } from 'react-redux'

function isURL(str) {
  const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}

class Categories extends Component {
  state = {
    category_name: "",
    category_url: "",
  }
  
  handleChange = (event) => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleAdd = () => {
    if (this.state.category_name != "" && this.state.category_url != "") {
      if (isURL(this.state.category_url)) {
        proposeCategory(store.dispatch, {
          name: this.state.category_name,
          url: this.state.category_url,
        });
      } else {
        alert("Invalid url")
      }
    } else {
      alert("Fill the mandetary")
    }
  }

  handleDelete = (id) => {
    console.log(id)
    deleteCategory(store.dispatch, {
      id: id,
    })
  }
  toggleCategory = (id) => {
    toggleCategory(store.dispatch, {
      id: id,
    })
  }

  componentDidMount() {
    getCategories(store.dispatch)
  }

  render() {
    let { categories } = this.props;
    let { category_name, category_url } = this.state;
    return (
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
                  Add
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
                {categories.map((customer, id) => (
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
                      {(customer.is_scraped == 0 ? "新着" : ( customer.is_scraped == 1 ? "終わり" : "スクレイピング"))}
                    </TableCell>
                    <TableCell>
                      <Button
                      color="primary"
                      variant="contained"
                      onClick={() => this.toggleCategory(customer.id)}
                      >
                        {(customer.is_scraped == 0 ? "開始" : ( customer.is_scraped == 1 ? "リセット" : "停止"))}
                      </Button>
                      <Button
                      color="warning"
                      variant="contained"
                      onClick={() => this.handleDelete(customer.id)}
                      sx={{
                        marginLeft: "1rem"
                      }}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          
          </Box>
        </Card>
    );
  }
};

const mapStateToProps = (state) => ({
  categories: state.category.categories
})

export default connect(mapStateToProps)(Categories);
