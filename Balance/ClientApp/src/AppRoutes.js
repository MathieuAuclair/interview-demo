import UpdateResourceInput from "./components/resource/UpdateResourceInput";
import ResourcePage from "./components/resource/ResourcePage";

const AppRoutes = [
  {
    path: '/dashboard/resource',
    element: <ResourcePage isArchived={false} />
  },
  {
    path: '/dashboard/resource/archived',
    element: <ResourcePage isArchived={true} />
  },
  {
    path: '/dashboard/resource/update',
    element: <UpdateResourceInput />
  }
];

export default AppRoutes;
