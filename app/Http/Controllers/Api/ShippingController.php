<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\RajaOngkirService;
use Exception;

class ShippingController extends Controller
{
    private $rajaOngkir;

    public function __construct(RajaOngkirService $rajaOngkir)
    {
        $this->rajaOngkir = $rajaOngkir;
    }

    public function getProvinces()
    {
        try {
            $provinces = $this->rajaOngkir->getProvinces();
            return response()->json($provinces);
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function getCities($provinceId)
    {
        try {
            $cities = $this->rajaOngkir->getCities($provinceId);
            return response()->json($cities);
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function getSubdistricts($cityId)
    {
        try {
            $subdistricts = $this->rajaOngkir->getSubdistricts($cityId);
            return response()->json($subdistricts);
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }

    public function checkCost(Request $request)
    {
        $request->validate([
            'origin' => 'nullable|numeric',
            'destination' => 'required|numeric',
            'weight' => 'required|numeric', // in grams
        ]);

        try {
            $cost = $this->rajaOngkir->calculateAllCosts(
                $request->destination,
                $request->weight,
                $request->origin
            );
            return response()->json($cost);
        } catch (Exception $e) {
            $status = $e->getCode() ?: 500;
            return response()->json(['message' => $e->getMessage()], $status);
        }
    }
}
