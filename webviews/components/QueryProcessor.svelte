<script lang="ts">
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

    export function process_query(query: string, json_object: any): any {
        try {
            if (query === '') {
                return json_object;
            } else {
                return json_object.filter((document: any) => {
                    return calc_and(query, document);
                });
            }
        } catch {
            return json_object;
        }
    }
</script>
