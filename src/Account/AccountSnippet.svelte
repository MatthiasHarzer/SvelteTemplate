<script lang="ts">
    import { user } from "../firebase-handler";
    import { fade } from "svelte/transition";

    let name: string;

    $: profile_img_url = $user ? $user.photoURL : "./imgs/account.png";
    $: displayName = $user ? $user.displayName : "Not logged in!";
    $: name = displayName;


    // openEdit();
</script>

<main>
    <div class="wrapper">
        <img src={profile_img_url} alt="Avatar" class="avatar" />
        <div class="name-wrapper">
            <span class="display-name-hint">Name</span>
            <span class="display-name">{name}</span>
        </div>

    </div>
</main>

<style>
    main {
        flex: 1 1 auto;
        position: relative;
        display: flex;
        justify-items: center;
        width: 100%;
    }

    .wrapper {
        font-size: 25px;
        margin: 0 auto 0 auto;
        /*white-space: nowrap;*/
        /*overflow-x: hidden;*/
        /*text-overflow: ellipsis;*/
        /*max-width: 90%;*/
        position: relative;
        display: flex;
        align-items: center;
    }

    .wrapper .avatar {
        flex: 0 1 auto;
        text-align: left;
        top: 0;
        margin-right: 20px;
        position: relative;

        height: 42px;
        border-radius: 100%;
        border: 10px rgb(56, 56, 56) double;
    }

    .wrapper .name-wrapper {
        overflow: hidden;

        flex: 1 0 auto;
        display: flex;
        align-items: center;
        width: auto;
    }

    .wrapper .name-wrapper .display-name {
        flex: 1 0 auto;
        white-space: nowrap;
        overflow-x: hidden;
        text-overflow: ellipsis;
        /* top: -20px;

        padding-right: 5px; */
    }
    .wrapper .name-wrapper .display-name-hint {
        position: absolute;
        top: 0px;
        margin-left: -5px;
        color: var(--greyed);
        font-size: 13px;
    }

</style>
