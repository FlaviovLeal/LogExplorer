<script lang="ts">
    import { onMount } from 'svelte';
    import { QueryProcessor } from './QueryProcessor';
    import { clickOutside } from './clickOutside';
    let input = '';
    let logclass = false;
    let TableColumn = ['message', 'level', 'Default'];
    let processor = new QueryProcessor();
    let highlightedlog: any;
    let open = false;
    let mouse_x = '0';
    let mouse_y = '0';
    let open_key: string;
    let open_value: string;

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

    function opendrop(event: any, key: any, value: any) {
        open = true;
        open_key = key;
        open_value = value;
        mouse_x = event.clientX.toString() + 'px';
        mouse_y = event.clientY.toString() + 'px';
    }
    function closedrop() {
        open = false;
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
        <div class="sidenav" style="flex:3; " use:clickOutside on:click_outside={closenav}>
            {#each Object.keys(highlightedlog) as key}
                <p on:click={(event) => opendrop(event, key, highlightedlog[key])}>
                    {key + ': ' + JSON.stringify(highlightedlog[key], undefined, 4)}
                </p>
            {/each}
        </div>
    {/if}
</div>

{#if open}
    <div
        use:clickOutside
        on:click_outside={closedrop}
        class="dropdown-content"
        style:top={mouse_y}
        style:left={mouse_x}
    >
        <menu class="dropdown-content">
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '=');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Search only value
            </li>
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '!=');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Exclude value
            </li>
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '>');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Greater than value
            </li>
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '>=');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Greater or equal than value
            </li>
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '<');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Less than value
            </li>
            <li
                class="menu-item"
                on:click={() => {
                    processor.addCondition(open_key, open_value, '<=');
                    input = processor.query;
                    closedrop();
                    processor.processedObject = processor.processedObject;
                }}
            >
                Less or equal than
            </li>
            <li class="menu-break" style="color:gray">⸺⸺⸺⸺⸺⸺⸺</li>
            <li class="menu-item">Inspect element (not working)</li>
        </menu>
    </div>
{/if}
