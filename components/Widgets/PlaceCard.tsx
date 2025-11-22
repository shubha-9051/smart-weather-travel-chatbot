import React, { useEffect, useState } from 'react';
import { Star, MapPin, ImageIcon } from 'lucide-react';

interface PlaceCardProps {
    query: string;
}

interface PlaceData {
    name: string;
    address: string;
    rating: number;
    userRatingCount: number;
    photos: string[];
    placeId: string;
}

export default function PlaceCard({ query }: PlaceCardProps) {
    const [data, setData] = useState<PlaceData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const res = await fetch(`/api/places?query=${encodeURIComponent(query)}`);
                if (!res.ok) throw new Error('Failed to fetch');
                const json = await res.json();
                setData(json);
            } catch (e) {
                console.error(e);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchPlace();
        }
    }, [query]);

    if (loading) return <div className="animate-pulse h-48 bg-neutral-800 rounded-xl mt-2"></div>;
    if (error || !data) return null;

    return (
        <div className="bg-neutral-800 rounded-xl overflow-hidden mt-3 border border-neutral-700 shadow-lg">
            <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-48">
                {data.photos.length > 0 ? (
                    data.photos.map((photo, idx) => (
                        <a
                            key={idx}
                            href={`https://www.google.com/maps/place/?q=place_id:${data.placeId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full flex-shrink-0 snap-center cursor-pointer"
                        >
                            <img
                                src={photo}
                                alt={data.name}
                                className="w-full h-full object-cover hover:opacity-90 transition-opacity"
                            />
                        </a>
                    ))
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-neutral-700 text-neutral-500">
                        <ImageIcon size={32} />
                    </div>
                )}
            </div>

            <div className="p-3">
                <h3 className="font-bold text-white text-lg truncate">{data.name}</h3>

                <div className="flex items-center gap-1 text-yellow-400 text-sm my-1">
                    <Star size={14} fill="currentColor" />
                    <span>{data.rating}</span>
                    <span className="text-neutral-500">({data.userRatingCount})</span>
                </div>

                <div className="flex items-start gap-1 text-neutral-400 text-xs">
                    <MapPin size={12} className="mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{data.address}</span>
                </div>
            </div>
        </div>
    );
}
