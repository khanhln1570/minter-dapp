const fs = require("fs");
const fetch = require("node-fetch");
const basePath = process.cwd();

fs.writeFileSync(`${basePath}/build/json/_ipfsMetas.json`, "");
const writter = fs.createWriteStream(`${basePath}/build/json/_ipfsMetas.json`, {
  flags: "a",
});
writter.write("[");
const readDir = `${basePath}/build/json`;
let fileCount = fs.readdirSync(readDir).length - 2;

fs.readdirSync(readDir).forEach((file) => {
  if (file === "_metadata.json" || file === "_ipfsMetas.json") {
    return;
  }
  const jsonFile = fs.readFileSync(`${readDir}/${file}`);

  let url = "https://api.nftport.xyz/v0/metadata";

  let options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "*/*",
      Authorization: "79a048a6-9765-4474-859c-7c8ac1a01e53",
    },
    body: jsonFile,
  };

  fetch(url, options)
    .then((res) => res.json())
    .then((json) => {
      writter.write(JSON.stringify(json, null, 2));
      fileCount--;
      if (fileCount === 0) {
        writter.write("]");
        writter.end();
      } else {
        writter.write(",\n");
      }

      console.log(`${json.name} metadata uploaded & added to _ipfsMetas.json!`);
    })
    .catch((err) => console.error("error:" + err));
});

function fetchWithRetry(url, options) {
  return new Promise((resolve, reject) => {
    const fetch_retry = () => {
      options.headers.Authorization = AUTH;
      return fetch(url, options)
        .then((res) => res.json())
        .then((json) => {
          writter.write(JSON.stringify(json, null, 2));
          fileCount--;
          if (fileCount === 0) {
            writter.write("]");
            writter.end();
          } else {
            writter.write(",\n");
          }

          console.log(
            `${json.name} metadata uploaded & added to _ipfsMetas.json!`
          );
        })
        .catch((err) => {
          console.error("error:" + err);
          fetch_retry();
        });
    };
    return fetch_retry();
  });
}
