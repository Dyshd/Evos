import React from "react";
import { Box, Stack } from "@mui/material";
import Button from "@mui/material/Button";
import TabPanel from "@mui/lab/TabPanel";


import { useSelector } from "react-redux";
import { createSelector } from "reselect";
import { retrievePausedOrders } from "./selector";
import { Messages, serverApi } from "../../../lib/config";
import { Order, OrderItem, OrderUpdateInput } from "../../../lib/types/order";
import { Product } from "../../../lib/types/product";
import { sweetErrorHandling } from "../../../lib/sweetAlert";
import { T } from "../../../lib/types/common";
import { OrderStatus } from "../../../lib/enums/order.enum";
import { useGlobals } from "../../hooks/useGlobals";
import { Message } from "@mui/icons-material";
import OrderService from "../../services/OrderService";
/** REDUX SLICE & SELECTOR */
const pausedOrdersRetriever = createSelector(
  retrievePausedOrders,
  (pausedOrders) => ({ pausedOrders })
);

interface PausedOrdersProps{
  setValue: (input: string) => void;
}

export default function PausedOrders(props: PausedOrdersProps) {
      const {setValue} = props;    
      const {authMember, setOrderBuilder} = useGlobals();
      const { pausedOrders } = useSelector(pausedOrdersRetriever);
  // Handlers

  const deleteOrderHenler = async (e: T) => {
    try{
      if(!authMember) throw new Error(Messages.error2)
      const orderId = e.target.value;
      const input: OrderUpdateInput = {orderId: orderId, orderStatus: OrderStatus.DELETE,};

      const confirmation = window.confirm("Do you want to delete order?")
      if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
       setOrderBuilder(new Date())
      }
    }catch(err){
      console.log(err);
      sweetErrorHandling(err).then();
    }
  }


    const processOrderHenler = async (e: T) => {
    try{
      if(!authMember) throw new Error(Messages.error2)
        // Payment process
      const orderId = e.target.value;
      const input: OrderUpdateInput = {orderId: orderId, orderStatus: OrderStatus.PROCESS,};

      const confirmation = window.confirm("Do you want to proceed whith payment?")
      if(confirmation) {
        const order = new OrderService();
        await order.updateOrder(input);
        setValue("2");
       setOrderBuilder(new Date())
      }
    }catch(err){
      console.log(err);
      sweetErrorHandling(err).then();
    }
  }

  return (
    <TabPanel value={"1"}>
      <Stack>
        {pausedOrders?.map((order: Order) => {
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
                        <p>{`${item.itemPrice}so'm`}</p>
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
                  <p>Delivery cost</p>
                  <p>{order.orderDelivery}</p>
                  <img src={"/icons/pause.svg"} style={{ marginLeft: "20px" }} />
                  <p>Total</p>
                  <p>{`${order.orderTotal}so'm`}</p>
                </Box>
                <Button
                value = {order._id}
                  variant="contained"
                  color="secondary"
                  className={"cencel-button"}
                  onClick={deleteOrderHenler}
                >
                  Cencel
                </Button>
                <Button value={order._id} variant="contained" className={"pay-button"} onClick={processOrderHenler}>
                  Payment
                </Button>
              </Box>
            </Box>
          );
        })}

        {!pausedOrders || (pausedOrders.length === 0 && (
          <Box display={"flex"} flexDirection={"row"} justifyContent={"center"}>
            <img
              src={"/icons/noimage-list.svg"}
              style={{ width: 300, height: 300 }}
            />
          </Box>
        ))}
      </Stack>
    </TabPanel>
  );
}




// import React from "react";
// import { Box, Stack } from "@mui/material";
// import Button from "@mui/material/Button";
// import TabPanel from "@mui/lab/TabPanel";

// import { useSelector } from "react-redux";
// import { createSelector } from "reselect";
// import { retrievePausedOrders} from "./selector";
// import { serverApi } from "../../../lib/config";
// import { Order } from "../../../lib/types/order";
// /** REDUX SLICE & SELECTOR */
// const pausedOrdersRetriever = createSelector(
//   retrievePausedOrders,
//   (pausedOrders) => ({ pausedOrders })
// );

// export default function PausedOrders() {
//       const { pausedOrders } = useSelector(pausedOrdersRetriever);
  
//   return (
//     <TabPanel value={"1"}>
//       <Stack>
//         <Box className={"order-main-box"}>
//           <Box className={"order-box-scroll"}>
//             {pausedOrders?.map((order: Order) => (
//               <Box key={order._id} className={"orders-name-price"}>
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
//             <Button
//               variant="contained"
//               color="secondary"
//               className={"cancel-button"}
//             >
//               CANCEL
//             </Button>
//             <Button variant="contained" className={"pay-button"}>
//               PAYMENT
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
//             </Box>
//             <Button
//               variant="contained"
//               color="secondary"
//               className={"cancel-button"}
//             >
//               CANCEL
//             </Button>
//             <Button variant="contained" className={"pay-button"}>
//               PAYMENT
//             </Button>
//           </Box>
//         </Box>
//       </Stack>
//     </TabPanel>
//   );
// }