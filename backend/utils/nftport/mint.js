const fs = require("fs");
const fetch = require("node-fetch");
const basePath = process.cwd();

const ipfsMetas =  JSON.parse(fs.readFileSync(`${basePath}/build/json/_ipfsMetas.json`));


fs.writeFileSync(`${basePath}/build/minted.json`, "");
const writter = fs.createWriteStream(`${basePath}/build/minted.json`, {
  flags: "a",
});
writter.write("[");
let fileCount = ipfsMetas.length;

ipfsMetas.forEach((meta) => {

  let url = "https://api.nftport.xyz/v0/mints/customizable";

  const mintInfo = {
    chain: 'polygon',
    contract_address: "0x860227D45a834dD93D7f8eCF27f499Bc0693656D",
    metadata_uri: meta.metadata_uri,
    mint_to_address: "0x74eDc78cB564F6c9FDA6ffBAc82BcF93a928f4d1",
    // token_id: "DULOGO Token",

  }

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: "79a048a6-9765-4474-859c-7c8ac1a01e53",
    },
    body: JSON.stringify(mintInfo),
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      console.log(json)
      writter.write(JSON.stringify(json, null, 2));
      fileCount--;
      if (fileCount === 0) {
        writter.write("]");
        writter.end();
      } else {
        writter.write(",\n");
      }

      console.log(`Minted ${json.transaction_extarnal_url}`);
    })
    .catch((err) => console.error("error:" + err));
});
