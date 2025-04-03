import { React } from 'react';
import { Grid2, Typography, Button, IconButton } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';
import "./Modal.css";

const theme = createTheme({
    typography: {
        poster: {
            fontSize: 64,
            fontFamily: [''],
            color: '',
        },
    },
    palette: {
        primary: {
            main: "#808080"
        },
    },
});

const Modal = (props) => {
    const { id, name, price, img, brand, model, material, shape, gender, frameType, lensWidth, lensHeight, bridgeWidth, templeLength } = props.data;
    const { bool, addToCart } = props; // Destructure addToCart from props

    return (
        <div>
            <div className="modal">
                <div className="overlay"></div>
                <div className="modal-content">
                    <Grid2 container spacing={2} direction="row" paddingTop={2}>
                        <Grid2>
                            <img src={`${img}`} className="item-image" alt="Test" />
                        </Grid2>

                        <Grid2 item container spacing={0} direction="column" paddingLeft={10} paddingTop={7}>
                            <Grid2>
                                <ThemeProvider theme={theme}>
                                    <Typography variant="poster" className="mod-title">{name}</Typography>
                                </ThemeProvider>
                            </Grid2>

                            <Grid2 item className="tester">
                                <Typography variant="h4" className="mod-title tester">{price}</Typography>
                            </Grid2>

                            <Grid2 paddingTop={5}>
                                <ThemeProvider theme={theme}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ width: 300 }}
                                        onClick={() => addToCart(props.data)} // Call addToCart with frame data
                                    >
                                        Add to Cart
                                    </Button>
                                </ThemeProvider>
                            </Grid2>
                        </Grid2>

                        <Grid2 container direction="row" paddingTop={7}>
                            <Grid2 container direction="column">
                                <Grid2>
                                    <Typography variant="h4" className="mod-title tester">Dimensions</Typography>
                                </Grid2>

                                <Grid2 item container direction="column" paddingTop={3} spacing={3}>
                                    <Grid2>
                                        <Typography><b>Lens Width: </b> {lensWidth}mm <b>Lens Height: </b>{lensHeight}mm </Typography>
                                    </Grid2>

                                    <Grid2>
                                        <Typography><b>Bridge Width: </b> {bridgeWidth}mm <b>Temple Length: </b>{templeLength}mm </Typography>
                                    </Grid2>
                                </Grid2>
                            </Grid2>

                            <Grid2 paddingLeft={5}>
                                <Grid2 container direction="column">
                                    <Grid2>
                                        <Typography variant="h4" className="mod-title tester">Specifications</Typography>
                                    </Grid2>

                                    <Grid2 item container direction="column" paddingTop={3} spacing={3}>
                                        <Grid2>
                                            <Typography><b>Brand: </b> {brand} <b>Model: </b>{model} <b>Material: </b>{material}</Typography>
                                        </Grid2>

                                        <Grid2>
                                            <Typography><b>Shape: </b> {shape} <b>Gender: </b>{gender} <b>Frame Type: </b>{frameType} </Typography>
                                        </Grid2>
                                    </Grid2>
                                </Grid2>
                            </Grid2>
                        </Grid2>

                    </Grid2>

                    <IconButton className="shifter" onClick={bool}>
                        <CancelPresentationIcon sx={{ fontSize: 50 }} />
                    </IconButton>

                </div>

            </div>

        </div>
    );
};

export default Modal;