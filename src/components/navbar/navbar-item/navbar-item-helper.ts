import { MNavbarItem } from './navbar-item';
export class NavbarItemHelper {
    isRouterLinkActive(navbarItem: MNavbarItem): boolean {
        return !!navbarItem.$el.querySelector('.router-link-active');
    }
}

export default new NavbarItemHelper();
