# useSplitter

A custom hook to manage string splitting and joining using a delimiter.

## Usage

```typescript
import useSplitter from "@rtpackx/core";

const toNumber = (value: string) => parseInt(value, 10);
const { splice, split, take } = useSplitter();

const joinedString = splice("apple", "banana");
console.log(joinedString); // Output: "apple:banana"

// Example of using split
const str = "1:2";
const splitResult = split<number>(str, toNumber);
console.log(splitResult); // Output: [1, 2]

// Example of using take
const firstElement = take("orange:grape");
console.log(firstElement); // Output: "orange"
```
