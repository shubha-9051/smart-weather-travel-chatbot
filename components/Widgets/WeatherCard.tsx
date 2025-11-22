import React from 'react';
import { Cloud, Droplets, Wind, Thermometer } from 'lucide-react';
import { WeatherData } from '@/lib/types';

interface WeatherCardProps {
    data: WeatherData;
}

export default function WeatherCard({ data }: WeatherCardProps) {
    return (
        <div className="bg-neutral-800 rounded-xl p-4 mt-2 max-w-sm border border-neutral-700">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-lg font-semibold text-white">{data.location}</h3>
                    <p className="text-neutral-400 text-sm">{data.condition}</p>
                </div>
                <div className="flex items-center text-3xl font-bold text-white">
                    <Thermometer size={24} className="mr-1 text-orange-500" />
                    {Math.round(data.temperature)}°C
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2 text-neutral-300">
                    <Droplets size={18} className="text-blue-400" />
                    <span className="text-sm">Humidity: {data.humidity}%</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-300">
                    <Wind size={18} className="text-teal-400" />
                    <span className="text-sm">Wind: {data.windSpeed} km/h</span>
                </div>
            </div>
        </div>
    );
}
