// hooks/useApiCache.js
import { useState, useEffect, useRef } from 'react';

export const useApiCache = (key, fetchFunction, dependencies = [], ttl = 5 * 60 * 1000) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const cacheRef = useRef(new Map());

    useEffect(() => {
        const cache = cacheRef.current;
        const cached = cache.get(key);
        
        if (cached && Date.now() - cached.timestamp < ttl) {
            setData(cached.data);
            setLoading(false);
            return;
        }

        const fetchData = async () => {
            try {
                setLoading(true);
                const result = await fetchFunction();
                
                cache.set(key, {
                    data: result,
                    timestamp: Date.now()
                });
                
                setData(result);
                setError(null);
            } catch (err) {
                setError(err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [key, ttl, ...dependencies]);

    const invalidateCache = (cacheKey = key) => {
        cacheRef.current.delete(cacheKey);
    };

    const clearCache = () => {
        cacheRef.current.clear();
    };

    return { data, loading, error, invalidateCache, clearCache };
};
