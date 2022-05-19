const createCsvWriter = require('csv-writer').createObjectCsvWriter;

async function creatingCsv(productsData, columNames, destinationPath) {
  try {
    if (productsData.length > 0) {
      //   console.log(productsData)
      //   const columNames = Object.keys(productsData[0]).map((item) => ({
      //     id: item,
      //     title: item,
      //   }))
      //   console.log(columNames)
      //   fs.mkdirSync('./productFiles')
      //   const path = `${__dirname}/productFiles/Scan-source-${manufacturer.toLowerCase()}.csv`
      const csvWriter = createCsvWriter({
        path: destinationPath,
        header: columNames,
      })
      await csvWriter.writeRecords(productsData)
      return 'csv file created'
    }
  } catch (err) {
    console.log(err)
  }
}

module.exports = { creatingCsv }
