import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";
import moment from "moment";

import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders, retrieveProcessOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { useGlobals } from "../../hooks/useGlobals";
import { OrderStatus } from "../../../lib/enums/order.enum";
import OrderService from "../../services/OrderService";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";

/** REDUX SLICE & SELECTOR */
const processOrdersRetriever = createSelector(
  retrieveProcessOrders,
  (processOrders) => ({ processOrders })
);


interface ProcessOrdersProps {
  setValue: (input: string) => void;
}

export default function ProcessOrders(props: ProcessOrdersProps) {
  const { setValue } = props;
  const { authMember, setOrderBuilder } = useGlobals();
  const { processOrders } = useSelector(processOrdersRetriever);


  // Hendlers

    const finishOrderHenler = async (e: T) => {
    try{
      if(!authMember) throw new Error(Messages.error2)
        // Payment process
      const orderId = e.target.value;
      const input: OrderUpdateInput = {orderId: orderId, orderStatus: OrderStatus.FINISH,};

      const confirmation = window.confirm("Have you proceived your order?")
      if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("3");
       setOrderBuilder(new Date())
      }
    }catch(err){
      console.log(err);
      sweetErrorHandling(err).then();
    }
  }
  return (
    <TabPanel value={"2"}>
      <Stack>
        {processOrders?.map((order: Order) => {
          return (
            <Box key={order._id} className={"order-main-box"}>
              <Box className={"order-box-scroll"}>
                {order?.orderItems.map((item: OrderItem, index2) => {
                  const product: Product =
                    order.productData.filter((ele: Product) => item.productId === ele._id)[0];
                  const imagePath = `${serverApi}/${product.productImages[0]}`;
                  return (
                    <Box key={item._id} className={"orders-name-price"}>
                      <img src={imagePath} className={"order-dish-img"} />
                      <p className={"title-dish"}>{product.productName}</p>
                      <Box className={"price-box"}>
                        <p>{`${product.productPrice}so'm`}</p>
                        <img src={"/icons/close.svg"} />
                        <p>{item.itemQuantity}</p>
                        <img src={"/icons/pause.svg"} />
                        <p style={{ marginLeft: "15px" }}>{`${item.itemQuantity * item.itemPrice}so'm`}</p>
                      </Box>
                    </Box>
                  );
                })}
              </Box>

              <Box className={"total-price-box"}>
                <Box className={"box-total"}>
                  <p>Product price</p>
                  <p>{`${order.orderTotal - order.orderDelivery}so'm`}</p>
                  <img src={"/icons/plus.svg"} style={{ marginLeft: "20px" }} />
                  <p>delivery cost</p>
                  <p>{`${order.orderDelivery}so'm`}</p>
                  <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} />
                  <p>Total</p>
                  <p>{`${order.orderTotal}so'm`}</p>
                  <p className={"data-compl"}>
                    {moment().format("YY-MM-DD HH:mm")}
                  </p>
                  <Button value={order._id} variant="contained" className={"verify-button"} onClick={finishOrderHenler}>
                    Verify to Fulfil
                  </Button>
                </Box>
              </Box>
            </Box>
          );
        })}

        {!processOrders || processOrders.length === 0 && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img src={"/icons/noimage-list.svg"} style={{ width: 300, height: 300 }} />
          </Box>
        )}
      </Stack>
    </TabPanel>
  )
};


// import React from "react";
// import { Box, Stack } from "@mui/material";
// import Button from "@mui/material/Button";
// import TabPanel from "@mui/lab/TabPanel";
// import moment from "moment";

// export default function ProcessOrders() {
//   return (
//     <TabPanel value={"2"}>
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
//               <p className={"data-compl"}>
//                 {moment().format("YY-MM-DD HH:mm")}
//               </p>
//             </Box>
//             <Button variant="contained" className={"verify-button"}>
//               VERIFY TO FULFIL
//             </Button>
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
//               <p className={"data-compl"}>
//                 {moment().format("YY-MM-DD HH:mm")}
//               </p>
//             </Box>
//             <Button variant="contained" className={"verify-button"}>
//               VERIFY TO FULFIL
//             </Button>
//           </Box>
//         </Box>
//       </Stack>
//     </TabPanel>
//   );
// }