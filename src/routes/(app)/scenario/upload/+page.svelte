<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { SCENARIO_SCHEMA, SCENARIO_TITLE_MAX, SCENARIO_TITLE_MIN } from '$lib/scenario.schema';
	import type { PageData } from './$types';

	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import * as Tooltip from '$lib/components/ui/tooltip';

	export let data: PageData;

	const form = superForm(data.form, {
		validators: zod(SCENARIO_SCHEMA)
	});
	const { form: formData, enhance } = form;
</script>

<section class="mx-auto w-full max-w-5xl px-4 lg:px-0">
	<header class="mb-12 flex w-full items-end space-x-4 border-b border-input px-4 pb-4">
		<hgroup>
			<h2 class="text-lg font-bold">
				<span class="icon-[tabler--upload] align-text-bottom text-2xl" />
				{data.seo.title}
			</h2>
			<p>
				{data.seo.description}
			</p>
		</hgroup>
	</header>

	<form method="post" use:enhance>
		<Form.Field {form} name="title">
			<Form.Control let:attrs>
				<Form.Label>
					<span>Title</span>
					<Tooltip.Root>
						<Tooltip.Trigger>
							<span class="icon-[tabler--info-circle] align-text-bottom text-lg text-input" />
						</Tooltip.Trigger>
						<Tooltip.Content>
							<p>
								The title needs to be between {SCENARIO_TITLE_MIN}-{SCENARIO_TITLE_MAX}
								characters long.
							</p>
							<p>It can only contain spaces and these characters: A-Za-z0-9_-</p>
						</Tooltip.Content>
					</Tooltip.Root>
				</Form.Label>
				<Input placeholder="My scenario ..." {...attrs} bind:value={$formData.title} />
			</Form.Control>
			<Form.FieldErrors />
		</Form.Field>
	</form>
</section>
