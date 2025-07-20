import { MeterReadingSQL } from "@/pages/MeterReadingSQL";
import { HomePage } from "@/pages/HomePage";

export const routes = [
  {
    name: "Home",
    path: "/",
    element: <HomePage />,
  },
  {
    name: "Meter Readings SQL",
    path: "/meter",
    element: <MeterReadingSQL />,
  },
];
