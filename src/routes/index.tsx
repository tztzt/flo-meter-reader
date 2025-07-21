import { MeterReadingSQL } from "@/pages/MeterReadingSQL";
import { HomePage } from "@/pages/HomePage";

export const routes = [
  {
    name: "Home",
    path: "/flo-meter-reader/",
    element: <HomePage />,
  },
  {
    name: "Meter Readings SQL",
    path: "/flo-meter-reader/meter",
    element: <MeterReadingSQL />,
  },
];
