import { useEffect, useState } from "react";
import { useGet, useOrders } from "../hooks";
import { ProductCard } from "./productCard";
import { CategoryFilter } from "./categoryFilter";

import { DataView } from 'primereact/dataview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from "primereact/inputtext";
import { ProgressSpinner } from "primereact/progressspinner";

const ProductList = () => {
    const [skip, setSkip] = useState(0);
    const [limit, setLimit] = useState(3);
    const [filter, setFilter] = useState(null);
    const [query, setQuery] = useState("");
    const [search, setSearch] = useState(null);
    const [productData, loading] = useGet(`https://dummyjson.com/products${filter ? filter : ""}${query ? "/search" : ""}`, {
        ...query&&!filter ? { q:query } : {},
        limit:limit,
        skip:skip,
    });
    const [basketData] = useOrders();

    useEffect(() => {
        const timeOutId = setTimeout(() => {
            setQuery(search);
            setSkip(0)
        }, 500);
        return () => clearTimeout(timeOutId);
    }, [search]);

    useEffect(()=>{
        if (filter) setQuery("");
    }, [filter])
    
    const itemTemplate = (item) => {
        return (
            <div className="col-fixed">
                <div className="px-2 py-4 h-full">
                    <ProductCard 
                        product={item} 
                        loading={loading}
                        order={basketData?.find(order=>order?.product?.id===item.id)}
                    />
                </div>
            </div>
        )
    }

    const header = (
        <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
            <h2 className="my-0">Products</h2>
            <div className="flex flex-wrap gap-2 justify-content-center">
                {/* Alttaki elemanlara verilen disabled koşulları, biri kullanıldığı zaman diğerini disabled yapıyor */}
                {/* Böyle yapmamızın sebebi, kullandığımız JSON api, hem search hem category filterın birlikte kullanılmasına izin vermiyor olması */}
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText disabled={Boolean(filter)} value={search||""} onChange={(e) => setSearch(e.target.value)} placeholder="Search" />
                </span>
                <CategoryFilter disabled={Boolean(query)} currentFilter={filter} onChange={setFilter}/>
            </div>
        </div>
    )
    const pageProductCountSelector = () => {
        const options = [3,4,5,6,10,15,20]
        return (
            <div className="flex align-items-center">
                <div className="mr-2">Products per page</div>
                <Dropdown 
                    value={limit} 
                    options={options} 
                    onChange={(e) => {
                        setSkip(0);
                        setLimit(e.value);
                    }} 
                />
            </div>
        )
    }
    return (
        <div className="flex justify-content-center">
            <div className="w-full" style={{maxWidth:"950px"}}>
                <DataView
                    className="product-list w-full"
                    value={productData?.products}
                    itemTemplate={itemTemplate} 
                    paginator
                    paginatorPosition={productData?.total > limit ? "both" : "top"}
                    header={header}
                    rows={limit} 
                    first={skip} 
                    lazy 
                    totalRecords={productData?.total}
                    pageLinkSize={3}
                    onPage={(e)=>setSkip(e.first)}
                    paginatorRight={pageProductCountSelector}
                    paginatorLeft={`${productData?.total} products`}
                    emptyMessage={<div className="p-6 bg-white w-full">{loading ? <ProgressSpinner/> : `No results${query?` for "${query}"`:null}`}</div>}
                />
            </div>
        </div>
    )
}
export { ProductList }