import { useEffect, useState } from "react";
import { useOrders } from "../hooks";
import { BasketCard } from "./basketCard";
import { QuantityEdit } from "./quantityForm";

import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Sidebar } from "primereact/sidebar";

const UserBasketHeader = ({currentBasket}) => {
    const [buyNow, setBuyNow] = useState(false)
    const [,,,,emptyBasket] = useOrders()
    const totalCount = currentBasket?.reduce((sum,order)=>sum + order.count,0)||0
    const totalCost = currentBasket?.reduce((sum,order)=>{
        const orderCost = (order?.product?.price||0)*order.count;
        return sum + orderCost
    }, 0)
    const totalOriginalPrice = currentBasket?.reduce((sum,order)=>{
        const orderPrice = order.product.price || 0;
        const orderDiscountPercentage = (order.product.discountPercentage || 0)
        const originalPrice = orderDiscountPercentage? Math.round((orderPrice/(100-orderDiscountPercentage))*100):orderPrice;
        return sum+originalPrice
    },0)
    const totalDiscount = currentBasket?.reduce((sum,order)=>{
        const orderPrice = order.product.price || 0;
        const orderDiscountPercentage = (order.product.discountPercentage || 0)
        const originalPrice = orderDiscountPercentage? Math.round((orderPrice/(100-orderDiscountPercentage))*100):orderPrice;
        const discount = originalPrice-orderPrice;
        return sum+discount
    },0)
    return (
        <>
            <table>
                <tbody>
                    <tr>
                        <td>Item count</td>
                        <td className="px-1">:</td>
                        <td className="font-bold">{totalCount}</td>
                    </tr>
                    <tr>
                        <td>Total price</td>
                        <td className="px-1">:</td>
                        <td className="font-bold">${totalOriginalPrice}</td>
                    </tr>
                    {totalDiscount?
                    <tr>
                        <td>Total discount</td>
                        <td className="px-1">:</td>
                        <td className="font-bold">${totalDiscount}</td>
                    </tr>:null}
                    <tr>
                        <td>After discount</td>
                        <td className="px-1">:</td>
                        <td className="font-bold">${totalCost}</td>
                    </tr>
                </tbody>
            </table>
            <div className="grid mt-1 mb-2 px-1">
                <div className="col-6">
                    <Button
                        className="p-button-primary p-button-sm w-full" 
                        label="Buy now"
                        onClick={()=>setBuyNow(true)}
                    />
                </div>
                <div className="col-6">
                    <Button 
                        className="p-button-secondary p-button-sm w-full"
                        label="Cancel all" 
                        onClick={()=>emptyBasket()}
                    />
                </div>
            </div>
            <Sidebar
                className="game-over"
                visible={buyNow}
                fullScreen
                onHide={()=>{
                    setBuyNow(false)
                }}
            >
                <div className="game-over-container flex w-full h-full justify-content-center align-items-center">
                    <div className="game-over-info text-center text-white p-4">
                        <h1>Game Over</h1>
                        <h2>You were about to waste  ${totalCost}.</h2>
                        <h2>Lucky you! We do not have payment form.</h2>
                        <h4 className="mt-6">Press ESC or <span className="underline" style={{cursor:"pointer"}} onClick={()=>setBuyNow(false)}>click here</span> to get back!</h4>
                    </div>
                </div>
            </Sidebar>
        </>
    )
}

const UserBasket = () => {
    const [currentBasket,,,removeOrder,,loading] = useOrders();
    const [showBasket, setShowBasket] = useState(false);
    const [editingOrder, setEditingOrder] = useState(null);

    useEffect(()=>{
        if (!loading && currentBasket?.length===0) {
            setShowBasket(false);
            setEditingOrder(false);
        }
    },[currentBasket?.length])

    const actions = (item) => {
        return [
            {
                label: "Change quantity",
                icon: "pi pi-refresh",
                command: () => setEditingOrder(item)
            },
            {
                label: "Remove from cart",
                icon: "pi pi-times",
                command: () => {
                    if (window.confirm(
                        `Are you sure? This will remove ${item.product.title} from your basket.`
                    )) {
                        removeOrder(item.product)
                    }
                }
            }
        ]
    }

    return (
        <>
                <Button 
                    type="button" 
                    label="Cart" 
                    icon="pi pi-shopping-cart" 
                    badge={currentBasket?.length||"0"}
                    badgeClassName="p-badge-danger"
                    disabled={!currentBasket?.length}
                    onClick={()=>setShowBasket(true)}
                />
            <Sidebar
                className="basket-sidebar bg-blue-50"
                icons={<div className="text-left text-secondary font-bold flex-grow-1">Summary</div>}
                visible={showBasket}
                position="right" 
                onHide={() => {
                    setShowBasket(false);
                    setEditingOrder(null)
                }}
            >
                <div className="pb-2"><UserBasketHeader currentBasket={currentBasket} /></div>
                <div className="text-left text-secondary font-bold">Your items</div>
                {currentBasket?.map((order,index) => 
                    <div key={order.product?.id} className={`py-4 px-1 ${index>0?"border-top-2 border-gray-300":""}`}>
                        <BasketCard order={order} actions={actions}/>
                        {editingOrder&&
                            <Dialog
                                headerClassName="surface-900 text-white"
                                contentClassName="surface-900"
                                header={<div style={{maxWidth:"200px"}}>{editingOrder?.product?.title}</div>}
                                visible={Boolean(editingOrder)} 
                                onHide={()=>setEditingOrder(null)}
                            >
                                <QuantityEdit
                                    product={editingOrder.product}
                                    availableStock={editingOrder.product.stock}
                                    defaultValue={editingOrder.count}
                                    onSuccess={()=>setEditingOrder(null)}
                                    onCancel={()=>setEditingOrder(null)}
                                />
                            </Dialog>
                        }
                    </div>
                )}
            </Sidebar>
        </>
    )
}
export { UserBasket };