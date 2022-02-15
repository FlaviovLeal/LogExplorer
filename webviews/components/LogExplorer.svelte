<script lang="ts">
    import { onMount } from 'svelte';
    import { process_query } from './QueryProcessor.svelte';
    let json_object: any;
    let processed_object: any;
    let input = '';
    let query = '';
    let logclass = 'sidenavclosed';
    let mainclass = 'mainopen';
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
                    processed_object = process_query(query, json_object);
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
        logclass = 'sidenavopen';
        mainclass = 'mainclosed';
    }
    function closenav() {
        logclass = 'sidenavclosed';
        mainclass = 'mainopen';
    }
</script>

<div class={mainclass}>
    <h3>Query input</h3>
    <input
        type="text"
        bind:value={input}
        on:keypress={(event) => {
            if (event.key === 'Enter') {
                query = input;
                processed_object = process_query(query, json_object);
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

<div class={logclass}>
    <style>
        div {
            white-space: pre-wrap;
        }
    </style>
    <p>{JSON.stringify(highlightedlog, undefined, 4)}</p>
</div>
