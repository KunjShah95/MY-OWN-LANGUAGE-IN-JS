function lexer(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
        let char = input[cursor];
       
        //skips whitespace
        if(/\s/.test(char)) {
            cursor++;
            continue;
        }

        //checks for  characters
        if(/[a-zA-Z]/.test(char)) {
            let word = '';
            while(/[a-zA-Z]/.test(char)) {
                word += char;
                char = input[++cursor];
            }
            if(word === 'ye' || word === 'bol') {
            tokens.push({type: 'keyword', value: word});
        }
        else {
            tokens.push({type: 'identifier', value: word});
        }

        continue;
        }
        //checks for numbers
        if(/[0-9]/.test(char)) {
            let number = '';
            while(/[0-9]/.test(char)) {
                number += char;
                char = input[++cursor];
            }
            tokens.push({type: 'number', value: number});
            continue;
        }
        //tokenize operators and equals sign
        if(/[\+\-\*\/=]/.test(char)) {
            tokens.push({type: 'operator', value: char});
            cursor++;
            continue;
        }

    }

    return tokens;
}

function parser(tokens) {
    const ast = {
    type: 'Program',
    body: [],
};

    while (tokens.length > 0) {
        let token = tokens.shift();
        if (token.type === 'keyword' && token.value === 'ye') {
            let declaration = {
                type: 'Declaration',
                name: tokens.shift().value,
                value: null
            };

            //checks for assignment
            if(tokens[0].type === 'operator' && tokens[0].value === '=') {
                tokens.shift(); //consume '='
                //Parse the expression
                let expression =''; // 10 + 20
                while(tokens.length > 0 && tokens[0].type !== 'keyword') {
                expression += tokens.shift().value;
                }
            declaration.value = expression.trim();
        }

        ast.body.push(declaration);
    }
        if (token.type === 'keyword' && token.value === 'bol') {
            let declaration = {
                type: 'Print',
                expression: tokens.shift().value,
            };
            ast.body.push(declaration);
        }
    }
    return ast;
}

function codeGen(node){
    switch(node.type) {
        case 'Program':
        return node.body.map(codeGen).join('\n');
        case 'Declaration':
        return `const ${node.name} = ${node.value};`;
        case 'Print':
        return `console.log(${node.expression});`;
    }
}

function compiler(input) {
    const tokens = lexer(input);
    const ast = parser(tokens);
    const executableCode = codeGen(ast);
    return executableCode;
}

function runner(input){
    eval(input);
}



const code= `
ye x = 10
ye y = 10

ye sum = x + y
bol sum
`


const exec = compiler(code);
runner(exec);