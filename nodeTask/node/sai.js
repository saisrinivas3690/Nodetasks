const fs = require('fs/promises')
const path = require('path')
const request = require('request')
const connection = require('./db/connection')
const fsc = require('fs')
// const compress_images = require('compress-images')
const sourcePath = path.join(__dirname, '..', 'source folder')
const axios = require('axios')
const { promise } = require('./db/connection')
let imageProm = []
let sourceArrLength
let count = 0

class CopyingData {
  static async start(sourcePath) {
    const destinationPath = this.creatingDestinationPath(sourcePath)
    const files = await this.readingSourcePath(sourcePath)
    sourceArrLength = sourceArrLength + files.length
    const staticFilesArrOfSourceFolder = await this.intial()

    if (!fsc.existsSync(destinationPath)) {
      fsc.mkdirSync(destinationPath)
    }

    for (let file of files) {
      const pathOfFile = path.join(sourcePath, file)
      let destinationPath = path.join(sourcePath, file)
      destinationPath = this.creatingDestinationPath(destinationPath)
      console.log(file)
      const isDirectory = await this.isDir(pathOfFile)
      if (isDirectory) {
        try {
          await fs.mkdir(destinationPath, {
            recursive: true,
          })
          this.successful(file)
          const dirArr = await fs.readdir(pathOfFile)
          if (dirArr.length) {
            this.start(pathOfFile)
          }
        } catch (e) {
          this.failed(file)
        }
      }

      const isTextFile = this.isText(file)
      if (isTextFile) {
        // let prom
        // try {
        //   prom = fs.copyFile(pathOfFile, destinationPath)
        //   this.successful(file)
        // } catch (e) {
        //   console.log(e)
        //   this.failed(file)
        // }
        // const prom = fs.copyFile(pathOfFile, destinationPath).then()
        // promArr.push(prom)
        fsc.copyFileSync(pathOfFile, destinationPath)
      }
      //   console.log(file)
      const isImageFile = this.isImage(file)
      if (isImageFile) {
        const prom = await this.compressingImage(
          file,
          pathOfFile,
          destinationPath,
        )
        imageProm.push(prom)
        if (
          file ===
          staticFilesArrOfSourceFolder[staticFilesArrOfSourceFolder.length - 1]
        ) {
          console.log('done')
          Promise.all(imageProm)
            .then((res) => {
              console.log('lengthhhhh', res.length)
              res.forEach((element) => {
                console.log(element.data.output.url)
              })
            })
            .catch((err) => console.log('123'))
        }
      }
    }
    console.log(count)
    process.exit(0)
  }

  static async intial() {
    return await fs.readdir(sourcePath)
  }
  static async readingSourcePath(sourcePath) {
    const files = await fs.readdir(sourcePath)
    return files
  }
  static creatingDestinationPath(destinationPath) {
    destinationPath = destinationPath.split('/')
    const indexOfFile = destinationPath.indexOf('source folder')
    destinationPath[indexOfFile] = 'destination folder'
    return destinationPath.join('/')
  }
  static async isDir(path) {
    try {
      let stat = await fs.lstat(path)
      return stat.isDirectory()
    } catch (e) {
      // lstatSync throws an error if path doesn't exist
      return false
    }
  }
  static isImage(file) {
    return (
      file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg')
    )
  }
  static isText(file) {
    return file.endsWith('.txt')
  }
  static successful(file) {
    connection.query(
      `INSERT INTO Data (file_name,is_error) VALUES ('${file}',false)`,
    )
  }
  static failed(file) {
    connection.query(
      `INSERT INTO Data (file_name,is_error) VALUES ('${file}',true)`,
    )
  }
  static async compressingImage(file, pathOfFile, destinationPath) {
    file = fsc.readFileSync(pathOfFile)
    let blob = Buffer.from(file)
    // let url
    // console.log(blob)

    // let compressedImageUrl
    // try {
    //    res = await axios({
    //     method: 'post',
    //     url: 'https://api.tinify.com/shrink',
    //     data: blob,
    //     headers: {
    //       'Content-Type': 'application/json',
    //       Authorization:
    //         'Basic YXBpOlZ5Q3BuYk1nUTVURkRQcHZyVmxzUXZNTlE3RGYyY0NO',
    //       Connection: 'keep-alive',
    //     },
    //   })
    //   compressedImageUrl = res.data.output.url
    // } catch (e) {
    //   console.log('123')
    //   // throw e.message
    // }

    // console.log(compressedImageUrl)

    // await fs.copyFile(image, destinationPath)

    const img = axios({
      method: 'post',
      url: 'https://api.tinify.com/shrink',
      data: blob,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Basic YXBpOlZ5Q3BuYk1nUTVURkRQcHZyVmxzUXZNTlE3RGYyY0NO',
        connection: 'keep-alive',
      },
    })
    return img
  }
}
CopyingData.start(sourcePath)

// const log = require('why-is-node-running')

// Cleanest way of saving image locally using request:

// let tinify = require('tinify')
// let API_KEY = [
//   'L24NxWlWXCBXTZzGGBg60FPh0ZPjmT7q',
//   'ZqTnNLsYQCB1zbW9blQgJwqrkySlQxVY',
//   'bLpgfrCqG4R1g0w5nKbRG5Nw4C4VFrSx',
// ]

