import { useKeycloak } from '@react-keycloak/web'
import * as React from 'react'
import { Switch, Route as ReactRoute } from 'react-router-dom'
import routes from './index'
import PrivateRoute from './PrivateRoute'

const AppRouter = () => {
    const {initialized} = useKeycloak()

    if(!initialized) {
        return <div>Carregando...</div>
    }
    
    return (
       <Switch>
           {
               routes.map(
                   (route, key) => {
                       const Route = route.auth === true ? PrivateRoute : ReactRoute;
                       const routeParams = {
                           key,
                           component: route.component!,
                           ...(route.path && {path: route.path}),
                           ...(route.exact && {exact: route.exact})
                       };
                    
                        return <Route {...routeParams}/>
                   }
               )
           }
       </Switch>
    )
}

export default AppRouter