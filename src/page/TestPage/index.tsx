import React from "react";
import {
  generateKey,
  getOrCreateUserTempKey,
  symGenerateKey,
} from "../../utils/helpers";

const _symGenerateKey = async () => {
  const key = await symGenerateKey();
  console.log(key);
};

const _generateKey = async () => {
  const keyPair = await generateKey();
  console.log(keyPair);
};

const _getOrCreateUserTempKey = async () => {
  const key = await getOrCreateUserTempKey(
    "5HWUV4XjVRpBkJY3Sbo5LDneSHRmxYgQaz9oBzvP351qwKCt"
  );
  console.log(key);
};

const TestPage = () => {
  return (
    <div>
      <button onClick={_symGenerateKey}>generate symKey</button>
      <br />
      <button onClick={_generateKey}>generate asymKey</button>
      <br />
      <button onClick={_getOrCreateUserTempKey}>getOrCreateUserTempKey</button>
    </div>
  );
};

export default TestPage;