// let count = 0

// async function isDir(path) {
//   try {
//     let stat = await fs.lstat(path)
//     return stat.isDirectory()
//   } catch (e) {
//     // lstatSync throws an error if path doesn't exist
//     return false
//   }
// }
// function isImage(file) {
//   return file.endsWith('.jpg')
// }
// function isText(file) {
//   return file.endsWith('.txt')
// }

// function compressingImage(file, pathOfFile, destinationPath) {
//   compress_images(
//     pathOfFile,
//     destinationPath,
//     { compress_force: false, statistic: true, autoupdate: true },
//     false,
//     { jpg: { engine: 'mozjpeg', command: ['-quality', '60'] } },
//     { png: { engine: 'pngquant', command: ['--quality=20-50', '-o'] } },
//     { svg: { engine: 'svgo', command: '--multipass' } },
//     {
//       gif: {
//         engine: 'gifsicle',
//         command: ['--colors', '64', '--use-col=web'],
//       },
//     },
//     function (err, completed) {
//       if (completed === true) {
//         successful(file)
//       }
//       if (err) {
//         console.log(err)
//         failed(file)
//       }
//     },
//   )
// }
// function compress_images(file, pathOfFile, destinationPath) {
//   let API_KEY = [
//     'L24NxWlWXCBXTZzGGBg60FPh0ZPjmT7q',
//     'ZqTnNLsYQCB1zbW9blQgJwqrkySlQxVY',
//     'bLpgfrCqG4R1g0w5nKbRG5Nw4C4VFrSx',
//   ]

//   const files = fsc.readFileSync(pathOfFile)
//   console.log(files)
//   const bufferData = Buffer.from(files)
//   console.log(bufferData)

//   axios
//     .post('http://api.tinify.com', {
//       Authorization: `Basic ${API_KEY[0]}`,
//       'data-binary': bufferData,
//     })
//     .then((response) => {
//       console.log('hello')
//     })
//     .catch((e) => console.log(e))

//   axios({
//     method: 'post',
//     url: 'api.tinify.com',
//     data: files,
//     headers: {
//       'Content-Type': 'multipart/form-data',
//       Authorization: `Basic ${API_KEY[0]}`,
//     },
//   })
//     .then(function (response) {
//       //handle success
//       console.log(response)
//     })
//     .catch(function (response) {
//       //handle error
//       console.log(response)
//     })
// }

// const loopFiles = async (sourcePath) => {
//   try {
//     const files = await fs.readdir(sourcePath)

//     function destinationPathCreator(destinationPath) {
//       destinationPath = destinationPath.split('/')
//       const indexOfFile = destinationPath.indexOf('source folder')
//       destinationPath[indexOfFile] = 'destination folder'
//       return destinationPath.join('/')
//     }

//     for (const file of files) {
//       const pathOfFile = path.join(sourcePath, file)
//       let destinationPath = path.join(sourcePath, file)
//       destinationPath = destinationPathCreator(destinationPath)

//       const isDirectory = await isDir(pathOfFile)
//       if (isDirectory) {
//         try {
//           await fs.mkdir(destinationPath, {
//             recursive: true,
//           })
//           successful(file)
//         } catch (e) {
//           failed(file)
//         }
//       }
//     }

//     for (const file of files) {
//       const pathOfFile = path.join(sourcePath, file)
//       let destinationPath = path.join(sourcePath, file)
//       destinationPath = destinationPathCreator(destinationPath)

//       const isImageFile = isImage(file)
//       if (isImageFile) {
//         // count++
//         // console.log(count)
//         // if (count % 30 <= 10) tinify.key = API_KEY[0]
//         // if (count % 30 > 10 && count % 30 <= 20) tinify.key = API_KEY[1]
//         // if (count % 30 > 20 && count % 30 <= 29) tinify.key = API_KEY[2]

//         // const source = tinify.fromFile(pathOfFile)
//         // source.toFile(destinationPath)
//         // successful(file)
//         compress_images(file, pathOfFile, destinationPath)
//         // compressingImage(file, pathOfFile, destinationPath)
//       }

//       const isTextFile = isText(file)
//       if (isTextFile) {
//         try {
//           await fs.copyFile(pathOfFile, destinationPath)
//           successful(file)
//         } catch (e) {
//           console.log(e)
//           failed(file)
//         }
//       }

//       const isDirectory = await isDir(pathOfFile)
//       if (isDirectory) {
//         const dirArr = await fs.readdir(pathOfFile)
//         // console.log(dirArr)
//         if (dirArr.length) {
//           loopFiles(pathOfFile)
//         }
//       }
//     }
//   } catch (error) {
//     console.log(error)
//   }
// }

// loopFiles(sourcePath)

// connection.connect(function (err) {
//   if (err) {
//     console.error('error connecting: ' + err.stack)
//     return
//   }

//   app.listen(5000, () => {
//     console.log('server is running on port 5000')
//   })
//   console.log('connected as id ' + connection.threadId)
// })
