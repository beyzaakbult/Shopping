import { ProductImages } from "./productImages";

import { Rating } from 'primereact/rating';
import { ProgressSpinner } from 'primereact/progressspinner';
import { AddToBasket } from "./addToBasket";

const ProductCard = ({product, order, loading}) => {
    const {price, discountPercentage, stock} = product;
    const currentlyInBasket = order?.count && order?.product?.id === product?.id ? order.count : 0;
    const availableStock = stock && stock > currentlyInBasket ? stock - currentlyInBasket : 0;
    const originalPrice = discountPercentage? Math.round((price/(100-discountPercentage))*100):price
    const additionalInfo = (
        <div>
            <div className="flex flex-wrap justify-content-between  align-items-center">
                <div className="flex align-items-center"><i className="pi pi-tag mr-2"></i><span className="product-category">{product.category}</span></div>
                <div>{product?.brand}</div>
            </div>
        </div>
    )
    const header = (
        <div>
            <h2 className="mt-0 mb-4">{product.title}</h2>
            <div className="overflow-y-auto flex align-items-center justify-content-center" style={{height:"200px"}}>
                {loading?<ProgressSpinner/>:<img src={`${product.thumbnail}`} alt={product.title} width="260"/>}
            </div>
            {product?.images?.length?<div className="my-2"><ProductImages product={product}/></div>:null}
        </div>
    )
    const footer = (
        <>
            <div className={`text-center mb-4 ${!availableStock?"text-red-400":""}`}>{availableStock?`${availableStock} in stock`: "Out of stock"}</div>
            <div className="flex justify-content-between align-items-center">
                <div className="flex align-items-center">
                    <h2 className="my-0 mr-2">${product.price}</h2>
                    {product?.discountPercentage?<div className="line-through mr-2">${originalPrice}</div>:null}
                </div>
                <AddToBasket product={product} order={order} />
            </div>
        </>
    )
    return (
        <div className={`border-1 border-gray-300 border-round-md bg-white p-2 h-full`} style={{width:"300px"}}>
            <div className="flex flex-column h-full">
                <div>
                    <div className="mb-4">{additionalInfo}</div>
                    <div className="mb-4">{header}</div>
                </div>
                <div className="flex-grow-1 flex flex-column justify-content-evenly">
                    <div>{product.description}</div>
                </div>
                <div>
                    <div className="flex justify-content-center my-4">
                        <Rating 
                            value={product.rating}
                            readOnly cancel={false}
                            tooltip={product.rating}
                        />
                    </div>
                    <div>{footer}</div>
                </div>
            </div>
        </div>
    )
}

export { ProductCard }