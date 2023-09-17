import { useRef, useState } from "react";


import { Button } from "primereact/button"
import { InputNumber } from "primereact/inputnumber"
import { useOrders } from "../hooks";
import { Toast } from "primereact/toast";

const QuantityAdd = ({product, order, onSuccess, onCancel}) => {
    const [currentBasket, addOrder] = useOrders();
    const availableStock = product.stock - (order?.count || 0);

    const summaryTemplate = () => {
        return (
            <div className="text-white border-700 border-1 p-2 mb-4">
                <table>
                    <tbody>
                        {order?.count ?
                            <tr>
                                <td>In store</td>
                                <td className="px-1">:</td>
                                <td>{product.stock}</td>
                            </tr>
                            :null
                        }
                        {order?.count ?
                            <tr>
                                <td>In basket</td>
                                <td className="px-1">:</td>
                                <td>{order.count}</td>
                            </tr>
                            :null
                        }
                        <tr>
                            <td>Available</td>
                            <td className="px-1">:</td>
                            <td>{availableStock}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <QuantityForm 
            currentBasket={currentBasket}
            product={product}
            onSubmit={addOrder}
            onSuccess={onSuccess}
            onCancel={onCancel}
            submitLabel="Add"
            inputLabel="Add more"
            availableStock={availableStock}
            summaryTemplate={summaryTemplate}
        />
    )
}

const QuantityEdit = ({product, availableStock, defaultValue, onSuccess, onCancel}) => {
    const [currentBasket,,changeOrder] = useOrders();

    const summaryTemplate = () => {
        return (
            <div className="text-white border-700 border-1 p-2 mb-4">
                <table>
                    <tbody>
                        <tr>
                            <td>Available</td>
                            <td className="px-1">:</td>
                            <td>{availableStock}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }

    return (
        <QuantityForm 
            currentBasket={currentBasket}
            product={product}
            onSubmit={changeOrder}
            onSuccess={onSuccess}
            onCancel={onCancel}
            defaultValue={defaultValue}
            inputLabel="Change quantity"
            submitLabel="Save"
            availableStock={availableStock}
            summaryTemplate={summaryTemplate}
        />
    )
}

const QuantityForm = ({currentBasket, product, defaultValue, onSubmit, onSuccess, onCancel, submitLabel="Submit", inputLabel="Quantity", availableStock, summaryTemplate}) => {
    const toast = useRef(null);
    const defaultInput = (currentBasket?.find(order=>order.product===product.id)?.count||0)+(defaultValue||1)
    const [count,setCount] = useState(defaultInput);

    const handleSuccess = () => {
        onSuccess && onSuccess();
        setCount(defaultInput);
        toast.current.show({severity:"success", summary: "Added to the cart", detail:product.title, life: 1000});
    }
    const handleCancel = () => {
        onCancel && onCancel();
        setCount(defaultInput)
    }
    
    return (
        <>
            <Toast ref={toast} position="bottom-left"/>
            {summaryTemplate && summaryTemplate()}
            <div className="mb-4">
                <div className="text-white mb-1">{inputLabel}</div>
                <InputNumber
                    autoFocus
                    value={count} 
                    onChange={(e) => setCount(e.value)} 
                    useGrouping={false} 
                    showButtons 
                    min={1}
                    allowEmpty={false}
                    disabled={!availableStock}
                />
            </div>
            <h3 className="text-white mb-4">Total: ${product?.price*count}</h3>
            <div className="grid">
                <div className="col-6">
                    <Button
                        className="w-full p-button-primary"
                        disabled={count > availableStock}
                        label={submitLabel}
                        onClick={()=>onSubmit(product, count, handleSuccess)}
                    />
                </div>
                <div className="col-6">
                    <Button 
                        className="w-full p-button-secondary" 
                        label="Cancel"
                        onClick={handleCancel}
                    />
                </div>
            </div>
        </>
    )
}

export { QuantityAdd, QuantityEdit }