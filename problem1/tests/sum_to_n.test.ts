import { describe, it, expect } from "vitest";
import { sum_to_n_1, sum_to_n_2, sum_to_n_3 } from "../src/sum_to_n";

const cases: [number, number][] = [[0, 0], [1, 1], [5, 15], [100, 5050], [-3, -6]];

describe.each([
    ["loop", sum_to_n_1],
    ["recursion", sum_to_n_2],
    ["formula", sum_to_n_3],
])("%s", (_, fn) => {
    it.each(cases)("sum_to_n(%i) = %i", (n, expected) => expect(fn(n)).toBe(expected));
});