// frames.jsx
import {React, useState} from "react"
import { Card, CardContent, CardActionArea, CardMedia, Grid2, CardHeader, Typography, Grow} from '@mui/material';
import { styled } from "@mui/material/styles";
import Color from "color";
import Modal from "../../components/Modal"
import UsernavBar from "../../components/navBar";

const Frames = () => {
    const data = [
        { id: 1, name: "Brescia"         ,   price: "$99.99" ,   img: "/Images/Brescia.webp", brand: "Aura", model: "AUM-16-64", material: "Plastic", shape: "Rectangular", gender: "Men", frameType: "Full Frame", lensWidth: 54, lensHeight: 33, bridgeWidth: 14, templeLength: 140}, //units is mm
        { id: 2, name: "Cape May"       ,   price: "$199.99",   img: "/Images/CapeMay.webp",      brand: "Elements", model: "VC-M04", material: "Metal", shape: "Double Bar", gender: "Men", frameType: "Full Frame", lensWidth: 57, lensHeight: 49, bridgeWidth: 18, templeLength: 140},
        { id: 3, name: "Brevik"         ,   price: "$79.99" ,   img: "/Images/Brevik.webp",        brand: "Coast", model: "COAW-22-02", material: "Plastic", shape: "Round", gender: "Women", frameType: "Full Frame", lensWidth: 49, lensHeight: 42, bridgeWidth: 20, templeLength: 145},
        { id: 4, name: "Minden"         ,   price: "$139.99",   img: "/Images/Minden.webp",        brand: "Carter", model: "CART-18-14", material: "Metal", shape: "Square", gender: "Men", frameType: "Full Frame", lensWidth: 59, lensHeight: 44, bridgeWidth: 20, templeLength: 145   },

        { id: 5, name: "Galata"         ,   price: "$119.99",   img: "/Images/Galata.webp",        brand: "Y13", model: "Y13-22-01", material: "Plastic", shape: "Cat Eye", gender: "Women", frameType: "Full Frame", lensWidth: 48, lensHeight: 34, bridgeWidth: 17, templeLength: 130   },
        { id: 6, name: "Ismailia"       ,   price: "$169.99",   img: "/Images/Ismailia.webp",brand: "Empire", model: "EMP-16-12", material: "Plastic", shape: "Cat Rectangular", gender: "Men", frameType: "Full Frame", lensWidth: 51, lensHeight: 32, bridgeWidth: 17, templeLength: 140   },
        { id: 7, name: "Goba"           ,   price: "$119.99",   img: "/Images/Goba.webp",          brand: "Y13", model: "Y13-21-01", material: "Plastic", shape: "Oval", gender: "Men", frameType: "Full Frame", lensWidth: 43, lensHeight: 31, bridgeWidth: 16, templeLength: 123   },
        { id: 8, name: "Sunny Isles",    price: "$139.99",   img: "/Images/SunnyIsles.webp",      brand: "Elite", model: "ELI-22-02", material: "Plastic", shape: "Rectangular", gender: "Unisex", frameType: "Full Frame", lensWidth: 50, lensHeight: 41, bridgeWidth: 17, templeLength: 145   },

        { id: 9, name: "Sin Name",       price: "$119.99",   img: "/Images/SinName.webp",        brand: "Claire", model: "CLA-18-28", material: "Metal", shape: "Round", gender: "Women", frameType: "Full Frame", lensWidth: 49, lensHeight: 43, bridgeWidth: 19, templeLength: 142   },
        { id: 10,name: "Madrid",         price: "$79.99",    img: "/Images/Madrid.webp",          brand: "Aura", model: "AUM-16-29", material: "Metal", shape: "Rectangular", gender: "Men", frameType: "Full Frame", lensWidth: 53, lensHeight: 34, bridgeWidth: 17, templeLength: 145   },
        { id: 11,name: "Virton",         price: "$164.99",   img: "/Images/Virton.webp",          brand: "Carter", model: "CART-22-06", material: "Plastic", shape: "Square", gender: "Men", frameType: "Full Frame", lensWidth: 55, lensHeight: 36, bridgeWidth: 15, templeLength: 145   },
        { id: 12,name: "Wilmington",     price: "$199.99",   img: "/Images/Wilmington.webp",     brand: "Impression", model: "IMPW-16-23", material: "Plastic", shape: "Rectangular", gender: "Women", frameType: "Full Frame", lensWidth: 52, lensHeight: 37, bridgeWidth: 15, templeLength: 135   },

        { id: 13,name: "Kidwelly",       price: "$169.99",   img: "/Images/Kidwelly.webp",       brand: "Swiss", model: "SW-20-12", material: "Metal", shape: "Round", gender: "Unisex", frameType: "Full Frame", lensWidth: 50, lensHeight: 44, bridgeWidth: 20, templeLength: 145   },
        { id: 14,name: "Ambo",           price: "$199.99",   img: "/Images/Ambo.webp",            brand: "Impression", model: "IMPM-16-21", material: "Plastic", shape: "Rectangular", gender: "Men", frameType: "Full Frame", lensWidth: 55, lensHeight: 36, bridgeWidth: 15, templeLength: 140   },
        { id: 15,name: "Paterson",       price: "$179.99",   img: "/Images/Paterson.webp",        brand: "Empire", model: "EMP-16-72", material: "Plastic", shape: "Rectangular", gender: "Men", frameType: "Full Frame", lensWidth: 57, lensHeight: 37, bridgeWidth: 15, templeLength: 145   },
        { id: 16,name: "Haslingden",     price: "$169.99",   img: "/Images/Haslingden.webp",      brand: "Christian of Paris", model: "COP-15-25", material: "Plastic", shape: "Butterfly", gender: "Women", frameType: "Full Frame", lensWidth: 54, lensHeight: 41, bridgeWidth: 15, templeLength: 135   },
    ];
    const [modal, setModal] = useState(false);
    let [buffer, setBuffer] = useState("null")
    const handleClick = (elem) => {
        setBuffer(elem)
        setModal(!modal)
        console.log('Clicked item:', buffer.name);
        console.log(modal);
    }

    const toggleModal = () => {
        setModal(!modal)
    }
    return (
        <div>
            <UsernavBar/>
            <Grid2
                sx={{ flexGrow: 1, flexShrink:1, paddingLeft: 20}}
            >
                <h1 fontFamily="Roboto">Eyeglasses</h1>
                <h5 fontFamily="Roboto" sx={{padding:500}}>Showing 16 Products</h5>
            </Grid2>

            <Grid2
                container
                spacing={2}
                direction="row"
                alignItems="center"
                justifyContent="center"
                sx={{ flexGrow: 1, flexShrink:1, paddingLeft: 2, paddingRight: 2, paddingBottom:2}}
            >
                {data.map(elem => (
                    <Grid2 item minWidth={100}   key={data.indexOf(elem)}   >
                        <Card >
                            <CardActionArea onClick={ () => handleClick(elem)}>
                            <CardMedia
                                component = "img"
                                alt =   "A pair of glasses"
                                height = "140"
                                src = {`${elem.img}`}
                            />
                            <CardContent>
                                <Grid2 container justifyContent='space-between'>
                                    <Grid2 item>
                                        <Typography variant="h5" gutterBottom fontFamily={"Roboto"} >
                                            {elem.name}
                                        </Typography>
                                    </Grid2>
                                    <Grid2 item>
                                    <Typography variant="h5" gutterBottom fontWeight={'bold'}>
                                            {elem.price}
                                        </Typography>
                                    </Grid2>
                                </Grid2>
                            </CardContent>
                            </CardActionArea>
                        </Card>
                    </Grid2>
                ))}
            </Grid2>

            {modal && (
                <Modal
                data = {buffer}
                bool = {handleClick}
                />
            )}
        </div>
    );
};

export default Frames;