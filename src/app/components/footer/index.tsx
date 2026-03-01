import React from "react";
import { Box, Container, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "styled-components";

const Footers = styled.div`
  width: 100%;
  height: 590px;
  display: flex;
  background:#ebedf8 ;
  background-size: cover;
`;

export default function Footer() {
  const authMember = null;

  return (
    <Footers>
      <Container>
        <Stack flexDirection={"row"} sx={{ mt: "94px" }}>
          <Stack flexDirection={"column"} style={{ width: "340px" }}>
            <Box>
              <img width={"100px"} src={"/img/evoss.png"} />
            </Box>
            <Box className={"foot-desc-txt"}>
              Xodimlarimizga yaratib berayotgan sharoitimiz tufayli bugungi kunda kompaniyamiz O‘zbekistondagi talaba va yoshlar uchun eng yirik ish beruvchilardan biri ekanligidan haqli ravishda faxrlanamiz.
            </Box>
            <Box className="sns-context">
              <img src={"/icons/facebook.svg"} />
              <img src={"/icons/twitter.svg"} />
              <a
                href="https://www.instagram.com/muhammad_zoirovv/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src="/icons/instagram.svg"
                  alt="Instagram"
                  style={{ cursor: "pointer" }}
                />
              </a>
              <img src={"/icons/youtube.svg"} />
            </Box>
          </Stack>
          <Stack sx={{ ml: "288px" }} flexDirection={"row"}>
            <Stack>
              <Box>
                <Box className={"foot-category-title"}>Bo'limlar</Box>
                <Box className={"foot-category-link"}>
                  <Link to="/">Bosh Sahifa</Link>
                  <Link to="/products">Mahsulot</Link>
                  {authMember && <Link to="/orders">Buyurtma</Link>}
                  <Link to="/help">Yordam</Link>
                </Box>
              </Box>
            </Stack>
            <Stack sx={{ ml: "100px" }}>
              <Box>
                <Box className={"foot-category-title"}>Find us</Box>
                <Box
                  flexDirection={"column"}
                  sx={{ mt: "20px" }}
                  className={"foot-category-link"}
                  justifyContent={"space-between"}
                >
                  <Box flexDirection={"row"} className={"find-us"}>
                    <span>L.</span>
                    <div>Downtown, Dubai</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>P.</span>
                    <div>+998 97 521-31-30</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>E.</span>
                    <div>devexuz@gmail.com</div>
                  </Box>
                  <Box className={"find-us"}>
                    <span>H.</span>
                    <div>Visit 24 hours</div>
                  </Box>
                </Box>
              </Box>
            </Stack>
          </Stack>
        </Stack>
        <Stack
          style={{ border: "1px solid #C5C8C9", width: "100%", opacity: "0.2" }}
          sx={{ mt: "80px" }}
        ></Stack>
        <Stack className={"copyright-txt"}>
          ©  Evos 2006 - 2025 All rights reserved
        </Stack>
      </Container>
    </Footers>
  );
}
