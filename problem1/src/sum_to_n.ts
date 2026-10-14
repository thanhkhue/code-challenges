
// Sol 1: Iterative loop: 
// Time complexity: O(n), space complexity: O(1)
export function sum_to_n_1(n: number): number {
    if (n === 0) return 0;
    let sum = 0;
    if (n > 0) {
        for (let i = 1; i <= n; i++) {
            sum += i;
        }
    } else {
        for (let i = -1; i >= n; i--) {
            sum += i;
        }
    }
    return sum;
}

// Sol 2: Recursion
// Time complexity: O(n), space complexity: O(n) stack call
export function sum_to_n_2(n: number): number {
    if (n === 0) return 0;
    if (n > 0) {
        return n + sum_to_n_2(n - 1);
    }
    return n + sum_to_n_2(n + 1);
}

// Sol 3: Using math formula
// Time complexity: O(1), space complexity: O(1)
export function sum_to_n_3(n: number): number {
    if (n >= 0) {
        return (n * (n + 1)) / 2;
    }
    return -((n * (n - 1)) / 2);
}