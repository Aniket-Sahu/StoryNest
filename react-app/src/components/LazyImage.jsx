// components/LazyImage.jsx
import React, { useState, useRef, useEffect } from 'react';

const LazyImage = ({ src, alt, placeholder, className, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            { threshold: 0.1 }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, []);

    return (
        <div ref={imgRef} className={`lazy-image-container ${className}`} {...props}>
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    onLoad={() => setIsLoaded(true)}
                    style={{
                        opacity: isLoaded ? 1 : 0,
                        transition: 'opacity 0.3s ease'
                    }}
                />
            )}
            {!isLoaded && (
                <div className="image-placeholder">
                    {placeholder || alt?.charAt(0) || '?'}
                </div>
            )}
        </div>
    );
};

export default LazyImage;
