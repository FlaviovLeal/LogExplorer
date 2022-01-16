<script lang="ts">
    import { onMount } from "svelte";
    let json_object = [{"level": "error", "message":"Weird message"}, {"level": "error", "message":"Normal message"}, {"level": "info", "message":"WTF message"}]
    let path = ''
    let query = ''
    let log = 'Inicio'
    let configclass = 'sidenavclosed'
    let logclass = 'sidenavclosed'
    let mainclass = 'mainopen'
    let highlightedlog = {}

    onMount(() => {
        window.addEventListener("message", (event) => {
            log = 'init event'
            const message = event.data
            switch(message.type){
                case "jsonFile":
                    console.log('red');
                    log = 'Got message'
                    break
                default:
                log = 'Got message wrong process'
            }

        })
    })
    function openconfig(){
        configclass = 'sidenavopen'
        logclass = 'sidenavclosed'
        mainclass = 'mainclosed'
    }
    function openlog(log: object){
        highlightedlog = log
        configclass = 'sidenavclosed'
        logclass = 'sidenavopen'
        mainclass = 'mainclosed'
    }
    function closenav(){
        configclass = 'sidenavclosed'
        logclass = 'sidenavclosed'
        mainclass = 'mainopen'
    }
;
</script>

<style>

</style>

<div class={mainclass}>
    <h3>Resposta: {log}</h3>
    <button on:click={openconfig}>Open Config {query}</button>
    <h3>Query input</h3>
    <input type='text' bind:value={query}>
    <button>Processs query</button>
    <button on:click={() => tsvscode.postMessage({"type":"onInfo", "value":"Eita"})}> Load File </button>

    {#each json_object as row}
        <div class='clickable'>
            <p> ={() => openlog(row)}> {JSON.stringify(row["message"])}</p>
        </div>
    {/each}
</div>

<!--config -->
<div class={configclass}>
    <h3>Path input</h3>
    <input type='text' bind:value={path}>
    <button on:click={closenav}>Load File</button>
</div>

<div class={logclass}>
    <style>
        div {
        white-space: pre-wrap;
    }
    </style>
    <p>{JSON.stringify(highlightedlog, undefined, 4)}</p>
</div>
