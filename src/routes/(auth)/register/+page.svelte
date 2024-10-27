<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import PrimaryButton from '$lib/components/buttons/PrimaryButton.svelte';
	import ErrorText from '$lib/components/layout/ErrorText.svelte';
	import InputField from '$lib/components/layout/InputField.svelte';
	import { page } from '$app/stores';

	export let data;

	const { form, errors, constraints } = superForm(data.form);
</script>

<InputField
	placeholder="example"
	title="Name"
	name={'username'}
	type="text"
	bind:value={$form.username}
	{...$constraints.username}
/>
{#if $errors.username}
	<ErrorText>
		{$errors.username}
	</ErrorText>
{/if}

<InputField
	placeholder="example@exemple.com"
	title="Email"
	type="text"
	name={'email'}
	bind:value={$form.email}
	{...$constraints.email}
/>
{#if $errors.email}
	<ErrorText>
		{$errors.email}
	</ErrorText>
{/if}

<InputField
	placeholder="123456"
	title="Password"
	type="text"
	name={'password'}
	bind:value={$form.password}
	{...$constraints.password}
/>
{#if $errors.password}
	<ErrorText>
		{$errors.password}
	</ErrorText>
{/if}

<InputField
	placeholder="123456"
	type="text"
	title="Verify password"
	name={'verifyPassword'}
	bind:value={$form.verifyPassword}
	{...$constraints.verifyPassword}
/>
{#if $errors.verifyPassword}
	<ErrorText>
		{$errors.verifyPassword}
	</ErrorText>
{/if}

<ErrorText>
	{#if $errors._errors || $page.form?.message}
		<strong>{$errors._errors?.at(0) ?? $page.form?.message ?? ''}</strong>
	{:else}
		<strong>&nbsp;</strong>
	{/if}
</ErrorText>

<PrimaryButton type="submit" className="w-[95%] mx-auto mt-2 font-bold">Register</PrimaryButton>
