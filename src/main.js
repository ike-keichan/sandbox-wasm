import { createAdd } from './add/index.js';
import { createHello } from './hello/index.js';

// 機能を足したら、ここで呼び出す。
const { helloWorld } = await createHello((text) => console.log(text));
const { add } = await createAdd();

helloWorld();
console.log(`3 + 4 = ${add(3, 4)}`);
