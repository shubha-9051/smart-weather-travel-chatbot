import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query");

    if (!query) {
        return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (!API_KEY) {
        return NextResponse.json({ error: "API Key missing" }, { status: 500 });
    }

    try {
        // 1. Text Search to get Place ID
        const searchRes = await fetch(
            `https://places.googleapis.com/v1/places:searchText`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Goog-Api-Key": API_KEY,
                    "X-Goog-FieldMask": "places.id,places.name,places.photos,places.formattedAddress,places.rating,places.userRatingCount"
                },
                body: JSON.stringify({ textQuery: query })
            }
        );

        const searchData = await searchRes.json();

        if (!searchData.places || searchData.places.length === 0) {
            return NextResponse.json({ error: "Place not found" }, { status: 404 });
        }

        const place = searchData.places[0];

        // 2. Construct Photo URLs
        // https://places.googleapis.com/v1/{name}/media?key={API_KEY}&maxHeightPx=400&maxWidthPx=400
        const photos = place.photos?.slice(0, 3).map((photo: any) => {
            return `https://places.googleapis.com/v1/${photo.name}/media?key=${API_KEY}&maxHeightPx=400&maxWidthPx=600`;
        }) || [];

        return NextResponse.json({
            name: place.name,
            address: place.formattedAddress,
            rating: place.rating,
            userRatingCount: place.userRatingCount,
            photos: photos,
            placeId: place.id
        });

    } catch (error) {
        console.error("Error fetching place details:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
