import * as React from 'react'
import { IconButton, MenuItem, Menu as MuiMenu } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'
import routes, { MyRouteProps } from '../../routes'
import { Link } from 'react-router-dom'

const listRoutes = {
    'dashboard': 'Dashboard',
    'categories.list': 'Categorias',
    'genres.list': 'Gêneros',
    'cast_members.list': 'Membros de elenco'
}

const menuRoutes = routes.filter(route => Object.keys(listRoutes).includes(route.name))

export const Menu = () => {
    const [anchorEl, setAnchorEl] = React.useState(null)
    const isOpen = Boolean(anchorEl)

    const handleOpen = (event: any) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    return (
        <React.Fragment>
            <IconButton
                color="inherit"
                edge="start"
                aria-label="open drawer"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpen}
            >
                <MenuIcon/>
            </IconButton>

            <MuiMenu 
                id="menu-appbar" 
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                getContentAnchorEl={null}
            >
                {
                    Object.keys(listRoutes).map((routeName, key) => {
                        const route = menuRoutes.find(route => route.name === routeName) as MyRouteProps
                        return (
                            <MenuItem key={key} to={route.path as string} component={Link} onClick={handleClose}>
                                {listRoutes[routeName]}
                            </MenuItem>
                        )
                    })
                }
            </MuiMenu>
        </React.Fragment>
    )
}