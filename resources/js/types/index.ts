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
    views: number;
    image?: string;
    images?: string[];
    category?: Category;
    store?: Store;
}

export interface CartItemType {
    uid: string;
    quantity: number;
    created_at: string;
    updated_at: string;
    product?: Product;
}

export interface NotificationType {
    id: string;
    type: string;
    data: {
        type: string;
        message: string;
        conversation_uid: string;
        sender_name: string;
    };
    read_at: string | null;
    created_at: string;
}

declare global {
    interface Window {
        Echo: any;
        Pusher: any;
    }
}

declare global {
    interface Window {
        snap: any;
    }
}

export interface Conversation {
    uid: string;
    user_uid: string;
    store_uid: string;
    created_at: string;
    updated_at: string;
    user?: User;
    store?: Store;
    last_message?: Message;
    unread_count?: number;
}

export interface Message {
    uid: string;
    conversation_uid: string;
    sender_uid: string;
    message: string;
    is_read: boolean;
    created_at: string;
    sender?: User;
}
