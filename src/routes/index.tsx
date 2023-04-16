import { Outlet, createBrowserRouter,  } from 'react-router-dom'
import App from '../App';
import About from '../pages/about';
import Aboutid from '../components/aboutId';
const router = createBrowserRouter([
    {
      path: "/",
      element: <App />
    },
    {
      path: "about",
      element: <About />,
      children: [
        {
          path: ":id",
          element: <Aboutid />,
          loader: ({params}) => {
            console.log(params)
            return null
          }
        }
      ]
    },
    {
      path: "*",
      element: <div>Not found</div>
    }
]);

export default router