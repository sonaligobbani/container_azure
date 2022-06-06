const { BlobServiceClient } = require("@azure/storage-blob");
const createContainerButton = document.getElementById("create-container-button");
const deleteContainerButton = document.getElementById("delete-container-button");
const selectButton = document.getElementById("select-button");
const fileInput = document.getElementById("file-input");
const listButton = document.getElementById("list-button");
const deleteButton = document.getElementById("delete-button");
const status = document.getElementById("status");
const fileList = document.getElementById("file-list");

const reportStatus = message => {
    status.innerHTML += `${message}<br/>`;
    status.scrollTop = status.scrollHeight;
}
/*
//child process
const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function test() {
  const { error,stdout, stderr } = await exec('?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-06-07T13:04:05Z&st=2022-06-06T05:04:05Z&spr=https&sig=PSdJ9Z4McpxJUI2aOct4bx5iSRRBAP%2Bv1bLB%2FYwKvAo%3D'});
  if (stderr) {
    return {"error": stderr};
  }
  return {"data": stdout};
};.....*/






// Update with Blob service SAS URL string
const blobSasUrl = "https://hanskywalker.blob.core.windows.net/?sv=2020-08-04&ss=bfqt&srt=sco&sp=rwdlacupitfx&se=2022-06-07T02:02:47Z&st=2022-06-05T18:02:47Z&spr=https&sig=%2Bm6cQY2oG1Sz1EU13hJTiygwx%2BJQfTo%2BNNV%2BuhEo1O8%3D";



// Create a new BlobServiceClient
const blobServiceClient = new BlobServiceClient(blobSasUrl);

// Create a unique name for the container by 
// appending the current time to the file name
const containerName = "container" + new Date().getTime();

// Get a container client from the BlobServiceClient
const containerClient = blobServiceClient.getContainerClient(containerName);

const createContainer = async () => {
    try {
      reportStatus(`Creating container "$data"...`);
      await containerClient.create();
      reportStatus(`Done.`);
    } catch (error) {
      reportStatus(error.message);
    }
  };

  const deleteContainer = async () => {
    try {
      reportStatus(`Deleting container "$data"...`);
      await containerClient.delete();
      reportStatus(`Done.`);
    } catch (error) {
      reportStatus(error.message);
    }
  };

createContainerButton.addEventListener("click", createContainer);
deleteContainerButton.addEventListener("click", deleteContainer);


//List blobs
const listFiles = async () => {
    fileList.size = 0;
    fileList.innerHTML = "";
    try {
        reportStatus("Retrieving file list...");
        let iter = containerClient.listBlobsFlat();
        let blobItem = await iter.next();
        while (!blobItem.done) {
            fileList.size += 1;
            fileList.innerHTML += `<option>${blobItem.value.name}</option>`;
            blobItem = await iter.next();
        }
        if (fileList.size > 0) {
            reportStatus("Done.");
        } else {
            reportStatus("The container does not contain any files.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

listButton.addEventListener("click", listFiles);

//Upload blobs to a container
const uploadFiles = async () => {
    try {
        reportStatus("Uploading files...");
        const promises = [];
        for (const file of fileInput.files) {
            const blockBlobClient = containerClient.getBlockBlobClient(file.name);
            promises.push(blockBlobClient.uploadBrowserData(file));
        }
        await Promise.all(promises);
        reportStatus("Done.");
        listFiles();
    }
    catch (error) {
            reportStatus(error.message);
    }
}

selectButton.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", uploadFiles);

//Delete blobs
const deleteFiles = async () => {
    try {
        if (fileList.selectedOptions.length > 0) {
            reportStatus("Deleting files...");
            for (const option of fileList.selectedOptions) {
                await containerClient.deleteBlob(option.text);
            }
            reportStatus("Done.");
            listFiles();
        } else {
            reportStatus("No files selected.");
        }
    } catch (error) {
        reportStatus(error.message);
    }
};

deleteButton.addEventListener("click", deleteFiles);