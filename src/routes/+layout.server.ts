export async function load({ locals }) {
    // here u can fetch data like sidebar menu
    // const sidebarMenu = await fetchSidebarMenuData();

	return {
		user: locals.user,
        // sidebarMenu
	};
}
