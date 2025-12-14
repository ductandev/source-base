"use client";
import { useSimulationDetail } from "@/api/simulation";
import { useEffect } from "react";
import { useSimulationStore } from "@/stores/SimulationStore";
import { ROUTES } from "@/utils/routes";
import { useRouter } from "next/navigation";
import { useSearchParams, useParams } from "next/navigation";

export default function SimulationResultsDetail() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const params = useParams();
  const scenarioId = String(params.id);
  const router = useRouter();
  const { mutateAsync: mutateSimulationDetail } = useSimulationDetail();
  const setCurrentSimulation = useSimulationStore(
    (s) => s.setCurrentSimulation,
  );

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (scenarioId) {
          const res = await mutateSimulationDetail({ scenarioId });

          if (!alive) return;

          if (res?.status === 200) {
            if (res?.data) setCurrentSimulation(res.data);

            router.push(ROUTES.SIMULATION_RESULT);
          } else {
            router.push(ROUTES.HOME);
          }
        }
      } catch (e) {
        if (!alive) return;
        // router.push(ROUTES.HOME);
      }
    })();

    return () => {
      alive = false;
    };
  }, [scenarioId, mutateSimulationDetail, router, setCurrentSimulation]);
}
