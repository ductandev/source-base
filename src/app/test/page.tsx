"use client";

import { useQuery } from "@tanstack/react-query";

export default function TestPage() {
  const OPEN_WEATHER_API_KEY = process.env.NEXT_PUBLIC_OPEN_WEATHER_API_KEY;

  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () =>
      (
        await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=Nha+Trang&appid=${OPEN_WEATHER_API_KEY}&units=metric&lang=vi`,
        )
      ).json(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">React Query Works!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
