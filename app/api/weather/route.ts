import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const location = searchParams.get("location");

    if (!location) {
        return NextResponse.json({ error: "Location is required" }, { status: 400 });
    }

    try {

        const geoRes = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location)}&count=1&language=en&format=json`
        );
        const geoData = await geoRes.json();

        if (!geoData.results || geoData.results.length === 0) {
            return NextResponse.json({ error: "Location not found" }, { status: 404 });
        }

        const { latitude, longitude, name, country } = geoData.results[0];


        const weatherRes = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&timezone=auto`
        );
        const weatherData = await weatherRes.json();

        const current = weatherData.current;

        const getWeatherCondition = (code: number) => {
            if (code === 0) return "Clear sky";
            if (code >= 1 && code <= 3) return "Partly cloudy";
            if (code >= 45 && code <= 48) return "Fog";
            if (code >= 51 && code <= 67) return "Rain";
            if (code >= 71 && code <= 77) return "Snow";
            if (code >= 80 && code <= 82) return "Rain showers";
            if (code >= 95 && code <= 99) return "Thunderstorm";
            return "Unknown";
        };

        return NextResponse.json({
            location: `${name}, ${country}`,
            temperature: current.temperature_2m,
            condition: getWeatherCondition(current.weather_code),
            humidity: current.relative_humidity_2m,
            windSpeed: current.wind_speed_10m,
        });

    } catch (error) {
        console.error("Error fetching weather:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
