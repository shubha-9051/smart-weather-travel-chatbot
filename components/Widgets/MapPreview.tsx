import React from 'react';

interface MapPreviewProps {
    location: string;
}

export default function MapPreview({ location }: MapPreviewProps) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    if (!apiKey) {
        return (
            <div className="bg-neutral-800 rounded-xl p-4 mt-2 max-w-sm border border-neutral-700 text-center text-neutral-400 text-sm">
                Map unavailable (Missing API Key)
            </div>
        );
    }

    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${encodeURIComponent(location)}`;

    return (
        <div className="bg-neutral-800 rounded-xl overflow-hidden mt-2 max-w-sm border border-neutral-700 h-48">
            <iframe
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                src={mapUrl}
                title={`Map of ${location}`}
            ></iframe>
        </div>
    );
}
