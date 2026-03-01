import React from "react";
import { Box, Container, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import CardCover from "@mui/joy/CardCover";
import CardContent from "@mui/joy/CardContent";
import Typography from "@mui/joy/Typography";
import { CssVarsProvider } from "@mui/joy/styles";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

import SwiperCore, { Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePopularDishes } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";

// 🔥 Autoplay modulini faollashtiramiz
SwiperCore.use([Autoplay]);

// 🔹 Selector faqat barcha popular ovqatlarni qaytaradi
const popularDishesRetriever = createSelector(
  retrievePopularDishes,
  (popularDishes) => ({ popularDishes })
);

export default function PopularDishes() {
  const { popularDishes } = useSelector(popularDishesRetriever);

  // 🔹 Barcha ovqatlarni ishlatamiz, takrorlamaymiz
  const fixedSlides = popularDishes;

  return (
    <div className="popular-dishes-frame">
      <Container>
        <Stack className="popular-section">
          <Box className="category-title">Popular Dishes</Box>

          <div className="cards-frame">
            {fixedSlides.length !== 0 ? (
              <Swiper
                spaceBetween={20}
                slidesPerView={3}
                loop={fixedSlides.length > 3} // agar 3 tadan ko'p bo'lsa loop ishlaydi
                speed={800}
                autoplay={{
                  delay: 2000,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: false, // Hoverda ham to‘xtamaydi
                }}
                breakpoints={{
                  320: { slidesPerView: 1 },
                  640: { slidesPerView: 1 },
                  768: { slidesPerView: 2 },
                  1024: { slidesPerView: 3 },
                }}
              >
                {fixedSlides.map((product: Product, index) => {
                  const imagePath = `${serverApi}/${product.productImages[0]}`;

                  return (
                    <SwiperSlide key={index}>
                      <CssVarsProvider>
                        <Card className="card" variant="outlined">
                          <Box sx={{ position: "relative", height: "300px" }}>
                            <CardCover>
                              <img
                                src={imagePath}
                                alt={product.productName}
                                style={{
                                  objectFit: "cover",
                                  width: "100%",
                                  height: "100%",
                                }}
                              />
                            </CardCover>

                            {/* Views badge */}
                            <CardContent
                              sx={{
                                position: "absolute",
                                top: 8,
                                right: 8,
                                padding: 0,
                              }}
                            >
                              <Typography
                                sx={{
                                  fontWeight: "md",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  backgroundColor: "rgba(0,0,0,0.5)",
                                  borderRadius: "12px",
                                  padding: "4px 8px",
                                  fontSize: "12px",
                                }}
                              >
                                {product.productViews}
                                <VisibilityIcon
                                  sx={{ fontSize: "16px", marginLeft: "4px" }}
                                />
                              </Typography>
                            </CardContent>
                          </Box>

                          {/* Text content */}
                          <CardContent sx={{ padding: "16px" }}>
                            <Stack spacing={1}>
                              <Typography
                                level="h3"
                                fontSize="md"
                                fontWeight="bold"
                              >
                                {product.productName}
                              </Typography>

                              <Typography
                                level="body-sm"
                                sx={{
                                  display: "flex",
                                  color: "text.secondary",
                                  alignItems: "flex-start",
                                }}
                              >
                                <DescriptionOutlinedIcon
                                  sx={{
                                    fontSize: "16px",
                                    marginRight: "6px",
                                    marginTop: "1px",
                                  }}
                                />
                                {product.productDesc}
                              </Typography>

                              <Typography
                                level="title-lg"
                                sx={{
                                  color: "primary.plainColor",
                                  fontWeight: "bold",
                                  marginTop: "8px",
                                }}
                              >
                                {product.productPrice} so'm
                              </Typography>
                            </Stack>
                          </CardContent>
                        </Card>
                      </CssVarsProvider>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            ) : (
              <Box className="no-data">
                New products are not available!
              </Box>
            )}
          </div>
        </Stack>
      </Container>
    </div>
  );
}
