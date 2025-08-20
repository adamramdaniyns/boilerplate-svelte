<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import HouseIcon from '@lucide/svelte/icons/house';
	import InboxIcon from '@lucide/svelte/icons/inbox';
	import SearchIcon from '@lucide/svelte/icons/search';
	import SettingsIcon from '@lucide/svelte/icons/settings';
	import * as Sidebar from '$lib/components/ui/sidebar';
	import * as Dropdown from '$lib/components/ui/dropdown-menu';
	import { Rocket, User, CreditCard, Bell, LogOut, Package2, ChevronRight } from '@lucide/svelte';
	import * as Avatar from '$lib/components/ui/avatar';
	import * as Collapsible from '$lib/components/ui/collapsible';

	// Menu items.
	const items = [
		{
			title: 'Home',
			url: '#',
			icon: HouseIcon
		},
		{
			title: 'Inbox',
			url: '#',
			icon: InboxIcon
		},
		{
			title: 'Calendar',
			url: '#',
			icon: CalendarIcon
		},
		{
			title: 'Search',
			url: '#',
			icon: SearchIcon
		},
		{
			title: 'Settings',
			url: '#',
			icon: SettingsIcon
		},
		{
			title: 'Components',
			url: '#',
			icon: Package2,
			subMenu: [
				{
					title: 'DynamicCRUD',
					url: '/dynamic-crud'
				},
				{
					title: 'DynamicCRUD With Custom Components',
					url: '/dynamic-crud-custom'
				}
			]
		}
	];

    let isOpen = false;
</script>

