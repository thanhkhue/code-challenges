# Problem 1: Three ways to sum to n

## Task

Provide 3 unique implementations of the following function in TypeScript.

- Comment on the complexity or efficiency of each function.

**Input**: `n` - any integer

*Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

**Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.

## Getting started

**Prerequisites:** Node.js 18+ and npm.

```bash
cd problem1
npm install
```

| Command | What it does |
|---|---|
| `npm start` | Runs all 3 implementations on sample inputs (`0, 1, 5, 100, -3`) |
| `npm start -- <n>` | Runs all 3 implementations on a single input, e.g. `npm start -- 10` |
| `npm test` | Runs the test suite against all 3 implementations |

Example:

```
$ npm start -- 5
n = 5
A (loop):      15
B (recursion): 15
C (formula):   15
```

## Project structure

```
problem1/
├── src/
│   ├── sum_to_n.ts        # the 3 implementations
│   └── index.ts           
├── tests/
│   └── sum_to_n.test.ts   # test cases
├── package.json
└── tsconfig.json
```

## Implementations

| Implementation | Approach | Time | Space | 
|---|---|---|---|---|
| `sum_to_n_1` | Iterative loop | O(n) | O(1) |
| `sum_to_n_2` | Recursion | O(n) | O(n) call stack|
| `sum_to_n_3` | Gauss formula `n(n+1)/2` | O(1) | O(1) |



## Tests

The same test cases run against all 3 implementations.