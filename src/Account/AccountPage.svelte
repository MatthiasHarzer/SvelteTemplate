<script lang="ts">
    import CloseButton from "../Util/CloseButton.svelte";
    import {createEventDispatcher} from "svelte";
    import AccountSnippet from "./AccountSnippet.svelte";
    import {logOut, signInWithGoogle, user} from "../firebase-handler";
    import {isBackgroundClick} from "../Util/util";

    const dispatch = createEventDispatcher();

    const close = () => {
        dispatch("close");
    }

    const bgClickEvent = (e) => {
        if (isBackgroundClick(e)) {
            close();
        }
    };
</script>

<main class="blur-background bg" on:click={bgClickEvent}>
    <div class="dialog-wrapper responsive">
        <div class="close-btn-wrapper">
            <CloseButton on:click={close}/>
        </div>
        <h3>Account</h3>
        <div class="content centered">
            <AccountSnippet />
            {#if $user}

                <button class="logout" on:click={logOut}>Logout</button>
            {:else}
                <button class="login-btn google" on:click={signInWithGoogle}
                ><img src="./imgs/google.png" alt="G-Logo" />Login with
                    Google</button
                >
            {/if}
        </div>
    </div>
</main>

<style>
    .logout {
        width: 80%;
        max-width: 300px;
        border: none;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        background-color: rgb(97, 4, 4);
        color: white;
        margin: 30px auto 10px auto;
        border-radius: 3px;
    }
    .login-btn {
        font-size: 18px;

        border-radius: 4px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
            0 6px 20px 0 rgba(0, 0, 0, 0.19);
        width: 80%;
        max-width: 250px;
        margin: 30px auto 10px auto;
        padding-bottom: 7px;
    }
    .login-btn img {
        display: inline-block;
        width: 20px;
        height: 20px;
        position: relative;
        top: 3px;
        margin-right: 10px;
    }

    .login-btn.google {
        border: 1px solid var(--greyed);
        background-color: white;
    }
</style>