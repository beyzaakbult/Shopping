import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { ProgressSpinner } from "primereact/progressspinner";
import { useRef, useState } from "react";
import { useGet, useOrders } from "../hooks";

const BasketCard = ({order, actions}) => {
    const menuRef = useRef();
    const [,,,removeOrder,,orderLoading] = useOrders();
    const { product, count } = order || {};
    const [removedProduct, setRemovedProduct] = useState(null);
    const [productData, productLoading] = useGet(`https://dummyjson.com/products/${product.id}`, null, {
        onFail: () => {
            setRemovedProduct(order.product);
            removeOrder(order.product)
        }
    });

    if (productLoading||orderLoading) {
        return <div className="text-center"><ProgressSpinner /></div>
    }
    
    const orderActions = actions && actions(order)
    return (
        <>
            <div className="flex align-items-start">
                <div style={{width:"50px",height:"50px"}}>
                {productLoading ?
                    <ProgressSpinner/>
                    :
                    !productData?.thumbnail ?<i className="pi pi-exclamation-circle mr-2 text-5xl text-red-300"></i>
                    :
                    <img className="w-full h-full" src={`${productData?.thumbnail}`} alt={product.title} style={{borderRadius:"50%", objectFit:"cover"}}/>
                }
                </div>
                <div className="px-2 flex-grow-1">
                    <h4 className="my-0">{product.title}</h4>
                    <div>{product.brand}</div>
                </div>
                {!removedProduct &&
                    <div className="mx-1">
                        <Button 
                            icon="pi pi-bars" 
                            className="p-button-secondary p-button-text p-button-sm p-0"
                            style={{width:"20px"}} 
                            onClick={(e) => menuRef.current.toggle(e)} 
                            aria-controls="popup_menu" 
                            aria-haspopup 
                        />
                        {orderActions &&
                            <Menu
                                ref={menuRef}
                                id="popup_menu"
                                popup
                                model={orderActions} 
                            />
                        }
                    </div>
                }
            </div>
            {removedProduct ?
                <div className="px-2">
                    <p className="text-red-400 font-bold">This product is removed from the store.</p>
                    <p>Your order is automatically cancelled and will disappear next time when you open your basket.</p>
                </div>
                :
                <div className="m-1">
                    <table>
                        <tbody>
                            <tr>
                                <td>Price</td>
                                <td className="px-1">:</td>
                                <td>${product.price}</td>
                            </tr>
                            <tr>
                                <td>Quantity</td>
                                <td className="px-1">:</td>
                                <td>{count}</td>
                            </tr>
                            <tr className="font-bold">
                                <td>Total</td>
                                <td className="px-1">:</td>
                                <td>${product.price * count}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            }
        </>
    )
}
export { BasketCard };