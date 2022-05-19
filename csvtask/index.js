const axios = require('axios')
var querystring = require('querystring')

let accessToken =
  'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImtpZCI6ImpTMVhvMU9XRGpfNTJ2YndHTmd2UU8yVnpNYyJ9.eyJhdWQiOiJhMmVjY2RiZC1iMjA4LTRlNzctYTgyZi1kZGRkMTgxNDMwOWEiLCJpc3MiOiJodHRwczovL2xvZ2luLm1pY3Jvc29mdG9ubGluZS5jb20vY2U5ODYxMDEtMGM1Mi00NjkzLWEzODMtOTg2OWU0ZWFjNDhmL3YyLjAiLCJpYXQiOjE2NTIyNjgzNTMsIm5iZiI6MTY1MjI2ODM1MywiZXhwIjoxNjUyMjcyMjUzLCJhaW8iOiJFMlpnWU5oNFkrMkhwaW1sWnpKeW5salAzalJsQlFBPSIsImF6cCI6IjJmMDcxMDI1LWM4ZmUtNGVhZC04NjgxLWI4Mzg1Y2JjNmRjMyIsImF6cGFjciI6IjEiLCJvaWQiOiIzNThmMjFjYy04ZjVlLTQzOTAtYWQyMi1mNzU4YjVmYjkyYzMiLCJyaCI6IjAuQVJVQUFXR1l6bElNazBhamc1aHA1T3JFajczTjdLSUlzbmRPcUNfZDNSZ1VNSm9WQUFBLiIsInJvbGVzIjpbImFwcC5hY2Nlc3MiXSwic3ViIjoiMzU4ZjIxY2MtOGY1ZS00MzkwLWFkMjItZjc1OGI1ZmI5MmMzIiwidGlkIjoiY2U5ODYxMDEtMGM1Mi00NjkzLWEzODMtOTg2OWU0ZWFjNDhmIiwidXRpIjoia0tkS1NZNnhwa2ljRXhFMzBCczJBQSIsInZlciI6IjIuMCJ9.OVFPvxhvFwe84y7swpYgfzADVd3rQdPkudfIJM0j2kmXAn3k5Arz188Iolp_ipfxR70bXiyWEWmKHyy2RpcFQtgt1Eqy2NtNGJgurI3z1EUJmCqZtxxpkGYibOTuvnyF_VT29nUfFoicX61YH9ckHD-SfVTOJGqVQaJ_AjgvrUBUON-MNvJ4zvn1mm6gtATFvtiTr6gPxKFat9-TE2P_AnNa5gyLJAl-fcOoQHGz6OKcDSOAbqwxojTEvNp9LvHV8sykzlrAPMxRhWlXvgo-Dz_XBg_I9nHW65YDO_JNOXzqBZZrEfxarN9LRNrDzZ4IqMoluFA8eD4ZlvEfD2o2mw'

const manufacturer = 'Panasonic'
class CsvGenerate {
  static async start() {
    let isMoreData = true
    let productsDataArr = []
    let productsData = []
    let page = 1
    do {
      //productsData  [];
      try {
        productsData = await this.getData(accessToken, page)
        console.log(page)
      } catch (err) {
        // console.log('789')
        throw err
      }
      if (productsData) {
        productsDataArr.push(...productsData)
        page++
        if (productsData.length < 100) {
          isMoreData = false
        }
      }
    } while (isMoreData)

    const csvFormat = await this.convertToCSV(productsDataArr)
    // console.log(csvFormat)

    process.exit(0)
  }

  static async getData(accessToken, page) {
    try {
      const res = await axios.get(
        `https://api.scansource.com/scsc/product/v1/search`,
        {
          params: {
            customerNumber: 1000008718,
            manufacturer,
            page,
            pageSize: 100,
          },
          headers: {
            Authorization: `Bearer ${accessToken}`,
            ContentType: 'application/json',
            'Ocp-Apim-Subscription-Key': 'ebfde91d-da68-404a-9674-f8a4f480165a',
          },
        },
      )
      const data = res.data
      return data
    } catch (error) {
      if (
        error.response.data.statusCode === 401 &&
        error.response.data.message ===
          'Unauthorized! Access token is missing or invalid.'
      ) {
        // console.log('generateAccessToken')
        return this.generateAccessToken()
      } else {
        // console.log('456')
        throw error
      }
    }
  }

  static async generateAccessToken() {
    try {
      //   console.log('generateAccessToken222')
      const res = await axios.post(
        'https://login.microsoftonline.com/scansourceb2c.onmicrosoft.com/oauth2/v2.0/token',
        querystring.stringify({
          client_id: '2f071025-c8fe-4ead-8681-b8385cbc6dc3',
          client_secret: 'ntJ7Q~dZ3nG63Z28YcphAUw7SvaI_7bfj4ebR',
          scope:
            'https://scansourceb2c.onmicrosoft.com/a2eccdbd-b208-4e77-a82f-dddd1814309a/.default ',
          grant_type: 'client_credentials',
        }),
      )
      //   console.log(res.data)

      accessToken = res.data.access_token
      //   console.log('accesstoken3', accessToken)
    } catch (err) {
      throw err
      //   console.log(err.response.data)
      //   console.log('123')
      throw err
    }
  }

  //   static async convertToCSV(productsData) {
  //     try {
  //       if (productsData.length > 0) {
  //         console.log(productsData)
  //         const columNames = Object.keys(productsData[0]).map((item) => ({
  //           id: item,
  //           title: item,
  //         }))
  //         console.log(columNames)
  //         fs.mkdirSync('./productFiles')
  //         const path = `${__dirname}/productFiles/Scan-source-${manufacturer.toLowerCase()}.csv`
  //         const csvWriter = createCsvWriter({
  //           path,
  //           header: columNames,
  //         })
  //         await csvWriter.writeRecords(productsData)
  //         console.log('csv file created')
  //       }
  //     } catch (err) {
  //       console.log(err)
  //     }
  //   }

  static async convertToCSV(productsData) {
    try {
      const columNames = Object.keys(productsData[0]).map((item) => ({
        id: item,
        title: item,
      }))
      const path = `${__dirname}/productFiles/Scan-source-${manufacturer.toLowerCase()}.csv`
      const res = await creatingCsv(productsData, columNames, path)
      console.log(res)
    } catch {}
  }
}
CsvGenerate.start()
