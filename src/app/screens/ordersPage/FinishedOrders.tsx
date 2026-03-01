import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrieveFinishedOrders } from "./selector";
import { serverApi } from "../../../lib/config";
import { Order, OrderItem } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
/** REDUX SLICE & SELECTOR */
const finishedOrdersRetriever = createSelector(
  retrieveFinishedOrders,
  (finishedOrders) => ({ finishedOrders })
);
export default function FinishedOrders() {
  const { finishedOrders } = useSelector(finishedOrdersRetriever);

  return (
    <TabPanel value={"3"}>
      <Stack>
        {finishedOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {order?.orderItems.map((item: OrderItem) => {
                  const product: Product = order.productData.filter((ele: Product) => item.productId === ele._id)[0];
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className={"orders-name-price"}>
                      <img
                        src={imagePath}
                        className={"order-dish-img"}
                      />
                      <p className={"title-dish"}>{product.productName}</p>

                      <Box className={"price-box"}>
                        <p>{`${item.itemPrice} so'm`}</p>
                        <img src={"/icons/close.svg"} />
                        <p>{item.itemQuantity}</p>
                        <img src={"/icons/pause.svg"} />
                        <p style={{ marginLeft: "15px" }}>
                          {`${item.itemQuantity * item.itemPrice} so'm`}
                        </p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p>{`${order.orderTotal - order.orderDelivery} so'm`}</p>
                  <img
                    src={"/icons/plus.svg"}
                    style={{ marginLeft: "20px" }}
                  />
                  <p>deliveri cost</p>
                  <p>{`${order.orderDelivery} so'm`}</p>
                  <img
                    src={"/icons/pause.svg"}
                    style={{ marginLeft: "20px" }}
                  />
                  <p>Total</p>
                  <p>{`${order.orderTotal} so'm`}</p>
                </Box>
              </Box>
            </Box>
          );
        })}

        {(!finishedOrders || finishedOrders.length === 0) && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
            />
          </Box>
        )}
      </Stack>
    </TabPanel>
  );
}

{/* 
// import React from "react";
// import { Box, Stack } from "@mui/material";
// import TabPanel from "@mui/lab/TabPanel";

// export default function FinishedOrders() {
//   return (
//     <TabPanel value={"3"}>
//       <Stack>
//         <Box className={"order-main-box"}>
//           <Box className={"order-box-scroll"}>
//             {['Fried chicken', 'Winner', 'Stack'].map((item, index) => (
//               <Box key={index} className={"orders-name-price"}>
//                 <img src={"/img/lavash.webp"} className={"order-dish-img"} />
//                 <p className={"title-dish"}>{item}</p>
//                 <Box className={"price-box"}>
//                   <p>$10</p>
//                   <img src={"/icons/close.svg"} />
//                   <p>2</p>
//                   <img src={"/icons/pause.svg"} />
//                   <p style={{ marginLeft: "15px" }}>$20</p>
//                 </Box>
//               </Box>
//             ))}
//           </Box>

//           <Box className={"total-price-box"}>
//             <Box className={"box-total"}>
//               <p>Product price</p>
//               <p>$60</p>
//               <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
//               <p>Delivery cost</p>
//               <p>$5</p>
//               <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} />
//               <p>Total</p>
//               <p>$65</p>
//             </Box>
//           </Box>
//         </Box>
//         <Box className={"order-main-box"}>
//           <Box className={"order-box-scroll"}>
//             {['Fried chicken', 'Winner', 'Stack'].map((item, index) => (
//               <Box key={index} className={"orders-name-price"}>
//                 <img src={"/img/lavash.webp"} className={"order-dish-img"} />
//                 <p className={"title-dish"}>{item}</p>
//                 <Box className={"price-box"}>
//                   <p>$10</p>
//                   <img src={"/icons/close.svg"} />
//                   <p>2</p>
//                   <img src={"/icons/pause.svg"} />
//                   <p style={{ marginLeft: "15px" }}>$20</p>
//                 </Box>
//               </Box>
//             ))}
//           </Box>

//           <Box className={"total-price-box"}>
//             <Box className={"box-total"}>
//               <p>Product price</p>
//               <p>$60</p>
//               <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
//               <p>Delivery cost</p>
//               <p>$5</p>
//               <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} />
//               <p>Total</p>
//               <p>$65</p>
//             </Box>
//           </Box>
//         </Box>
//       </Stack>
//     </TabPanel>
//   );
// } */}