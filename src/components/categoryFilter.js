import { Dropdown } from 'primereact/dropdown';
import { useGet } from '../hooks';
import { ProgressSpinner } from 'primereact/progressspinner';

const CategoryFilter = ({currentFilter, onChange, disabled}) => {
    const [productCategories, loading] = useGet("https://dummyjson.com/products/categories")
    const currentCategory = productCategories?.find(category=>category===currentFilter?.split("/category/")?.[1])
    return loading?
            <ProgressSpinner/>
            :
            <Dropdown 
                value={currentCategory} 
                options={productCategories} 
                onChange={(e) => onChange(e?.value?`/category/${e.value}`:null)} 
                filter 
                showClear 
                placeholder="Select category"
                disabled={disabled}
            />
}
export { CategoryFilter }