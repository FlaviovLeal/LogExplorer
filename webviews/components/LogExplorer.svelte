<script lang="ts">
    import { onMount } from 'svelte';
    import { QueryProcessor } from './QueryProcessor';
    let input = '';
    let query = '';
    let logclass = false;
    let TableColumn = ['message', 'level', 'Default'];
    let processor = new QueryProcessor();
    let highlightedlog: any;

    onMount(() => {
        window.addEventListener('message', (event) => {
            const message = event.data;
            switch (message.type) {
                case 'file':
                    processor.formatTextInput(message.text);
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
                    processor.query = input;
                    processor.processQuery();
                }
            }}
        />
        <table>
            <tr>
                {#each TableColumn as column}
                    <th>{column}</th>
                {/each}
            </tr>
            {#each processor.processedObject as row}
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
