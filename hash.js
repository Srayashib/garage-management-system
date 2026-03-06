import bcrypt from "bcrypt";

const password = "0000";

const hash = await bcrypt.hash(password, 10);
console.log(hash);

