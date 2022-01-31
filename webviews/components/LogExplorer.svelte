<script lang="ts">
    import { onMount } from 'svelte';
    import QueryProcessor from './QueryProcessor.svelte';
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
                    processed_object = QueryProcessor.process_query(
                        query,
                        json_object
                    );
                    break;
                case 'config':
                    TableColumn = message.text;
                default:
            }
        });
    });
    function process_assert(query_part: string, document: any): boolean {
        const rekeyvalue = /^\s*"([\w\-\.]+)"(=|!=)"([\w,-]+)"/i;
        let match = query_part.match(rekeyvalue);
        if (match) {
            console.log(match[1], match[2], match[3]);
            if (match[1] in document) {
                if (match[2] === '=') {
                    if (document[match[1]] === match[3]) {
                        return true;
                    }
                    return false;
                }
                if (match[2] === '!=') {
                    if (document[match[1]] === match[3]) {
                        return false;
                    }
                    return true;
                }
            } else {
                return false;
            }
        }
        console.log('not match', query_part);
        throw new Error('Can understand statement');
    }
    function calc_or(subquery: string, document: any): boolean {
        for (let i of subquery.split(/\s+or\s+/i)) {
            if (process_assert(i, document)) {
                return true;
            }
        }
        return false;
    }
    function calc_and(subquery: string, document: any): boolean {
        for (let i of subquery.split(/\s+and\s+/i)) {
            if (!calc_or(i, document)) {
                return false;
            }
        }
        return true;
    }

    function process_query(query: string) {
        console.log('processing: ', query);
        try {
            if (query === '') {
                processed_object = json_object;
            } else {
                processed_object = json_object.filter((document: any) => {
                    return calc_and(query, document);
                });
            }
        } catch {}
    }
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
                processed_object = QueryProcessor.process_query(
                    query,
                    json_object
                );
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
                    <td on:click={() => openlog(row)}
                        >{JSON.stringify(row[column])}</td
                    >
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
