import { useState } from "react";
import { QuantityAdd } from "./quantityForm";

import { Button } from "primereact/button";
import { Dialog } from 'primereact/dialog';

const AddToBasket = ({product, order }) => {
    const [showForm, setShowForm] = useState(false);
    const currentlyInBasket = order?.count && order?.product?.id === product?.id ? order.count : 0;
    const availableStock = product.stock && product.stock > currentlyInBasket ? product.stock - currentlyInBasket : 0;
    return (
        <>
            
            <Button 
                className="p-button-sm" 
                icon="pi pi-shopping-cart" 
                disabled={!availableStock}
                onClick={()=>setShowForm(true)}
            >
                <div className="ml-2 white-space-nowrap font-bold">Add to Cart</div>
            </Button>
            <Dialog
                headerClassName="surface-900 text-white"
                contentClassName="surface-900"
                header={<div style={{maxWidth:"200px"}}>{product.title}</div>}
                visible={showForm} 
                onHide={()=>setShowForm(false)}
            >
                <QuantityAdd
                    product={product}
                    order={order}
                    availableStock={availableStock}
                    onSuccess={()=>setShowForm(false)}
                    onCancel={()=>setShowForm(false)}
                />
            </Dialog>
        </>
    )
}
export { AddToBasket };