<script lang="ts">
	import Header from "./Header.svelte";
	import {route} from "./router";
	import AccountPage from "./Account/AccountPage.svelte";

	export let name: string;

	let accountDialogShown = false;

	route.on("*/account/*", state=>accountDialogShown=state, true)

	const accountClicked = () =>{
		route.toggle("account")
	}
</script>

<main>
	<div class="main">
		<div class="header">
			<Header on:account_clicked={accountClicked} />
		</div>
	</div>
</main>

{#if accountDialogShown}
	<AccountPage on:close={accountClicked} />
{/if}

<style>
	main {
		position: absolute;
		top: 0;
		left: 0;
		width: 100vw;
		height: 100vh;
		overflow: hidden;
		color: white;
	}
	.main {
		display: flex;
		flex-flow: column;
		height: 100%;
	}
	.header {
		flex: 0 1 auto;
		overflow: hidden;
		height: 54px;
		box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
		0 6px 20px 0 rgba(0, 0, 0, 0.19);
		/* z-index: 2; */
	}
</style>