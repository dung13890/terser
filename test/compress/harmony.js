arrow_functions: {
    input: {
        (a) => b;  // 1 args
        (a, b) => c;  // n args
        () => b;  // 0 args
        (a) => (b) => c;  // func returns func returns func
        (a) => ((b) => c);  // So these parens are dropped
        () => (b,c) => d;  // func returns func returns func
        a=>{return b;}
        a => 'lel';  // Dropping the parens
    }
    expect_exact: "a=>b;(a,b)=>c;()=>b;a=>b=>c;a=>b=>c;()=>(b,c)=>d;a=>{return b};a=>\"lel\";"
}

arrow_function_parens: {
    input: {
        something && (() => {});
    }
    expect_exact: "something&&(()=>{});"
}
arrow_function_parens_2: {
    input: {
        (() => null)();
    }
    expect_exact: "(()=>null)();"
}

regression_arrow_functions_and_hoist: {
    options = {
        hoist_vars: true,
        hoist_funs: true
    }
    input: {
        (a) => b;
    }
    expect_exact: "a=>b;"
}

computed_property_names: {
    input: {
        obj({ ["x" + "x"]: 6 });
    }
    expect_exact: 'obj({["x"+"x"]:6});'
}

typeof_arrow_functions: {
    options = {
        evaluate: true
    }
    input: {
        typeof (x) => null;
    }
    expect_exact: "\"function\";"
}

template_strings: {
    input: {
        ``;
        `xx\`x`;
        `${ foo + 2 }`;
        ` foo ${ bar + `baz ${ qux }` }`;
    }
    expect_exact: "``;`xx\\`x`;`${foo+2}`;` foo ${bar+`baz ${qux}`}`;";
}

template_string_prefixes: {
    input: {
        String.raw`foo`;
        foo `bar`;
    }
    expect_exact: "String.raw`foo`;foo`bar`;";
}

destructuring_arguments: {
    input: {
        (function ( a ) { });
        (function ( [ a ] ) { });
        (function ( [ a, b ] ) { });
        (function ( [ [ a ] ] ) { });
        (function ( [ [ a, b ] ] ) { });
        (function ( [ a, [ b ] ] ) { });
        (function ( [ [ b ], a ] ) { });

        (function ( { a } ) { });
        (function ( { a, b } ) { });

        (function ( [ { a } ] ) { });
        (function ( [ { a, b } ] ) { });
        (function ( [ a, { b } ] ) { });
        (function ( [ { b }, a ] ) { });

        ( [ a ] ) => { };
        ( [ a, b ] ) => { };

        ( { a } ) => { };
        ( { a, b, c, d, e } ) => { };

        ( [ a ] ) => b;
        ( [ a, b ] ) => c;

        ( { a } ) => b;
        ( { a, b } ) => c;
    }
    expect: {
        (function(a){});
        (function([a]){});
        (function([a,b]){});
        (function([[a]]){});
        (function([[a,b]]){});
        (function([a,[b]]){});
        (function([[b],a]){});

        (function({a}){});
        (function({a,b}){});

        (function([{a}]){});
        (function([{a,b}]){});
        (function([a,{b}]){});
        (function([{b},a]){});

        ([a])=>{};
        ([a,b])=>{};

        ({a})=>{};
        ({a,b,c,d,e})=>{};

        ([a])=>b;
        ([a,b])=>c;

        ({a})=>b;
        ({a,b})=>c;
    }
}

concise_methods: {
    input: {
        x = {
            foo(a, b) {
                return x;
            }
        }
        y = {
            foo([{a}]) {
                return a;
            },
            bar(){}
        }
    }
    expect_exact: "x={foo(a,b){return x}};y={foo([{a}]){return a},bar(){}};"
}

concise_methods_and_mangle_props: {
    mangle_props = {
        regex: /_/
    };
    input: {
        function x() {
            obj = {
                _foo() { return 1; }
            }
        }
    }
    expect: {
        function x() {
            obj = {
                a() { return 1; }
            }
        }
    }
}

concise_methods_and_keyword_names: {
    input: {
        x = {
            catch() {},
            throw() {}
        }
    }
    expect: {
        x={catch(){},throw(){}};
    }
}

number_literals: {
    input: {
        0b1001;
        0B1001;
        0o11;
        0O11;
    }

    expect: {
        9;
        9;
        9;
        9;
    }
}

// Fabio: My patches accidentally caused a crash whenever
// there's an extraneous set of parens around an object.
regression_cannot_destructure: {
    input: {
        var x = ({ x : 3 });
        x(({ x: 3 }));
    }
    expect_exact: "var x={x:3};x({x:3});";
}

