import { describe,it } from "node:test";
import assert from "node:assert";
import { deepMerge } from "./deepMergeObject.js";



describe('deepMerge test-suite', () => {
    it('should merge simple object', () => {
        const obj1 = {
            a: 1,
            b: 2,
            c: {
                d: 3,
                e: 4
            }
        };
        const obj2 = {
            a:3,
            d:['hello'],
            "null":null
        };

        const result = { a: 3, b: 2, c: { d: 3, e: 4 }, d: [ 'hello' ],"null":null };
           

        assert.deepStrictEqual(deepMerge(obj1,obj2),result);
    });

    it('should merge nested obj', () => {
            const obj1  = {
                a:{
                    a:{
                        a:["a"]
                    }
                },
                b:[{
                    a:"b"
                }],
                d:{
                    a:{
                        b:"hello"
                    }
                }
            };
        const obj2 = {
            c:{
                a:{
                    b:{
                        d:{
                            hello:"world"
                        }
                    }
                }
            },
            d:[{
                b:[{c:"d"}]
            }]
        };
        const result = {
            a:{
                a:{
                    a:["a"]
                }
            },
            b:[{
                a:"b"
            }],
            c:{
                a:{
                    b:{
                        d:{
                            hello:"world"
                        }
                    }
                }
            },
            d:[{
                b:[{c:"d"}]
            }]
        }
        assert.deepStrictEqual(deepMerge(obj1,obj2),result);
    });
    it('should not merge with array', () => {
        const a = [
            {
                b:["c"]
            },
           "hello"
        ];

        const b = {
            prop:{
                d:["d"]
            }
        };
        assert.deepStrictEqual(deepMerge(a,b),{ prop: { d: ["d"] } });
    });

    it('should not merge with map', () => {
        const a = (new Map()).set("a","b");
        const b = {
            prop:{
                d:["d"]
            }
        };
        assert.deepStrictEqual(deepMerge(a,b),{ prop: { d: ["d"] } });
    });

    it('should be performant with big object', () => {
        const target = {
            user: {
              id: 1,
              name: "Alice",
              preferences: {
                theme: "dark",
                notifications: {
                  email: true,
                  sms: false,
                },
              },
              friends: [
                { id: 2, name: "Bob" },
                { id: 3, name: "Charlie" },
              ],
            },
            settings: {
              version: "1.0",
              active: true,
            },
            data: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: `value_${i}` })),
            other:[
                {
                    a:[
                        {
                            b:[
                                {
                                    c:{
                                        d:[
                                            {
                                                id:5
                                            }
                                        ]
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
          };
          
          const source = {
            user: {
              name: "Alice B.",
              preferences: {
                theme: "light",
                notifications: {
                  push: true,
                },
              },
              friends: [
                { id: 3, name: "Charlie Updated" },
                { id: 4, name: "Diana" },
              ],
            },
            settings: {
              debugMode: true,
            },
            stats: {
              usage: {
                daily: 500,
                monthly: 15000,
              },
            },
            data: Array.from({ length: 10000 }, (_, i) => ({ id: i, value: `newValue_${i}` })),
          };
          const startTime = performance.now();
           const merged = deepMerge(target, source);
          const endTime = performance.now();
          const elapsed = endTime - startTime;
          console.log(elapsed);
        assert.equal( elapsed< 10,true);
        assert.deepStrictEqual(merged.other,target.other);        
    });
});
