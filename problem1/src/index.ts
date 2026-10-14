import { sum_to_n_1, sum_to_n_2, sum_to_n_3 } from "./sum_to_n";

// Usage:
//   npm start          → runs the sample inputs below
//   npm start -- 10    → runs a single input
const arg = process.argv[2];
const inputs: number[] = arg !== undefined ? [Number(arg)] : [0, 1, 5, 100, -3];

for (const n of inputs) {
    if (!Number.isInteger(n)) {
        console.error(`Invalid input "${arg}": n must be an integer`);
        process.exit(1);
    }

    console.log(`n = ${n}`);
    console.log(`  A (loop):   ${sum_to_n_1(n)}`);
    console.log(`  B (recursion): ${sum_to_n_2(n)}`);
    console.log(`  C (formula): ${sum_to_n_3(n)}`);
}