import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Package, TrendingUp } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
    product: Product;
    onAddToCart: (uid: string) => void;
    index?: number;
    showViews?: boolean;
}

export function ProductCard({ product, onAddToCart, index = 0, showViews = false }: ProductCardProps) {
    return (
        <Link
            to={`/product/${product.uid}`}
            className="bg-white rounded-2xl border border-slate-100 overflow-hidden card-hover group cursor-pointer block shadow-sm"
            style={{ animationDelay: `${index * 40}ms` }}
        >
            <div className="h-44 bg-slate-50 flex items-center justify-center overflow-hidden relative">
                {(product.images && product.images.length > 0) || product.image ? (
                    <img
                        src={(product.images && product.images.length > 0) ? product.images[0] : product.image}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
                    />
                ) : (
                    <div className="flex flex-col items-center text-slate-300">
                        <Package size={32} className="mb-1" />
                        <span className="text-xs">No Image</span>
                    </div>
                )}
                
                {showViews && (product.views || 0) > 0 && (
                    <span className="absolute top-2 right-2 bg-orange-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm flex items-center gap-0.5">
                        <TrendingUp size={10} /> {product.views}
                    </span>
                )}
                
                {product.category?.name && (
                    <span className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm text-indigo-600 text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        {product.category.name}
                    </span>
                )}
                
                {/* Quick add overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-3">
                    <button
                        onClick={(e) => { 
                            e.preventDefault(); 
                            e.stopPropagation();
                            onAddToCart(product.uid); 
                        }}
                        className="w-full bg-white text-slate-800 text-xs font-bold py-2 rounded-xl hover:bg-indigo-600 hover:text-white transition-colors duration-200 flex items-center justify-center gap-1.5"
                    >
                        <ShoppingCart size={13} /> Tambah ke Keranjang
                    </button>
                </div>
            </div>
            
            <div className="p-3.5">
                <h3 className="font-semibold text-slate-800 text-sm mb-1 line-clamp-2 leading-snug">
                    {product.name}
                </h3>
                <div className="text-base font-extrabold text-indigo-600 mb-2">
                    Rp {product.price.toLocaleString('id-ID')}
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="truncate">{product.store ? product.store.name : 'Toko'}</span>
                    <span className="text-green-600 font-medium shrink-0 ml-1">Stok {product.stock}</span>
                </div>
            </div>
        </Link>
    );
}

export default ProductCard;
