import { MeterReadingSQL } from "@/pages/MeterReadingSQL";
import { HomePage } from "@/pages/HomePage";

export const routes = [
  {
    name: "Home",
    path: "/flo-tools/",
    element: <HomePage />,
  },
  {
    name: "Meter Readings SQL",
    path: "/flo-tools/meter",
    element: <MeterReadingSQL />,
  },
];
