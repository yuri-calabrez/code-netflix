import * as React from 'react'
import { IconButton, MenuItem, Menu as MuiMenu, Divider } from '@material-ui/core'
import AccountBox from '@material-ui/icons/AccountBox'
import { useKeycloak } from '@react-keycloak/web'

const UserAccountMenu = () => {
    const {keycloak, initialized} = useKeycloak()
    const [anchorEl, setAnchorEl] = React.useState(null)
    const isOpen = Boolean(anchorEl)

    const handleOpen = (event: any) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    if (!initialized || !keycloak.authenticated) {
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
                <MenuItem> Minha Conta </MenuItem>
                <MenuItem> Logout </MenuItem>
            </MuiMenu>
        </React.Fragment>
    )
}

export default UserAccountMenu