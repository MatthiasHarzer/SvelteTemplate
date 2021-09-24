<script lang="ts">
    import {createEventDispatcher} from "svelte";
    import CloseButton from "./Util/CloseButton.svelte";

    const dispatch = createEventDispatcher();

    const close = () => {
        dispatch("close");
    }
</script>
<main class="blur-background bg">
    <div class="dialog-wrapper">
        <div class="close-btn-wrapper">
            <CloseButton on:click={close}/>
        </div>
        <h3>Sample dialog</h3>
        <div class="content">
        </div>
    </div>
</main>