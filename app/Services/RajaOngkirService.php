<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;
use App\Models\Province;
use App\Models\City;

class RajaOngkirService
{
    private $apiKey;
    private $baseUrl;
    private $originCityId;

    public function __construct()
    {
        $this->apiKey = env('RAJAONGKIR_API_KEY');
        // Menggunakan wrapper Komerce karena API resmi RajaOngkir timeout
        $this->baseUrl = "https://rajaongkir.komerce.id/api/v1";
        $this->originCityId = env('STORE_CITY_ID', 153); // Default Jakarta Selatan
    }

    /**
     * Check if API key is configured
     */
    public function isConfigured()
    {
        return !empty($this->apiKey);
    }

    /**
     * Get list of provinces
     */
    public function getProvinces()
    {
        // 1. Cek di database
        $provincesCount = Province::count();
        if ($provincesCount > 0) {
            return Province::all()->map(function($p) {
                return [
                    'province_id' => (string) $p->id,
                    'province' => $p->name
                ];
            })->toArray();
        }

        // 2. Jika kosong, panggil API
        if (!$this->isConfigured()) {
            throw new Exception('API Key RajaOngkir belum dikonfigurasi di .env');
        }

        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/province');

        if ($response->successful()) {
            $results = $response->json()['data'];
            
            // 3. Simpan ke database
            foreach ($results as $item) {
                Province::updateOrCreate(
                    ['id' => $item['id']],
                    ['name' => $item['name']]
                );
            }

            // Kembalikan dengan format yang diharapkan frontend (format asli RajaOngkir)
            return array_map(function($item) {
                return [
                    'province_id' => (string) $item['id'],
                    'province' => $item['name']
                ];
            }, $results);
        }

        throw new Exception('Gagal mengambil data provinsi: ' . $response->body(), $response->status());
    }

    /**
     * Get list of cities in a province
     */
    public function getCities($provinceId)
    {
        // 1. Cek di database
        $cities = City::where('province_id', $provinceId)->get();
        if ($cities->count() > 0) {
            return $cities->map(function($c) {
                return [
                    'city_id' => (string) $c->id,
                    'province_id' => (string) $c->province_id,
                    'type' => $c->type,
                    'city_name' => $c->name,
                    'postal_code' => $c->postal_code,
                ];
            })->toArray();
        }

        // 2. Jika kosong, panggil API
        if (!$this->isConfigured()) {
            throw new Exception('API Key RajaOngkir belum dikonfigurasi di .env');
        }

        $response = Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/city/' . $provinceId);

        if ($response->successful()) {
            $results = $response->json()['data'];
            
            // 3. Simpan ke database
            foreach ($results as $item) {
                City::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'province_id' => $provinceId,
                        'name' => $item['name'],
                        'type' => 'Kota/Kabupaten', // Komerce V1 tidak memberikan tipe spesifik
                        'postal_code' => '', // Tidak ada postal code di V1
                    ]
                );
            }

