import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import Paper from '@material-ui/core/Paper';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Tooltip from '@material-ui/core/Tooltip';
import SearchIcon from '@material-ui/icons/Search';
import DirectionsIcon from '@material-ui/icons/Directions';

import {
    proposeCategory
} from 'src/actions/categoryActions';

import store from 'src/store';

const useStyles = makeStyles((theme) => ({
  root: {
    padding: '2px 4px',
    display: 'flex',
    position: "fixed",
    alignItems: 'center',
    width: "40vw",
    minWidth: 400,
    bottom: "20px",
    left: "50%",
    transform: "translateX(-50%)",
  },
  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
}));

export default function RequestUrl() {
  const classes = useStyles();
  const [values, setValues] = useState({
    product_name: '',
    product_url: '',
  });
  const changeHandle = (e) => {
      setValues({
          ...values,
          [e.target.name]: e.target.value
      })
  }

  const handleSubmit = () => {
      if (values.product_name != "" && values.product_url != "") {
        proposeCategory(store.dispatch, {
            name: values.product_name,
            url: values.product_url,
        })
      } else {
        alert("Require inputs");
      }
  }

  return (
    <Paper component="form" className={classes.root}>
      <Tooltip title="Please input product name here" aria-label="add">
        <IconButton className={classes.iconButton} aria-label="menu">
            <MenuIcon />
        </IconButton>
      </Tooltip>
      <InputBase
        className={classes.input}
        placeholder="Product Name"
        inputProps={{ 'aria-label': 'product name' }}
        name="product_name"
        value={values.product_name}
        onChange={changeHandle}
      />
      <InputBase
        className={classes.input}
        placeholder="Product Url"
        inputProps={{ 'aria-label': 'product url' }}
        name="product_url"
        value={values.product_url}
        onChange={changeHandle}
      />
      {/* <IconButton type="submit" className={classes.iconButton} aria-label="search">
        <SearchIcon />
      </IconButton> */}
      <Divider className={classes.divider} orientation="vertical" />
      <IconButton color="primary" className={classes.iconButton} aria-label="directions" onClick={handleSubmit}>
        <DirectionsIcon />
      </IconButton>
    </Paper>
  );
}