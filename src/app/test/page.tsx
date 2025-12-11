"use client";

import { useQuery } from "@tanstack/react-query";

export default function TestPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["hello"],
    queryFn: async () => (await fetch("https://api.github.com")).json(),
  });

  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">React Query Works!</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
