const fs = require('fs/promises')
const path = require('path')
const request = require('request')
const connection = require('./db/connection')
const fsc = require('fs')
const axios = require('axios')
const sourcePath = path.join(__dirname, '..', 'source folder')

class CopyingData {
  static async start(sourcePath, recurrsionCall) {
    const destinationPath = this.creatingDestinationPath(sourcePath)
    const files = await this.readingSourcePath(sourcePath)
    console.log('jummmmmmm', files)

    if (!fsc.existsSync(destinationPath)) {
      fsc.mkdirSync(destinationPath)
    }

    for (let file of files) {
      const pathOfFile = path.join(sourcePath, file)
      let destinationPath = path.join(sourcePath, file)
      destinationPath = this.creatingDestinationPath(destinationPath)

      const isDirectory = await this.isDir(pathOfFile)
      if (isDirectory) {
        try {
          await fs.mkdir(destinationPath, {
            recursive: true,
          })
          this.successful(file)
        } catch (e) {
          this.failed(file)
        }
      }

      const isImageFile = this.isImage(file)
      if (isImageFile) {
        const binaryOfImage = this.creatingBinaryData(pathOfFile)
        const compressedUrl = await this.compressingImage(binaryOfImage)
        const copyingImage = this.copyingImage(
          compressedUrl,
          destinationPath,
          file,
        )
        console.log('imageCopied', copyingImage)
      }

      const isTextFile = this.isText(file)
      if (isTextFile) {
        try {
          fs.copyFile(pathOfFile, destinationPath)
          this.successful(file)
        } catch (e) {
          console.log(e)
          this.failed(file)
        }
      }
    }

    for (let file of files) {
      const pathOfFile = path.join(sourcePath, file)
      const isDirectory = await this.isDir(pathOfFile)
      if (isDirectory) {
        try {
          await this.start(pathOfFile, 'recurrsionCall')
        } catch (e) {
          console.log(e)
        }
      }
    }
    if (!recurrsionCall) {
      process.exit(0)
    }
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
  static creatingBinaryData(pathOfFile) {
    let file = fsc.readFileSync(pathOfFile)
    return Buffer.from(file)
  }
  static async compressingImage(binaryOfImage) {
    try {
      const res = await axios({
        method: 'post',
        url: 'https://api.tinify.com/shrink',
        data: binaryOfImage,
        headers: {
          'Content-Type': 'application/json',
          Authorization:
            'Basic YXBpOlZ5Q3BuYk1nUTVURkRQcHZyVmxzUXZNTlE3RGYyY0NO',
          connection: 'keep-alive',
        },
      })
      let compressedUrl = res.data.output.url
      return compressedUrl
    } catch (e) {
      console.log('1,2,3')
    }
  }
  static copyingImage(url, destinationPath, file) {
    request(url).pipe(fsc.createWriteStream(destinationPath))
    return `copied ${file}`
  }
}

CopyingData.start(sourcePath)
