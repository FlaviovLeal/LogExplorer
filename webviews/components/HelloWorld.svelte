<script lang="ts">
    import { onMount } from "svelte";
    let json_object: any
    let processed_object: any
    let path = ''
    let input = ''
    let query = ''
    let configclass = 'sidenavclosed'
    let logclass = 'sidenavclosed'
    let mainclass = 'mainopen'
    let highlightedlog = {}
    let TableColumn = ["message", "level"]
    let formated = ''
    json_object = [{"Default":"Default"}]
    processed_object = [{"Default":"Default"}]

    onMount(() => {
        window.addEventListener("message", (event) => {
            const message = event.data
            switch(message.type){
                case "file":
                    formated = message.text.replace(/\n/g, ","
                    ).slice(0, -1);
                    formated = "[" + formated + "]";
                    json_object = JSON.parse(formated);
                    json_object.reverse()
                    process_query(query)
                    break
                default:
            }

        })
    })
    function reduce_key_value(query:string, document: any): boolean {
        const rekeyvalue = /^\s*"([\w\-\.]+)"(=|!=)"([\w,-]+)"/
        let match = query.match(rekeyvalue)
        if (match) {
            if (match[2] === '='){
                if (document[match[1]].toString() === match[3]){
                    return true
                }
                return false
            }
            if (match[2] === '!='){
                if (document[match[1]].toString() === match[3]){
                    return false
                }
                return true
            }
        }
        return true
    };
    function reduce_and(query:string, document:Object) {};
    function reduce_or(query:string, document:Object){};
    function reduce_brackets(query:string, document:Object){
        const reparenteses =/(\([^()]*\))/
    };
    function process_query(query:string){
        processed_object = json_object.filter((x:any)=>{return reduce_key_value(query, x)})
    }

    function openconfig() {
        configclass = 'sidenavopen'
        logclass = 'sidenavclosed'
        mainclass = 'mainclosed'
    }
    function openlog(row: any) {
        highlightedlog = row
        configclass = 'sidenavclosed'
        logclass = 'sidenavopen'
        mainclass = 'mainclosed'
    }
    function closenav() {
        configclass = 'sidenavclosed'
        logclass = 'sidenavclosed'
        mainclass = 'mainopen'
    }

;
    let variavel =''
</script>

<div class={mainclass}>
    <button on:click={openconfig}>Open Config {variavel}</button>
    <h3>Query input</h3>
    <input type='text' bind:value={input} on:keypress={(event)=>{if (event.key ==='Enter'){query = input; process_query(query)}}}>
    <button on:click={()=>{query = input; process_query(query)}}>Processs query</button>
    <table>
    <tr>
    {#each TableColumn as column}
        <th>{column}</th>
    {/each}
    </tr>
    {#each processed_object as row}
        <tr>
            {#each TableColumn as column}
                <td on:click={() => openlog(row)}>{JSON.stringify(row[column])}</td>
            {/each}
        </tr>
    {/each}
    </table>
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
