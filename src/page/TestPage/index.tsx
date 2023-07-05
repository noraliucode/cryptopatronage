import React from "react";
import {
  arrayBufferToBase64,
  base64ToArrayBuffer,
  decrypt,
  encrypt,
  exportKey,
  generateKey,
  getOrCreateUserTempKey,
  importKey,
  symDecrypt,
  symEncrypt,
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
    // "5HWUV4XjVRpBkJY3Sbo5LDneSHRmxYgQaz9oBzvP351qwKCt"
    "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"
  );
  console.log(key);
};

// encrypt -> export key -> ToBase64 -> to buffer -> import key -> decrypt
const encryptionDecryptionFlow = async () => {
  // const key = await getOrCreateUserTempKey(
  //   // "5HWUV4XjVRpBkJY3Sbo5LDneSHRmxYgQaz9oBzvP351qwKCt"
  //   "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"
  // );
  // console.log(key);
  const keyPair = await generateKey();

  // 1. asym encrypt / decrypt symKey with uer asymetric temp pubKey / privKey
  console.log(
    "1. encrypt / decrypt symKey with uer asymetric temp pubKey / privKey"
  );
  //generate symKey ->
  const symKey = await symGenerateKey();
  console.log("symKey: ", symKey);

  const message =
    "https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto";

  //export key ->
  const symKeyString = await exportKey(symKey);
  console.log("symKeyString: ", symKeyString);
  //encrypt ->
  const encryptedSymKey = await encrypt(symKeyString, keyPair.publicKey);
  console.log("encryptedSymKey: ", encryptedSymKey); // ArrayBuffer(256)
  //buffer ToBase64 ->
  const encryptedSymKeyBase64 = arrayBufferToBase64(encryptedSymKey);
  console.log("encryptedSymKeyBase64: ", encryptedSymKeyBase64);

  console.log("==================================================");

  //base64 to buffer ->
  const encryptedSymKeyBuffer = base64ToArrayBuffer(encryptedSymKeyBase64);
  console.log("encryptedSymKeyBuffer: ", encryptedSymKeyBuffer);
  //decrypt
  const decryptedSymKey = await decrypt(
    encryptedSymKeyBuffer,
    keyPair.privateKey
  );
  console.log("decryptedSymKey: ", decryptedSymKey);
  //import key ->
  const importedSymKey = await importKey(decryptedSymKey, true);
  console.log("importedSymKey: ", importedSymKey);

  // 2. encrypt / decrypt content with symKey
  console.log("2. encrypt / decrypt content with symKey");
  //encrypt ->
  const encryptedContent = await symEncrypt(message, importedSymKey);
  console.log("encryptedContent: ", encryptedContent);
  //ToBase64 ->
  const encryptedContentBase64 = arrayBufferToBase64(encryptedContent);
  console.log("encryptedContentBase64: ", encryptedContentBase64);
  //to buffer ->
  const encryptedContentBuffer = base64ToArrayBuffer(encryptedContentBase64);
  console.log("encryptedContentBuffer: ", encryptedContentBuffer);
  //decrypt
  const decryptedContent = await symDecrypt(
    encryptedContentBuffer,
    importedSymKey
  );
  console.log("decryptedContent: ", decryptedContent);
};

const TestPage = () => {
  return (
    <div>
      <button onClick={_symGenerateKey}>generate symKey</button>
      <br />
      <button onClick={_generateKey}>generate asymKey</button>
      <br />
      <button onClick={_getOrCreateUserTempKey}>getOrCreateUserTempKey</button>
      <br />
      <button onClick={encryptionDecryptionFlow}>
        encryptionDecryptionFlow
      </button>
    </div>
  );
};

export default TestPage;
