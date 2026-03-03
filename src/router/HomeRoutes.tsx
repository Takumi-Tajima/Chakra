import { Route } from "react-router-dom";

import { Home } from "../components/pages/Home";
import { HomeContent } from "../components/pages/HomeContent";
import { Setting } from "../components/pages/Setting";
import { UserManagement } from "../components/pages/UserManagement";

// export const HomeRoutes = () => {
//   return (
//     <>
//       <Route path='/home' element={<Home />} >
//         <Route path='setting' element={<Setting />} />
//         <Route path='user_management' element={<UserManagement />} />
//       </Route>
//     </>
//   )
// }

export const HomeRoutes = (
  <Route path='/home' element={<Home />} >
    <Route index element={<HomeContent />} />
    <Route path='setting' element={<Setting />} />
    <Route path='user_management' element={<UserManagement />} />
  </Route>
)
