import { Component } from 'react';
import {
  Box,
  Button,
} from '@material-ui/core';

class SubToolbar extends Component {
    render() {
        return (
            <Box
                sx={{
                display: 'flex',
                }}
            >
                <Button
                    sx={{
                        flex: "1 1 auto"
                    }}
                >
                Prev
                </Button>
                <Button 
                    sx={{
                        flex: "1 1 auto"
                    }}
                >
                Next
                </Button>
            </Box>
        )
    }
}

export default SubToolbar;