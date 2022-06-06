const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function test() {
  const { error,stdout, stderr } = await exec('New-AzStorageAccountSASToken -Context (Get-AzStorageAccount -ResourceGroupName "arm-vscode" -AccountName "abc78123").context -Service Blob,File,Table,Queue -ResourceType Service,Container,Object -Permission racwdlup',{'shell':'powershell.exe'});
  if (stderr) {
    return {"error": stderr};
  }
  return {"data": stdout};
};

test().then( x => {
    console.log(x)
}).catch(err=>{
  console.log(error)
})
