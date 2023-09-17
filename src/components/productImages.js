import { useState } from 'react';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Paginator } from 'primereact/paginator';

const ProductImages = ({product}) => {
    const [showImages, setShowImages] = useState(false)
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!product?.images?.length && product?.thumbnail) return null;
    return (
        <>
            <Button 
                className="p-button-rounded p-button-text"
                icon="pi pi-image" 
                label="See all pictures"
                onClick={()=>setShowImages(true)} 
            />
            <Dialog
                className="image-gallery"
                headerClassName="surface-900 text-white"
                contentClassName="surface-900"
                header={product.title}
                visible={showImages} 
                onHide={() => setShowImages(false)}
            >
                <img src={`${product?.images[currentIndex]}`} alt={product.title} style={{minWidth: "200px", width:"100%"}}/>
                <Paginator first={currentIndex} pageLinkSize={product?.images?.length} rows={1} totalRecords={product?.images?.length} onPageChange={(e) => setCurrentIndex(e.first)}/>
            </Dialog>
        </>
    )
}
export { ProductImages }