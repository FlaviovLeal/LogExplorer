<script context="module" lang="ts">
    function process_assert(query_part: string, document: any): boolean {
        console.log('Starting process_assert as ' + query_part + ' ' + document.toString());
        const rekeyvalue = /^\s*"([\w\-\.]+)"(=|!=|<=|<|>|>=)"([\w,-,\s]+)"/i;
        let match = query_part.match(rekeyvalue);
        if (match) {
            console.log('Indentified signal 1: ' + match[1] + ' 2: ' + match[2] + ' 3: ' + match[3]);
            if (match[1] in document) {
                switch (match[2]) {
                    case '=':
                        return document[match[1]].toString() == match[3];
                    case '!=':
                        return document[match[1]].toString() != match[3];
                    case '>':
                        return parseFloat(document[match[1]].toString()) > parseFloat(match[3]);
                    case '>=':
                        return parseFloat(document[match[1]].toString()) >= parseFloat(match[3]);
                    case '<':
                        return parseFloat(document[match[1]].toString()) < parseFloat(match[3]);
                    case '<=':
                        return parseFloat(document[match[1]].toString()) <= parseFloat(match[3]);
                    default:
                        console.log('process_assert returned false due to no match[2]');
                        return false;
                }
            } else {
                console.log('process_assert returned false due to no match');
                return false;
            }
        }
        throw new Error("Can't understand statement");
    }
    function calc_or(subquery: string, document: any): boolean {
        console.log('Starting calc_or as ' + subquery + ' ' + document.toString());
        for (let i of subquery.split(/\s+or\s+/i)) {
            if (process_assert(i, document)) {
                console.log('calc_or returned true');
                return true;
            }
        }
        console.log('calc_or returned false');
        return false;
    }
    function calc_and(subquery: string, document: any): boolean {
        console.log('Starting calc_and as ' + subquery + ' ' + document.toString());
        for (let i of subquery.split(/\s+and\s+/i)) {
            if (!calc_or(i, document)) {
                console.log('calc_and returned false');
                return false;
            }
        }
        console.log('calc_and returned true');
        return true;
    }

    export function process_query(query: string, json_object: any): any {
        try {
            if (query === '') {
                return json_object;
            } else {
                return json_object.filter((document: any) => {
                    return calc_and(query, document);
                });
            }
        } catch (e: unknown) {
            let m = '';
            if (typeof e === 'string') {
                // works, `e` narrowed to string
                m = e;
            } else if (e instanceof Error) {
                m = e.message; // works, `e` narrowed to Error
            }
            console.log('Found while processinig string' + m);
            return json_object;
        }
    }
</script>
