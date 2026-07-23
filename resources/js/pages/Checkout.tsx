import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Truck, CreditCard, ChevronLeft, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';
import { CartItemType } from '../types';

interface Province {
    province_id: string;
    province: string;
}

interface City {
    city_id: string;
    city_name: string;
    type: string;
}

interface Subdistrict {
    subdistrict_id: string;
    subdistrict_name: string;
}

interface ShippingResult {
    code: string;
    name: string;
    costs: {
        service: string;
        description: string;
        cost: { value: number; etd: string; note: string }[];
    }[];
}

export function Checkout() {
    const navigate = useNavigate();
    const [cartItems, setCartItems] = useState<CartItemType[]>([]);
    const [loading, setLoading] = useState(true);
    
    // Address & Shipping State
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [cities, setCities] = useState<City[]>([]);
    const [subdistricts, setSubdistricts] = useState<Subdistrict[]>([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedCity, setSelectedCity] = useState('');
    const [selectedSubdistrict, setSelectedSubdistrict] = useState('');
    const [shippingOptions, setShippingOptions] = useState<ShippingResult[]>([]);
    const [courier, setCourier] = useState('');
    const [shippingCost, setShippingCost] = useState<number>(0);
    const [detailedAddress, setDetailedAddress] = useState('');
    const [isCalculating, setIsCalculating] = useState(false);
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    useEffect(() => {
        // Fetch cart
        axios.get('/api/cart')
            .then(res => {
                if (!res.data.items || res.data.items.length === 0) {
                    navigate('/'); // Redirect if cart is empty
                } else {
                    setCartItems(res.data.items);
                }
            })
            .catch(() => navigate('/'))
            .finally(() => setLoading(false));

        // Fetch Provinces
        axios.get('/api/shipping/provinces')
            .then(res => setProvinces(res.data))
            .catch(err => {
                console.error(err);
                const errorMessage = err.response?.data?.message || 'Terjadi kesalahan saat mengambil data provinsi.';
                if(err.response?.status === 500) {
                    Swal.fire('Error', errorMessage, 'error');
                }
            });
    }, [navigate]);

    useEffect(() => {
        if (selectedProvince) {
            setCities([]);
            setSelectedCity('');
            setSubdistricts([]);
            setSelectedSubdistrict('');
            setShippingCost(0);
            axios.get(`/api/shipping/cities/${selectedProvince}`)
                .then(res => setCities(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedProvince]);

    useEffect(() => {
        if (selectedCity) {
            setSubdistricts([]);
            setSelectedSubdistrict('');
            setShippingCost(0);
            axios.get(`/api/shipping/subdistricts/${selectedCity}`)
                .then(res => setSubdistricts(res.data))
                .catch(err => console.error(err));
        }
    }, [selectedCity]);

    useEffect(() => {
        if (selectedSubdistrict) {
            setIsCalculating(true);
            setShippingOptions([]);
            setCourier('');
            setShippingCost(0);
            axios.post('/api/shipping/cost', {
                origin: cartItems[0]?.product?.store?.subdistrict_id,
                destination: selectedSubdistrict,
                weight: 1000 // Asumsi default berat 1kg
            })
            .then(res => {
                setShippingOptions(res.data);
            })
            .catch(() => {
                Swal.fire('Error', 'Gagal menghitung ongkos kirim', 'error');
            })
            .finally(() => setIsCalculating(false));
        }
    }, [selectedSubdistrict]);

    const totalProduct = cartItems.reduce((acc, item) => acc + ((item.product?.price || 0) * item.quantity), 0);
    const grandTotal = totalProduct + shippingCost;

    const handleCheckout = () => {
        if (!selectedProvince || !selectedCity || !selectedSubdistrict || !detailedAddress || !courier || shippingCost === 0) {
            return Swal.fire('Peringatan', 'Lengkapi data alamat dan kurir terlebih dahulu', 'warning');
        }

        setIsCheckingOut(true);
        const provinceName = provinces.find(p => p.province_id === selectedProvince)?.province;
        const cityName = cities.find(c => c.city_id === selectedCity)?.city_name;
        const subdistrictName = subdistricts.find(s => s.subdistrict_id === selectedSubdistrict)?.subdistrict_name;
        
        const fullAddress = `${detailedAddress}, Kec. ${subdistrictName}, ${cityName}, ${provinceName}`;

        axios.post('/api/checkout', { 
            address: fullAddress,
            shipping_cost: shippingCost,
            courier: courier
        })
        .then(res => {
            setIsCheckingOut(false);
            // Langsung alihkan ke halaman detail pesanan
            navigate(`/orders/${res.data.order.uid}`);
        })
        .catch(err => {
            setIsCheckingOut(false);
            Swal.fire('Error', 'Checkout gagal: ' + (err.response?.data?.message || err.message), 'error');
        });
    };

    if (loading) {
        return (
            <div className="py-20 flex justify-center">
                <Loader2 size={32} className="animate-spin text-indigo-600" />
            </div>
        );
    }

    return (
        <div className="py-8 max-w-6xl mx-auto">
            <Link to="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-indigo-600 font-medium mb-6 transition">
                <ChevronLeft size={18} /> Kembali
            </Link>

            <h1 className="text-2xl font-extrabold text-slate-800 mb-8">Checkout</h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Kiri: Form Pengiriman */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Alamat */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
                            <MapPin className="text-indigo-600" /> Alamat Pengiriman
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Provinsi</label>
                                <select 
                                    className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2.5 border"
                                    value={selectedProvince}
                                    onChange={e => setSelectedProvince(e.target.value)}
                                >
                                    <option value="">Pilih Provinsi</option>
                                    {provinces.map(p => (
                                        <option key={p.province_id} value={p.province_id}>{p.province}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kota/Kabupaten</label>
                                <select 
                                    className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2.5 border disabled:bg-slate-50 disabled:text-slate-400"
                                    value={selectedCity}
                                    onChange={e => setSelectedCity(e.target.value)}
                                    disabled={!selectedProvince || cities.length === 0}
                                >
                                    <option value="">Pilih Kota</option>
                                    {cities.map(c => (
                                        <option key={c.city_id} value={c.city_id}>{c.type} {c.city_name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kecamatan</label>
                                <select 
                                    className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm p-2.5 border disabled:bg-slate-50 disabled:text-slate-400"
                                    value={selectedSubdistrict}
                                    onChange={e => setSelectedSubdistrict(e.target.value)}
                                    disabled={!selectedCity || subdistricts.length === 0}
                                >
                                    <option value="">Pilih Kecamatan</option>
                                    {subdistricts.map(s => (
                                        <option key={s.subdistrict_id} value={s.subdistrict_id}>{s.subdistrict_name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-1.5">Alamat Lengkap</label>
                            <textarea 
                                rows={3}
                                className="w-full border-slate-200 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 text-sm p-3 border"
                                placeholder="Nama Jalan, Gedung, No. Rumah, RT/RW, Kelurahan, Kecamatan..."
                                value={detailedAddress}
                                onChange={e => setDetailedAddress(e.target.value)}
                            ></textarea>
                        </div>
                    </div>

                    {/* Pengiriman */}
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm">
                        <div className="flex items-center gap-2 text-lg font-bold text-slate-800 mb-5">
                            <Truck className="text-indigo-600" /> Metode Pengiriman
                        </div>
                        
                        {!selectedSubdistrict ? (
                            <div className="text-sm text-slate-500 italic">Pilih alamat lengkap (hingga Kecamatan) terlebih dahulu untuk melihat opsi pengiriman.</div>
                        ) : isCalculating ? (
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <Loader2 size={16} className="animate-spin text-indigo-600" /> Mencari opsi pengiriman...
                            </div>
                        ) : shippingOptions.length === 0 ? (
                            <div className="text-sm text-red-500">Tidak ada opsi pengiriman tersedia.</div>
                        ) : (
                            <div className="space-y-5">
                                {shippingOptions.map(option => (
                                    <div key={option.code} className="space-y-3">
                                        <h3 className="font-bold text-slate-700 text-sm">{option.name}</h3>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {option.costs.map(service => {
                                                const isSelected = courier === option.code && shippingCost === service.cost[0].value;
                                                return (
                                                    <label 
                                                        key={`${option.code}-${service.service}`} 
                                                        className={`border rounded-xl p-3 cursor-pointer flex flex-col gap-1 transition-all ${isSelected ? 'border-indigo-600 bg-indigo-50 ring-1 ring-indigo-600' : 'border-slate-200 hover:border-indigo-300'}`}
                                                    >
                                                        <div className="flex items-center gap-2">
                                                            <input 
                                                                type="radio" 
                                                                name="shippingService"
                                                                className="text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                                                                checked={isSelected}
                                                                onChange={() => {
                                                                    setCourier(option.code);
                                                                    setShippingCost(service.cost[0].value);
                                                                }}
                                                            />
                                                            <span className="font-semibold text-sm text-slate-800">{service.service}</span>
                                                        </div>
                                                        <div className="text-xs text-slate-500 ml-6">{service.description} {service.cost[0].etd ? `- Estimasi ${service.cost[0].etd} hari` : ''}</div>
                                                        <div className="text-sm font-bold text-indigo-600 ml-6">Rp {service.cost[0].value.toLocaleString('id-ID')}</div>
                                                    </label>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Kanan: Ringkasan Pesanan */}
                <div>
                    <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm sticky top-24">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Ringkasan Pesanan</h2>
                        
                        <div className="space-y-3 mb-6 max-h-48 overflow-y-auto pr-2">
                            {cartItems.map(item => (
                                <div key={item.uid} className="flex justify-between items-center gap-2">
                                    <div className="flex-grow min-w-0">
                                        <p className="text-sm font-semibold text-slate-700 truncate">{item.product?.name}</p>
                                        <p className="text-xs text-slate-500">{item.quantity} x Rp {Number(item.product?.price || 0).toLocaleString('id-ID')}</p>
                                    </div>
                                    <div className="text-sm font-bold text-slate-800 whitespace-nowrap">
                                        Rp {(item.quantity * Number(item.product?.price || 0)).toLocaleString('id-ID')}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="border-t border-slate-100 pt-4 space-y-3 mb-6">
                            <div className="flex justify-between text-slate-600 text-sm">
                                <span>Total Harga ({cartItems.length} barang)</span>
                                <span className="font-semibold">Rp {totalProduct.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between text-slate-600 text-sm items-center">
                                <span>Ongkos Kirim {isCalculating && <Loader2 size={12} className="inline animate-spin ml-1 text-indigo-500"/>}</span>
                                <span className="font-semibold">Rp {shippingCost.toLocaleString('id-ID')}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-slate-100 mt-3">
                                <span className="font-bold text-slate-800">Total Tagihan</span>
                                <span className="font-extrabold text-xl text-indigo-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                            </div>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={isCheckingOut || !selectedProvince || !selectedCity || !selectedSubdistrict || !detailedAddress || !courier || shippingCost === 0}
                            className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-bold py-3.5 px-6 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isCheckingOut ? <Loader2 size={18} className="animate-spin" /> : <CreditCard size={18} />}
                            {isCheckingOut ? 'Memproses...' : 'Buat Pesanan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;
