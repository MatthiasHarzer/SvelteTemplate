<script>

    import {user} from "./firebase-handler";
    import {createEventDispatcher} from "svelte";

    const dispatch = createEventDispatcher();



    let version = "0.0.1";

    navigator.serviceWorker.ready.then((registration) => {
        // console.log("READY");
        registration.active.postMessage("Hi service worker");
    });
    navigator.serviceWorker.addEventListener("message", (d) => {
        // console.log(d);
        version = d.data.version;
    });


    const accountClicked = () => {
        dispatch("account_clicked");
    };

</script>

<main>
    <div class="input-snippet" on:click={accountClicked}>
        {#if $user}
            <img src={$user.photoURL || "./imgs/account.png"} alt="avatar"/>
        {:else}
            <h3>Log in</h3>
        {/if}
    </div>
</main>


<style>
    .menu {
        position: absolute;
        z-index: 1;
    }

    .menu-container {
        background-color: #333;
        width: 150px;
        height: calc(100vh - 54px);
        position: absolute;
        left: -150px;
        transition: left 0.5s ease-in-out;
    }

    .menu.visible .menu-container {
        left: 0;
    }

    .items ul {
        padding: 0;
        list-style: none;
    }

    .items ul li {
        cursor: pointer;
        padding: 10px 15px;
        /* margin: auto 15px; */
        display: flex;
        flex-flow: row;

        align-items: center;
    }

    .items button {
        flex: 1 1 auto;

        font-size: 18px;

        border: none;
        border-radius: 3px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
        padding: 5px 15px;
        margin: auto 0;
        display: flex;
        align-items: center;

        color: white;
    }

    .items ul li button img {
        height: 22px;
        margin-right: 10px;
    }

    .new {
        background-color: var(--click-color);
    }

    .edit {
        background-color: rgb(34, 34, 34);
        transition: all 0.3s ease-in-out !important;
    }

    .edit.disabled {
        background-color: rgb(156, 156, 156);
        color: rgb(100, 100, 100);
    }

    .settings-item {
        padding: 5px 0;
        position: relative;
        display: flex;
        flex: 1 1 auto;
    }

    .settings-item span {
        position: absolute;
        top: 0;
        left: 0;
        color: var(--greyed);
    }

    .settings-item button {
        position: relative;
        margin-top: 15px;
        background-color: rgb(34, 34, 34);
        justify-content: center;
    }

    .version {
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
    }

    .version p {
        position: absolute;
        color: rgb(131, 131, 131);
        bottom: 0;
        margin: 10px 0 10px 10px;
    }

    main {
        height: 100%;
        display: flex;
        flex-flow: row;
        background-color: #333;
        position: relative;
    }

    .input-snippet {
        display: flex;
        align-items: center;
        float: right;
        margin-left: auto;
        margin-right: 15px;
        position: relative;
    }

    .input-snippet img {
        height: 70%;
        border-radius: 100%;
        border: 2px rgba(0, 0, 0, 0.137) solid;
    }

    .input-snippet h3 {
        font-weight: normal;
        background-color: var(--click-color);
        color: white;
        border-radius: 3px;
        padding: 5px 15px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2),
        0 6px 20px 0 rgba(0, 0, 0, 0.19);
    }
</style>
