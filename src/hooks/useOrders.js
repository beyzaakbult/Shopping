import { useEffect, useState } from "react"

export const useOrders = () => {
    const [loading, setLoading] = useState(false);
    const [currentBasket, setCurrentBasket] = useState(JSON.parse(localStorage.getItem('cart'))|| []);
    const changeOrder = (product, count, onSuccess) => {
        setLoading(true);
        const itemInBasket = currentBasket?.find(item=>item?.count && item?.product?.id===product?.id);
        const { images, thumbnail, ...productInfo } = product
        let newItem = { count:count, product:productInfo };
        let newList = [...currentBasket];
        if (itemInBasket) {
            const itemIndex = currentBasket?.findIndex(item=>item?.count && item?.product?.id===product?.id);
            newList.splice(itemIndex,1,newItem)
        }
        else {
            newList.push(newItem)
        }
        localStorage.setItem('cart', JSON.stringify(newList));
        window.dispatchEvent( new Event('storage') );
        setCurrentBasket(JSON.parse(localStorage.getItem('cart'))||[])
        onSuccess && onSuccess();
        setLoading(false)
    }
    const addOrder = (product, count, onSuccess) => {
        setLoading(true);
        const itemInBasket = currentBasket?.find(item=>item?.count && item?.product?.id===product?.id);
        let newItem;
        let newList = [...currentBasket];
        if (itemInBasket) {
            const itemIndex = currentBasket?.findIndex(item=>item?.count && item?.product?.id===product?.id);
            newItem = {...itemInBasket};
            newItem.count += count;
            newList.splice(itemIndex,1,newItem)
        }
        else {
            const { images, thumbnail, ...productInfo } = product;
            newItem = { count:count, product: productInfo };
            newList.push(newItem)
        }
        localStorage.setItem('cart', JSON.stringify(newList));
        window.dispatchEvent( new Event('storage') );
        setCurrentBasket(JSON.parse(localStorage.getItem('cart'))||[])
        onSuccess && onSuccess();
        setLoading(false)
    }
    const removeOrder = (product, onSuccess) => {
        setLoading(true);
        const itemInBasket = currentBasket?.find(item=>item?.count && item?.product?.id===product?.id);
        if (itemInBasket) {
            const itemIndex = currentBasket?.findIndex(item=>item?.count && item?.product?.id===product?.id);
            let newList = [...currentBasket];
            newList.splice(itemIndex,1);
            localStorage.setItem('cart', JSON.stringify(newList));
            window.dispatchEvent( new Event('storage') );
            setCurrentBasket(JSON.parse(localStorage.getItem('cart'))||[])
            onSuccess && onSuccess();
        }
        setLoading(false);
    }
    const emptyBasket = (onSuccess) => {
        if (window.confirm("Are sure? This will empty your shopping cart.")) {
            setLoading(true);
            localStorage.clear();
            window.dispatchEvent( new Event('storage') );
            setCurrentBasket(JSON.parse(localStorage.getItem('cart'))||[]);
            onSuccess && onSuccess();
            setLoading(false)
        }
    }

    useEffect(() => {
        const handleStorageChange = () => {
            setLoading(true);
            setCurrentBasket(JSON.parse(localStorage.getItem('cart'))||[]);
            setLoading(false);
        };
        window.addEventListener('storage', handleStorageChange);
        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, [JSON.stringify(currentBasket)]);

    return [currentBasket, addOrder, changeOrder, removeOrder, emptyBasket, loading]
}