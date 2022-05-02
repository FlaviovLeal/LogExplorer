<script lang="ts">
    import { onMount } from 'svelte';
    import { processQuery } from './QueryProcessor';
    let json_object: any;
    let processed_object: any;
    let input = '';
    let query = '';
    let logclass = false;
    let highlightedlog = {};
    let TableColumn = ['message', 'level', 'Default'];
    let formated = '';
    json_object = [{ Default: 'Default2' }];
    processed_object = [{ Default: 'Default' }];

    onMount(() => {
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.type) {
                case 'file':
                    formated = message.text.replace(/\n/g, ',').slice(0, -1);
                    formated = '[' + formated + ']';
                    json_object = JSON.parse(formated);
                    json_object.reverse();
                    processed_object = processQuery(query, json_object);
                    break;
                case 'config':
                    TableColumn = message.text;
                default:
            }
        });
    });
    tsvscode.postMessage({ type: 'getText', value: '' });
    function openlog(row: any) {
        highlightedlog = row;
        logclass = true;
    }
    function closenav() {
        logclass = false;
    }
</script>

<div style="display:flex;">
    <div style="flex:7;">
        <h3>Query input</h3>
        <input
            type="text"
            bind:value={input}
            on:keypress={(event) => {
                if (event.key === 'Enter') {
                    query = input;
                    processed_object = processQuery(query, json_object);
                } else {
                }
            }}
        />
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
    {#if logclass}
        <div class="sidenav" style="flex:3; ">
            <p>{JSON.stringify(highlightedlog, undefined, 4)}</p>
        </div>
    {/if}
</div>
