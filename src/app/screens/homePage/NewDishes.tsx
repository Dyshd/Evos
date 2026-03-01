import React from "react";
import { Box, Container, Stack } from "@mui/material";
import AspectRatio from "@mui/joy/AspectRatio";
import Card from "@mui/joy/Card";
import CardOverflow from "@mui/joy/CardOverflow";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Divider from "../../components/divider";
import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveNewDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { ProductCollection } from "../../../lib/enums/product.enum";
/** REDUX SLICE & SELECTOR */
const newDishesRetriever = createSelector(retrieveNewDishes, (newDishes) => ({
  newDishes,
})
);

export default function NewDishes() {

  const { newDishes } = useSelector(newDishesRetriever);
  console.log("newDishes:", newDishes)
  return (
    <div className={"new-products-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Yangi Taomlar
          </Box>
          <Stack className={"card-frame"}>
            <CssVarsProvider>
              {newDishes.length !== 0 ? (
                newDishes.map((product: Product) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`
                  const sizeVolume = product.productCollection === ProductCollection.DRINK ? product.productVolume + "l" : product.productSize + " size";
                  return (
                    <Card key={product._id} variant="outlined" className={"card"}>
                      <CardOverflow>
                        <div className="product-sale">{sizeVolume}</div>
                        <AspectRatio ratio="1">
                          <img src={imagePath} alt="" />
                        </AspectRatio>
                      </CardOverflow>

                      <CardOverflow variant="soft" className="products-detail">
                        <Stack className="info">

                          <Stack className="left" flexDirection={"row"}>
                            <Typography className="title">
                              {product.productName}
                            </Typography>

                            <div className="divider" />

                            <Typography className="price">
                              {`${product.productPrice} so'm`}
                            </Typography>
                          </Stack>

                          <Stack>
                            <Typography className="views">
                              {product.productViews}
                              <VisibilityIcon sx={{ fontSize: 20 }} />
                            </Typography>
                          </Stack>

                        </Stack>
                      </CardOverflow>

                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">New products are not available!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
