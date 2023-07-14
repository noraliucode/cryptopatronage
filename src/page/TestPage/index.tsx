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
import {
  getBase64edAsymKeys,
  getCreatorsContentLinks,
  getImportedAsymKeys,
  updateCreatorKeyValue,
} from "../../utils/main";

const creator = "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr";

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
    // "5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"
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

  // 0. serialize / deserialize keyPair
  console.log("0. serialize / deserialize keyPair");
  const { base64edAsymPubKey, base64edAsymPrivateKey } =
    await getBase64edAsymKeys(keyPair);
  console.log("base64edAsymPubKey: ", base64edAsymPubKey);
  console.log("base64edAsymPrivateKey: ", base64edAsymPrivateKey);
  console.log("==================================================");
  const { importedAsymPubKey, importedAsymPrivateKey } =
    await getImportedAsymKeys(base64edAsymPubKey, base64edAsymPrivateKey);

  const pubKey = importedAsymPubKey;
  const privKey = importedAsymPrivateKey as any;

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
  const encryptedSymKey = await encrypt(symKeyString, pubKey);
  console.log("encryptedSymKey: ", encryptedSymKey); // ArrayBuffer(256)
  //buffer ToBase64 ->
  const encryptedSymKeyBase64 = arrayBufferToBase64(encryptedSymKey);
  console.log("encryptedSymKeyBase64: ", encryptedSymKeyBase64);

  console.log("==================================================");

  //base64 to buffer ->
  const encryptedSymKeyBuffer = base64ToArrayBuffer(encryptedSymKeyBase64);
  console.log("encryptedSymKeyBuffer: ", encryptedSymKeyBuffer);
  //decrypt
  const decryptedSymKey = await decrypt(encryptedSymKeyBuffer, privKey);
  console.log("decryptedSymKey: ", decryptedSymKey);
  //import key ->
  const importedSymKey = await importKey(decryptedSymKey as any, true);
  console.log("importedSymKey: ", importedSymKey);

  // 2. encrypt / decrypt content with symKey
  console.log("2. encrypt / decrypt content with symKey");
  //encrypt ->
  const { encryptedContent, iv } = await symEncrypt(message, importedSymKey);
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
    importedSymKey,
    iv
  );
  console.log("decryptedContent: ", decryptedContent);
};

const _getCreatorsContentLinks = async () => {
  const contentLinks = await getCreatorsContentLinks(
    // "5HWUV4XjVRpBkJY3Sbo5LDneSHRmxYgQaz9oBzvP351qwKCt"
    ["5FWRBKS8qncTegjmBnVrEnQYVR2Py6FtZCtQFiKBuewDkhpr"],
    "5HWUV4XjVRpBkJY3Sbo5LDneSHRmxYgQaz9oBzvP351qwKCt"
  );
  console.log(contentLinks);
};

export const testSymKeyEncryption = async () => {
  console.log("=====================test2 start=============================");

  const symKey = await symGenerateKey();
  // console.log("symKey: ", symKey);

  const message = "link";
  console.log("message: ", message);

  const symKeyString = await exportKey(symKey);
  console.log("symKeyString: ", symKeyString);
  await localStorage.setItem("symKeyString", symKeyString);

  const keyPair = await generateKey();
  const { base64edAsymPubKey, base64edAsymPrivateKey } =
    await getBase64edAsymKeys(keyPair);
  // console.log("base64edAsymPubKey: ", base64edAsymPubKey);
  // console.log("base64edAsymPrivateKey: ", base64edAsymPrivateKey);

  const encryptedSymKey = await encrypt(symKeyString, keyPair.publicKey);
  // console.log("encryptedSymKey: ", encryptedSymKey);

  const decryptedSymKey = await decrypt(encryptedSymKey, keyPair.privateKey);
  // console.log("decryptedSymKey: ", decryptedSymKey);

  const importedSymKey = await importKey(decryptedSymKey as any, true);
  // console.log("importedSymKey: ", importedSymKey);

  //encrypt ->
  const { iv, encryptedContent } = await symEncrypt(message, importedSymKey);
  // console.log("encryptedContent: ", encryptedContent);
  //ToBase64 ->
  const encryptedContentBase64 = arrayBufferToBase64(encryptedContent);
  console.log("encryptedContentBase64: ", encryptedContentBase64);
  const ivBase64 = arrayBufferToBase64(iv);
  await localStorage.setItem("encryptedContentBase64", encryptedContentBase64);
  await localStorage.setItem("ivBase64", ivBase64);
  //to buffer ->
  const encryptedContentBuffer = base64ToArrayBuffer(encryptedContentBase64);
  // console.log("encryptedContentBuffer: ", encryptedContentBuffer);

  const _decrypted = await symDecrypt(
    encryptedContentBuffer,
    importedSymKey,
    iv
  );
  console.log("_decrypted: ", _decrypted);
  console.log("=====================test2 end=============================");
};

const testSymKeyDecryption = async () => {
  console.log("=====================test3 start=============================");
  const _ivBase64 = (await localStorage.getItem("ivBase64")) as any;

  const _encryptedContentBase64 = (await localStorage.getItem(
    "encryptedContentBase64"
  )) as any;

  console.log("encryptedContentBase64", _encryptedContentBase64);

  const decryptedSymKey = await localStorage.getItem("symKeyString");

  console.log("decryptedSymKey", decryptedSymKey);

  const _importedSymKey = await importKey(decryptedSymKey as any, true);

  const encryptedContentBuffer = base64ToArrayBuffer(_encryptedContentBase64);
  const ivBuffer = base64ToArrayBuffer(_ivBase64) as any;

  const _decrypted = await symDecrypt(
    encryptedContentBuffer,
    _importedSymKey,
    ivBuffer
  );
  console.log("_decrypted: ", _decrypted);
  console.log("=====================test3 end=============================");
};

const updateContentLinksDB = async () => {
  await updateCreatorKeyValue(creator, [], "links", true);
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
      <br />
      <button onClick={_getCreatorsContentLinks}>
        getCreatorsContentLinks
      </button>
      <br />
      <button onClick={testSymKeyEncryption}>testSymKeyEncryption</button>
      <br />
      <button onClick={testSymKeyDecryption}>testSymKeyDecryption</button>
      <br />
      <button onClick={updateContentLinksDB}>updateContentLinksDB</button>
    </div>
  );
};

export default TestPage;
