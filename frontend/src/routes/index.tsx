import { RouteProps } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import CategoryList from "../pages/category/PageList";
import CategoryForm from "../pages/category/PageForm";
import GenreList from '../pages/genre/PageList'
import GenreForm from "../pages/genre/PageForm"
import CastMemberList from '../pages/cast-member/PageList'
import CastMemberForm from "../pages/cast-member/PageForm"
import VideoList from "../pages/video/PageList"
import VideoForm from "../pages/video/PageForm"
import Uploads from "../pages/uploads";
import Login from "../pages/Login";

export interface MyRouteProps extends RouteProps {
    name: string
    label: string
    auth?: boolean
}

const routes: MyRouteProps[] = [
    {
        name: 'login',
        label: 'Login',
        path: '/login',
        component: Login,
        exact: true,
        auth: false
    },
    {
        name: 'dashboard',
        label: 'Dashboard',
        path: '/',
        component: Dashboard,
        exact: true,
        auth: true
    },
    {
        name: 'categories.list',
        label: 'Listar categorias',
        path: '/categories',
        component: CategoryList,
        exact: true,
        auth: true
    },
    {
        name: 'categories.create',
        label: 'Criar categorias',
        path: '/categories/create',
        component: CategoryForm,
        exact: true,
        auth: true
    },
    {
        name: 'categories.edit',
        label: 'Editar categorias',
        path: '/categories/:id/edit',
        component: CategoryForm,
        exact: true,
        auth: true
    },
    {
        name: 'genres.list',
        label: 'Listar gêneros',
        path: '/genres',
        component: GenreList,
        exact: true,
        auth: true
    },
    {
        name: 'genres.create',
        label: 'Criar gêneros',
        path: '/genres/create',
        component: GenreForm,
        exact: true,
        auth: true
    },
    {
        name: 'genres.edit',
        label: 'Editar gêneros',
        path: '/genres/:id/edit',
        component: GenreForm,
        exact: true,
        auth: true
    },
    {
        name: 'cast_members.list',
        label: 'Listar membros de elenco',
        path: '/cast-members',
        component: CastMemberList,
        exact: true,
        auth: true
    },
    {
        name: 'cast_members.create',
        label: 'Criar membros de elenco',
        path: '/cast-members/create',
        component: CastMemberForm,
        exact: true,
        auth: true
    },
    {
        name: 'cast_members.edit',
        label: 'Editar membro de elenco',
        path: '/cast-members/:id/edit',
        component: CastMemberForm,
        exact: true,
        auth: true
    },
    {
        name: 'videos.list',
        label: 'Listar vídeo',
        path: '/videos',
        component: VideoList,
        exact: true,
        auth: true
    },
    {
        name: 'videos.create',
        label: 'Criar vídeo',
        path: '/videos/create',
        component: VideoForm,
        exact: true,
        auth: true
    },
    {
        name: 'videos.edit',
        label: 'Editar vídeo',
        path: '/videos/:id/edit',
        component: VideoForm,
        exact: true,
        auth: true
    },
    {
        name: 'uploads.list',
        label: 'Uploads',
        path: '/uploads',
        component: Uploads,
        exact: true,
        auth: true
    }
]

export default routes
