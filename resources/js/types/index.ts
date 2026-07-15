export interface User {
    uid: string;
    name: string;
    email: string;
}

export interface Store {
    uid: string;
    name: string;
    description?: string;
}

export interface Category {
    uid: string;
    name: string;
}

export interface Product {
    uid: string;
    name: string;
    description: string;
    price: number;
    stock: number;
    image?: string;
    category?: Category;
    store?: Store;
}

export interface CartItemType {
    uid: string;
    quantity: number;
    product?: Product;
}

declare global {
    interface Window {
        snap: any;
    }
}
