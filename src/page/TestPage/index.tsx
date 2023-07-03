import React from "react";
import { generateKey, symGenerateKey } from "../../utils/helpers";

const _symGenerateKey = async () => {
  const key = await symGenerateKey();
  console.log(key);
};

const _generateKey = async () => {
  const keyPair = await generateKey();
  console.log(keyPair);
};

const TestPage = () => {
  return (
    <div>
      <button onClick={_symGenerateKey}>generate symKey</button>
      <br />
      <button onClick={_generateKey}>generate asymKey</button>
    </div>
  );
};

export default TestPage;
