import {React, useState} from 'react'
import { Card, CardMedia, Grid2, CardHeader, Typography, Grow, Button, IconButton} from '@mui/material';
import { createTheme, ThemeProvider} from '@mui/material/styles';

import "./Modal.css";
import Color from 'color';
import { brown } from '@mui/material/colors';

import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';



const theme = createTheme({
  typography: {
    poster: {
        fontSize: 64,
        fontFamily: [
        ''
        ],
        color: '',
        //"fontWeight": 500,
    },
    // Disable h3 variant
  
  },
  palette: {
    primary: {
        main: "#808080"
    //   main: '#E3D026',
    //   light: '#E9DB5D',
    //   dark: '#A29415',
    //   contrastText: '#242105',
    },
  },
});

const Modal = (props) => {

    const { id, name, price, img, brand, model, material, shape, gender, frameType, lensWidth, lensHeight, bridgeWidth, templeLength} = props.data;

    return(
        
        <div>
        <div className="modal">
            <div className="overlay"></div>
            <div className="modal-content">

                <Grid2 
                container 
                spacing={2}
                direction="row"
                paddingTop={2}

                >
                {/* <img src={`${img}`} className="item-image" alt="Test" /> */}
                    <Grid2>
                    <img src={`${img}`} className="item-image" alt="Test" />
                    </Grid2>

                    <Grid2 item container spacing={0} direction="column" paddingLeft={10} paddingTop={7} > {/*3*/}
                        {/* <h1>Test</h1> */}
                        <Grid2>
                            <ThemeProvider theme={theme} >
                                <Typography variant="poster"className="mod-title">{name}</Typography>
                            </ThemeProvider>
                        </Grid2>

                        <Grid2 item className="tester"> 
                            <Typography variant="h4" className="mod-title tester">{price}</Typography>
                        </Grid2>

                        <Grid2 paddingTop={5}>
                            <ThemeProvider theme={theme} >
                                <Button variant="contained" color="primary" sx={{width:300,}}> Add to Cart </Button>
                            </ThemeProvider>
                        </Grid2>
                    </Grid2>


                </Grid2>

                <Grid2
                container
                direction="row"
                paddingTop={7}
                >

                <Grid2
                 container
                 direction="column"

                 >
                    <Grid2>
                    <Typography variant="h4" className="mod-title tester">Dimensions</Typography>
                    </Grid2>

                    <Grid2 item container direction="column" paddingTop={3} spacing={3} >
                        
                        <Grid2>
                            <Typography> <b>Lens Width: </b> {lensWidth}mm <b>Lens Height: </b>{lensHeight}mm </Typography>
                            {/* <Typography> <b>Brand: </b> {brand} <b>Model: </b>{model} <b>Material:</b>{material} <b>Shape:</b> {shape} </Typography> */}
                        </Grid2>

                        <Grid2>
                            <Typography> <b>Bridge Width: </b> {bridgeWidth}mm <b>Temple Length: </b>{templeLength}mm </Typography>
                        </Grid2>

                    </Grid2>




                </Grid2>

                    <Grid2 paddingLeft={5}>
                    <Grid2
                 container
                 direction="column"

                 >
                    <Grid2>
                    <Typography variant="h4" className="mod-title tester">Specifications</Typography>
                    </Grid2>

                    <Grid2 item container direction="column" paddingTop={3} spacing={3} >
                        
                        <Grid2>
                            <Typography> <b>Brand: </b> {brand} <b>Model: </b>{model} <b>Material: </b>{material}</Typography>
                            {/* <Typography> <b>Brand: </b> {brand} <b>Model: </b>{model} <b>Material:</b>{material} <b>Shape:</b> {shape} </Typography> */}
                        </Grid2>

                        <Grid2>
                            <Typography> <b>Shape: </b> {shape} <b>Gender: </b>{gender} <b>Frame Type: </b>{frameType} </Typography>
                        </Grid2>

                    </Grid2>




                </Grid2>
                    </Grid2>

                </Grid2>

                
                <IconButton className="shifter" onClick={props.bool}>
                    <CancelPresentationIcon   sx={{ fontSize: 50 }} />
                </IconButton>
                    
            </div>
            
        </div>

         {/* <img src={`${img}`} className="modal modal-content" alt="Test" />  */}
         
        </div>
    );
}
export default Modal
