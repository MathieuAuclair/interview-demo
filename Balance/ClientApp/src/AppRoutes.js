import UpdateResourceInput from "./components/resource/UpdateResourceInput";
import ResourcePage from "./components/resource/ResourcePage";
import AddResourceInput from "./components/resource/AddResourceInput";
import UpdateUnitInput from "./components/units/UpdateUnitInput";
import UnitPage from "./components/units/UnitPage";
import AddUnitInput from "./components/units/AddUnitInput";
import CustomerPage from "./components/customer/CustomerPage";
import UpdateCustomerInput from "./components/customer/UpdateCustomerInput";
import AddCustomerInput from "./components/customer/AddCustomerInput";
import ShipmentPage from "./components/shipments/ShipmentPage";
import UpdateShipmentInput from "./components/shipments/UpdateShipmentInput";

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
  // Customers
  {
    path: "/dashboard/customer",
    element: <CustomerPage isArchived={false} />,
  },
  {
    path: "/dashboard/customer/archived",
    element: <CustomerPage isArchived={true} />,
  },
  {
    path: "/dashboard/customer/update",
    element: <UpdateCustomerInput />,
  },
  {
    path: "/dashboard/customer/add",
    element: <AddCustomerInput />,
  },
  // Shipments
  {
    path: "/dashboard/shipment",
    element: <ShipmentPage isArchived={false} />,
  },
  {
    path: "/dashboard/shipment/archived",
    element: <ShipmentPage isArchived={true} />,
  },
  {
    path: "/dashboard/shipment/update",
    element: <UpdateShipmentInput />,
  },
  {
    path: "/dashboard/shipment/add",
    element: <UpdateShipmentInput />,
  },
];

export default AppRoutes;
