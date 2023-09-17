import { useEffect, useState } from "react";

export const useGet = (url, parameters, options) => {
    const [loading, setLoading] = useState(false)
    const [data, setData] = useState(null)

    const loadData = async (url, parameters) => {
        setLoading(true)
        let filters = [];
        if (parameters) {
            for (let key in parameters) {
                filters.push(`${key}=${parameters[key]}`)
            }
        }
        try {
            await fetch(`${url}${filters?.length?`?${filters.join("&")}`:""}`)
                .then(res=>{
                    if (!res.ok) {
                        options?.onFail && options.onFail(res);
                        throw new Error(res.status);
                    };
                    return res;
                })
                .then(res=>res.json())
                .then(res=>setData(res))
        }
        catch(error) {
            console.log("Failed to get data")
            return null
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData(url,parameters)
    }, [url,JSON.stringify(parameters)]);

    return [data, loading]
}