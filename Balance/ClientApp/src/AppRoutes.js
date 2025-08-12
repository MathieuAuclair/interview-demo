import UpdateResourceInput from "./components/resource/UpdateResourceInput";
import ResourcePage from "./components/resource/ResourcePage";
import AddResourceInput from "./components/resource/AddResourceInput";
import UpdateUnitInput from "./components/units/UpdateUnitInput";
import UnitPage from "./components/units/UnitPage";
import AddUnitInput from "./components/units/AddUnitInput";

const AppRoutes = [
  // Resources
  {
    path: "/dashboard/resource",
    element: <ResourcePage isArchived={false} />,
  },
  {
    path: "/dashboard/resource/archived",
    element: <ResourcePage isArchived={true} />,
  },
  {
    path: "/dashboard/resource/update",
    element: <UpdateResourceInput />,
  },
  {
    path: "/dashboard/resource/add",
    element: <AddResourceInput />,
  },
  // Units
  {
    path: "/dashboard/unit",
    element: <UnitPage isArchived={false} />,
  },
  {
    path: "/dashboard/unit/archived",
    element: <UnitPage isArchived={true} />,
  },
  {
    path: "/dashboard/unit/update",
    element: <UpdateUnitInput />,
  },
  {
    path: "/dashboard/unit/add",
    element: <AddUnitInput />,
  },
];

export default AppRoutes;
