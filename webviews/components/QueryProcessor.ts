function processAssert(query_part: string, document: any): boolean {
    console.log('Starting processAssert as ' + query_part + ' ' + document.toString());
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
                    console.log('processAssert returned false due to no match[2]');
                    return false;
            }
        } else {
            console.log('processAssert returned false due to no match');
            return false;
        }
    }
    throw new Error("Can't understand statement");
}
function calcOr(subquery: string, document: any): boolean {
    console.log('Starting calcOr as ' + subquery + ' ' + document.toString());
    for (let i of subquery.split(/\s+or\s+/i)) {
        if (processAssert(i, document)) {
            console.log('calcOr returned true');
            return true;
        }
    }
    console.log('calcOr returned false');
    return false;
}
function calcAnd(subquery: string, document: any): boolean {
    console.log('Starting calcAnd as ' + subquery + ' ' + document.toString());
    for (let i of subquery.split(/\s+and\s+/i)) {
        if (!calcOr(i, document)) {
            console.log('calcAnd returned false');
            return false;
        }
    }
    console.log('calcAnd returned true');
    return true;
}

export function processQuery(query: string, json_object: any): any {
    try {
        if (query === '') {
            return json_object;
        } else {
            return json_object.filter((document: any) => {
                return calcAnd(query, document);
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

export class QueryProcessor {
    columns: string[];
    textInput: string;
    jsonObject: JSON;
    processedObject: JSON;

    constructor(columns: string[], textInput: string) {
        this.columns = columns;
        this.textInput = textInput;
        this.jsonObject = this.formatTextInput(textInput);
        this.processedObject = this.jsonObject;
    };

    formatTextInput(textInput: string){
        textInput = textInput.replace(/\n/g, ',').slice(0, -1);
        textInput = '[' + textInput + ']';
        return JSON.parse(textInput).reverse();
    };

}