import { Box, Container, Divider, Stack } from "@mui/material";
import Card from "@mui/joy/Card";
import { CssVarsProvider, Typography } from "@mui/joy";
import CardOverflow from "@mui/joy/CardOverflow";
import AspectRatio from "@mui/joy/AspectRatio";
// import VisibilityIcon from "@mui/icons-material/Visibility";


import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveTopUsers } from "./selector";
import { Product } from "../../../lib/types/product";
import { serverApi } from "../../../lib/config";
import { Member } from "../../../lib/types/member";
/** REDUX SLICE & SELECTOR */
const topUsersRetriever = createSelector(retrieveTopUsers,(topUsers) => ({
   topUsers, })
);


export default function ActiveUsers() {
      const { topUsers } = useSelector(topUsersRetriever);
  
  return (
    <div className={"active-user-frame"}>
      <Container>
        <Stack className={"main"}>
          <Box className={"category-title"}>Activ Foydalanuvchilar</Box>
          <Stack className={"cards-frame"}>
            <CssVarsProvider>
              {topUsers.length !== 0 ? (
                topUsers.map((member: Member) => { 
                  const imagePath = `${serverApi}/${member.memberImage}`
                  return (
                    <Card key={member._id} variant="outlined" className={"card"}>
                      <CardOverflow>
                        <AspectRatio ratio="1">
                          <img src={imagePath} alt="" />
                        </AspectRatio>
                      </CardOverflow>

                        <Stack className="info">
                          <Stack flexDirection={"row"}>
                            <Typography className={"title"}>
                              {member.memberNick}
                            </Typography>
                          </Stack>
                          <Stack>
                           
                          </Stack>
                        </Stack>
                      
                    </Card>
                  );
                })
              ) : (
                <Box className="no-data">Active users are not available!</Box>
              )}
            </CssVarsProvider>
          </Stack>
        </Stack>
      </Container>
    </div>
  );
}
