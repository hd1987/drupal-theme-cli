const fs = require('fs-extra');

let files = [];
let number = 0;
let name = '';

/**
 * 
 * @param {*} dir path
 */
const readDirIter = (dir) => {
  number++;
  handleForeach(dir)
}

/**
 * Promise get result
 */
const getArray = async () => {
  return new Promise((resolve, reject) => {
    let timer1 = setInterval(() => {
      if( number == 0 ) {
        resolve(files)
        clearInterval(timer1)
      }
    }, 1)
  })
}

/**
 * 
 * @param {*} dir get folder path
 */
const handleReadDir = async (dir) => {
  return new Promise((resolve, reject) => {
    fs.readdir(`${dir}/`, (err, data) => {
      if(err) {
        console.log("Path error")
        console.error(err)
        return;
      }
      resolve(data)
    })
  })
}

/**
 * 
 * @param {} dir 
 * Distinguish between files and folders
 */
const handleForeach = async (dir) => {
  let data = await handleReadDir(dir);
  if( data.length == 0 ) {
    --number;
  }

  data.forEach((el, index, arr) => {
    const path = `${dir}/${el}`;
    fs.stat(path, (err, data) => {
      if( err ) {
        console.log("Path error")
        console.error(err)
        return;
      }

      if(data.isFile()) {
        replaceFileByName(dir, el);
        files.push(path);
      } else {
        readDirIter(path);
      }

      if( arr.length == index + 1 ) {
        --number
      }
        
    })
  })
}

/**
 * replace file by name
*/
const replaceFileByName = async (dir, el) => {
  const newEl = el.replace('projectName', `${name}`);
  const newPath = `${dir}/${newEl}`
  const oldPath = `${dir}/${el}`;
  await fs.rename(oldPath, newPath);

  fs.readFile(newPath, (err, data) => {
    if (err) return;

    let str = data.toString();
    str = str.replace(/projectName/g, `${name}`);

    fs.writeFile(newPath, str, (err) => {
      if (err) return;
    })
  });
}

/**
 * 
 * @param {*} dir entrance
 */
const action = async (dir, setName) => {
  name = setName;
  readDirIter(dir)
  let obj = await getArray();
  return obj;
}

exports.action = action;
