import React from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { auth } from '@/libs/firebase';

const ButtonAppBar = () => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Light Annotation
          </Typography>
          <Button color="inherit" onClick={() => auth.signOut()}>signout</Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ButtonAppBar;