<Sidebar.Root>
	<Sidebar.Header>
		<div class="w-full py-3">
			<Dropdown.DropdownMenu>
				<Dropdown.DropdownMenuTrigger class="w-full">
					<div
						class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 transition hover:bg-gray-200"
					>
						<div class="flex items-center gap-3">
							<div class="rounded-md bg-blue-600 p-2">
								<Package2 class="h-5 w-5 text-white" />
							</div>
							<div class="flex flex-col text-left">
								<span class="text-sm font-medium">Boilerplate</span>
								<span class="text-xs text-gray-400">enterprise</span>
							</div>
						</div>
						<div class="">
							<svg
								class="h-4 w-4 -rotate-90"
								fill="none"
								stroke="currentColor"
								stroke-width={2}
								viewBox="0 0 24 24"
							>
								<path d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</Dropdown.DropdownMenuTrigger>

				<Dropdown.DropdownMenuContent
					side="top"
					align="end"
					class="ml-[50%] w-64  border border-gray-200 bg-white"
				>
					<Dropdown.DropdownMenuLabel class="flex items-center gap-3 px-2 py-1.5">
						<div class="rounded-md bg-blue-600 p-2">
							<Package2 class="h-5 w-5 text-white" />
						</div>
						<div>
							<p class="text-sm font-medium">shadcn</p>
							<p class="text-xs text-gray-400">m@example.com</p>
						</div>
					</Dropdown.DropdownMenuLabel>
					<Dropdown.DropdownMenuSeparator />
					<Dropdown.DropdownMenuItem>
						<Rocket class="mr-2 h-4 w-4" />
						Upgrade to Pro
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<User class="mr-2 h-4 w-4" />
						Account
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<CreditCard class="mr-2 h-4 w-4" />
						Billing
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<Bell class="mr-2 h-4 w-4" />
						Notifications
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuSeparator />
					<Dropdown.DropdownMenuItem>
						<LogOut class="mr-2 h-4 w-4" />
						Log out
					</Dropdown.DropdownMenuItem>
				</Dropdown.DropdownMenuContent>
			</Dropdown.DropdownMenu>
		</div>
	</Sidebar.Header>
	<Sidebar.Content>
		<Sidebar.Group>
			<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
			<Sidebar.GroupContent>
				<Sidebar.Menu class="group/collapsible select-none">
					{#each items as item (item.title)}
						{#if item.subMenu}
							<Collapsible.Root>
								<Collapsible.CollapsibleTrigger class="w-full text-sm" onclick={() => {
                                    isOpen = !isOpen;
                                }}>
									<Sidebar.SidebarMenuItem class="group select-none w-full">
										<Sidebar.SidebarMenuButton class="w-full">
											<div
												class="flex cursor-pointer items-center w-full select-none gap-1 text-sm"
											>
												<item.icon class="size-5" />
												<span class="flex w-full items-center justify-between">
													{item.title}
													<ChevronRight
														class={`h-4 w-4 transition-transform duration-200 
                                                            ${isOpen ? 'rotate-90' : ''}
                                                        `}
													/>
												</span>
											</div>
										</Sidebar.SidebarMenuButton>
									</Sidebar.SidebarMenuItem>
								</Collapsible.CollapsibleTrigger>
								<Collapsible.CollapsibleContent>
									<Sidebar.MenuSub>
										{#each item.subMenu as subItem}
											<Sidebar.MenuSubItem class="hover:bg-gray-100 w-full p-2 rounded-md">
												<a href={subItem.url} class="flex items-center">
													<span>{subItem.title}</span>
												</a>
											</Sidebar.MenuSubItem>
										{/each}
									</Sidebar.MenuSub>
								</Collapsible.CollapsibleContent>
							</Collapsible.Root>
						{:else}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									{#snippet child({ props })}
										<a href={item.url} {...props}>
											<item.icon />
											<span>{item.title}</span>
										</a>
									{/snippet}
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/if}
					{/each}
				</Sidebar.Menu>
			</Sidebar.GroupContent>
		</Sidebar.Group>
	</Sidebar.Content>
	<!-- Footer -->
	<Sidebar.Footer>
		<div class="w-full py-3">
			<Dropdown.DropdownMenu>
				<Dropdown.DropdownMenuTrigger class="w-full">
					<div
						class="flex w-full cursor-pointer items-center justify-between rounded-md px-3 py-2 transition hover:bg-gray-200"
					>
						<div class="flex items-center gap-3">
							<Avatar.Avatar class="h-8 w-8 rounded-md">
								<Avatar.AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
								<Avatar.AvatarFallback>SH</Avatar.AvatarFallback>
							</Avatar.Avatar>
							<div class="flex flex-col text-left">
								<span class="text-sm font-medium">shadcn</span>
								<span class="text-xs text-gray-400">m@example.com</span>
							</div>
						</div>
						<div class="">
							<svg
								class="h-4 w-4 -rotate-90"
								fill="none"
								stroke="currentColor"
								stroke-width={2}
								viewBox="0 0 24 24"
							>
								<path d="M19 9l-7 7-7-7" />
							</svg>
						</div>
					</div>
				</Dropdown.DropdownMenuTrigger>

				<Dropdown.DropdownMenuContent
					side="top"
					align="end"
					class="ml-[50%] w-64  border border-gray-200 bg-white"
				>
					<Dropdown.DropdownMenuLabel class="flex items-center gap-3 px-2 py-1.5">
						<Avatar.Avatar class="h-8 w-8">
							<Avatar.AvatarImage src="https://github.com/shadcn.png" alt="avatar" />
							<Avatar.AvatarFallback>SH</Avatar.AvatarFallback>
						</Avatar.Avatar>
						<div>
							<p class="text-sm font-medium">shadcn</p>
							<p class="text-xs text-gray-400">m@example.com</p>
						</div>
					</Dropdown.DropdownMenuLabel>
					<Dropdown.DropdownMenuSeparator />
					<Dropdown.DropdownMenuItem>
						<Rocket class="mr-2 h-4 w-4" />
						Upgrade to Pro
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<User class="mr-2 h-4 w-4" />
						Account
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<CreditCard class="mr-2 h-4 w-4" />
						Billing
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuItem>
						<Bell class="mr-2 h-4 w-4" />
						Notifications
					</Dropdown.DropdownMenuItem>
					<Dropdown.DropdownMenuSeparator />
					<Dropdown.DropdownMenuItem>
						<LogOut class="mr-2 h-4 w-4" />
						Log out
					</Dropdown.DropdownMenuItem>
				</Dropdown.DropdownMenuContent>
			</Dropdown.DropdownMenu>
		</div>
	</Sidebar.Footer>
</Sidebar.Root>
