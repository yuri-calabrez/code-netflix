import * as React from 'react'
import { IconButton, MenuItem, Menu as MuiMenu, Divider, Link } from '@material-ui/core'
import AccountBox from '@material-ui/icons/AccountBox'
import { useHasClient, useHasRealmRole } from '../../hooks/useHasRole'
import { keycloakLinks } from '../../util/auth'

const UserAccountMenu = () => {
    const hasCatalogAdmin = useHasRealmRole('catalog-admin')
    const hasAdminRealm = useHasClient('realm-manegement')
    const [anchorEl, setAnchorEl] = React.useState(null)
    const isOpen = Boolean(anchorEl)

    const handleOpen = (event: any) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    if (!hasCatalogAdmin) {
        return null
    }

    return (
        <React.Fragment>
            <IconButton
                color="inherit"
                edge="end"
                aria-label="open drawer"
                aria-controls="menu-user-accont"
                aria-haspopup="true"
                onClick={handleOpen}
            >
                <AccountBox/>
            </IconButton>

            <MuiMenu 
                id="menu-user-accont" 
                open={isOpen}
                anchorEl={anchorEl}
                onClose={handleClose}
                anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
                transformOrigin={{vertical: 'top', horizontal: 'center'}}
                getContentAnchorEl={null}
            >
                <MenuItem disabled={true}> Fulano da Silva </MenuItem>
                <Divider/>
                {hasAdminRealm && (
                    <MenuItem 
                        component={Link} 
                        href={keycloakLinks.adminConsole} 
                        target="_blank" 
                        rel="noopener"
                        color="textPrimary"
                        onClick={handleClose}
                    > 
                        Auth. Admin
                    </MenuItem>
                )}
                <MenuItem 
                    component={Link} 
                    href={keycloakLinks.accountConsole} 
                    target="_blank" 
                    rel="noopener"
                    color="textPrimary"
                    onClick={handleClose}
                > 
                    Minha Conta
                </MenuItem>
                <MenuItem> Logout </MenuItem>
            </MuiMenu>
        </React.Fragment>
    )
}

export default UserAccountMenu