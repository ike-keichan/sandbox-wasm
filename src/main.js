import { createHello } from './hello/index.js';

// 機能を足したら、ここで呼び出す。
const { helloWorld } = await createHello((text) => console.log(text));

helloWorld();