            // Kembalikan dengan format yang diharapkan frontend (format asli RajaOngkir)
            return array_map(function($item) use ($provinceId) {
                return [
                    'city_id' => (string) $item['id'],
                    'province_id' => (string) $provinceId,
                    'type' => 'Kota',
                    'city_name' => $item['name'],
                    'postal_code' => ''
                ];
            }, $results);
        }

        throw new Exception('Gagal mengambil data kota: ' . $response->body(), $response->status());
    }

    /**
     * Get list of subdistricts in a city
     */
    public function getSubdistricts($cityId)
    {
        // 1. Cek di database (using App\Models\District since Komerce API uses 'district')
        $subdistricts = \App\Models\District::where('city_id', $cityId)->get();
        if ($subdistricts->count() > 0) {
            return $subdistricts->map(function($s) {
                return [
                    'subdistrict_id' => (string) $s->id,
                    'city_id' => (string) $s->city_id,
                    'subdistrict_name' => $s->name,
                ];
            })->toArray();
        }

        // 2. Jika kosong, panggil API
        if (!$this->isConfigured()) {
            throw new Exception('API Key RajaOngkir belum dikonfigurasi di .env');
        }

        $response = \Illuminate\Support\Facades\Http::withHeaders(['key' => $this->apiKey])
            ->get($this->baseUrl . '/destination/district/' . $cityId);

        if ($response->successful()) {
            $results = $response->json()['data'];
            
            // 3. Simpan ke database
            foreach ($results as $item) {
                \App\Models\District::updateOrCreate(
                    ['id' => $item['id']],
                    [
                        'city_id' => $cityId,
                        'name' => $item['name']
                    ]
                );
            }

            // Kembalikan dengan format yang diharapkan frontend
            return array_map(function($item) use ($cityId) {
                return [
                    'subdistrict_id' => (string) $item['id'],
                    'city_id' => (string) $cityId,
                    'subdistrict_name' => $item['name']
                ];
            }, $results);
        }

        throw new Exception('Gagal mengambil data kecamatan: ' . $response->body(), $response->status());
    }

    /**
     * Calculate shipping cost
     */
    public function calculateCost($destinationCityId, $weight, $courier, $originCityId = null)
    {
        if (!$this->isConfigured()) {
            throw new Exception('API Key RajaOngkir belum dikonfigurasi di .env');
        }

        $origin = $originCityId ?? $this->originCityId;

        $response = Http::asForm()->withHeaders(['key' => $this->apiKey])
            ->post($this->baseUrl . '/calculate/domestic-cost', [
                'origin' => $origin,
                'destination' => $destinationCityId,
                'weight' => $weight,
                'courier' => $courier
            ]);

        if ($response->successful()) {
            $data = $response->json()['data'] ?? [];
            
            // Mapping format Komerce ke format asli RajaOngkir yang diharapkan Checkout.tsx
            $costs = array_map(function($service) {
                return [
                    'service' => $service['service'],
                    'description' => $service['description'],
                    'cost' => [
                        [
                            'value' => $service['cost'],
                            'etd' => $service['etd'],
                            'note' => ''
                        ]
                    ]
                ];
            }, $data);

            return [
                'code' => $courier,
                'name' => strtoupper($courier),
                'costs' => $costs
            ];
        }

        throw new Exception('Gagal mengambil ongkos kirim: ' . $response->body(), $response->status());
    }
    public function calculateAllCosts($destinationCityId, $weight, $originCityId = null)
    {
        if (!$this->isConfigured()) {
            throw new Exception('API Key RajaOngkir belum dikonfigurasi di .env');
        }

        $origin = $originCityId ?? $this->originCityId;
        $couriers = ['jne', 'pos', 'tiki'];
        
        $responses = \Illuminate\Support\Facades\Http::pool(fn (\Illuminate\Http\Client\Pool $pool) => 
            collect($couriers)->map(fn ($courier) => 
                $pool->asForm()->withHeaders(['key' => $this->apiKey])
                     ->post($this->baseUrl . '/calculate/domestic-cost', [
                         'origin' => $origin,
                         'destination' => $destinationCityId,
                         'weight' => $weight,
                         'courier' => $courier
                     ])
            )
        );

        $allCosts = [];
        foreach ($responses as $index => $response) {
            if ($response instanceof \Illuminate\Http\Client\Response && $response->successful()) {
                $courier = $couriers[$index];
                $data = $response->json()['data'] ?? [];
                
                if (!empty($data)) {
                    $costs = array_map(function($service) {
                        return [
                            'service' => $service['service'],
                            'description' => $service['description'],
                            'cost' => [
                                [
                                    'value' => $service['cost'],
                                    'etd' => $service['etd'],
                                    'note' => ''
                                ]
                            ]
                        ];
                    }, $data);

                    $allCosts[] = [
                        'code' => $courier,
                        'name' => strtoupper($courier),
                        'costs' => $costs
                    ];
                }
            }
        }

        return $allCosts;
    }
}
