import { RouteProps } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";
import GenreList from '../pages/genre/PageList'
import CastMemberList from '../pages/castMember/PageList'

export interface MyRouteProps extends RouteProps {
    name: string
    label: string
}

const routes: MyRouteProps[] = [
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true
    },
    {
        name: 'categories.list',
        label: 'Listar categorias',
        path: '/categories',
        component: CategoryList,
        exact: true
    },
    {
        name: 'categories.create',
        label: 'Criar categorias',
        path: '/categories/create',
        component: CategoryList,
        exact: true
    },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres/list',
        component: GenreList,
        exact: true
    },
    {
        name: 'cast_members.list',
        label: 'Listagem membros de elenco',
        path: '/cast_members/list',
        component: CastMemberList,
        exact: true
    }
]

export default routes
