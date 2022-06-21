import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  Grid,
  Typography,
  Tooltip,
} from '@material-ui/core';
import { AccessTimeIcon, GetApp as GetAppIcon } from '@material-ui/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faYenSign } from '@fortawesome/free-solid-svg-icons'
import './ProductCard.css';

const ProductCard = ({ product, ...rest }) => {
  const navigate = useNavigate();
  const { asin } = product;
  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
      {...rest}
    >
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pb: 3
          }}
        >
          <Avatar
            alt="Product"
            src={product.imgurls.length > 0 ? product.imgurls.split(',')[0] : ""}
            sx={{
              width: '100%',
              height: "150px",
            }}
            variant="square"
            onClick={() => {
              navigate(`/dev/product/${asin}`, { replace: false });
            }}
          />
        </Box>
        <Typography
          align="center"
          color="textPrimary"
          gutterBottom
          variant="h4"

        >
          {product.title.slice(0, 60) + (product.title.length > 60 ? "..." : "")}
        </Typography>
        {/* <Typography
          align="center"
          color="textPrimary"
          variant="body1"
        >
          {product.description}
        </Typography> */}
      </CardContent>
      <Box sx={{ flexGrow: 1 }} />
      <Divider />
      <Box sx={{ p: 2 }}>
        <Grid
          container
          spacing={2}
          sx={{ justifyContent: 'space-between' }}
        >
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <FontAwesomeIcon icon={faYenSign} />
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {product.avg_price}
            </Typography>
          </Grid>
          <Grid
            item
            sx={{
              alignItems: 'center',
              display: 'flex'
            }}
          >
            <Typography
              color="textSecondary"
              display="inline"
              sx={{ pl: 1 }}
              variant="body2"
            >
              {product.is_prime ? "NEW" : ""}
              {' '}
            </Typography>
            <GetAppIcon color="action" cursor="pointer" />
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

ProductCard.propTypes = {
  product: PropTypes.object.isRequired
};

export default ProductCard;
