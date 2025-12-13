export async function searchAddress(query: string) {
  const res = await fetch(
    `https://rsapi.goong.io/geocode?address=${encodeURIComponent(
      query
    )}&api_key=${process.env.NEXT_PUBLIC_GOONG_API_KEY}`
  );

  const data = await res.json();
  return data.results?.[0];
}
