<script lang="ts">
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import {
		DateFormatter,
		type DateValue,
		getLocalTimeZone,
		parseDate
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	export let value: any = null;
	export let contentRef: any = null;

	function getDateOnly(isoString: string) {
		return isoString?.split('T')[0];
	}

	function formatDateString(date: string) {
		try {
			return parseDate(getDateOnly(date)).toDate(getLocalTimeZone());
		} catch (error) {
			console.error('Error formatting date:', error);
			return null;
		}
	}

	$: if (value && typeof value === 'string') {
		value = parseDate(getDateOnly(value));
	}
</script>

<Popover.Root>
	<Popover.Trigger
		class={cn(
			buttonVariants({
				variant: 'outline',
				class: 'w-full justify-start text-left font-normal col-span-3'
			}),
			!value && 'text-muted-foreground'
		)}
	>
		<CalendarIcon />
		{value
			? df.format(
					typeof value === 'string' ? formatDateString(value) : value.toDate(getLocalTimeZone())
				)
			: 'Pick a date'}
	</Popover.Trigger>
	<Popover.Content bind:ref={contentRef} class="w-full p-0">
		<Calendar type="single" bind:value class="w-full" />
	</Popover.Content>
</Popover.Root>
