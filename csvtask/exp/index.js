// const artistsByGenre = {
//   rock: {
//     jazz: ['taylor swift', 'ed sheeran'],
//     pop: {
//       name: {
//         hello: {
//           name: {
//             hello: ['sai', 'adele'],
//           },
//         },
//       },
//     },
//     pop: ['selena gomez', 'eminem'],
//     rap: ['drake', 'kanye west'],
//     alt: {
//       rock: ['taylor swift', 'ed sheeran'],
//       pop: ['selena gomez', 'eminem'],
//     },
//   },
//   pop: ['taylor swift', 'ed sheeran'],
//   rap: ['drake', 'eminem'],
// }

// const getArtistByGenre = (genre, arr = []) => {
//   Object.keys(genre).forEach((key) => {
//     if (Array.isArray(genre[key])) {
//       return genre[key].forEach((item) => {
//         arr.push(item)
//       })
//     }
//     arr = arr
//     return getArtistByGenre(genre[key], arr)
//   })
//   return arr
// }
// console.log(getArtistByGenre(artistsByGenre))

// const { Readable } = require('stream')
// const { createReadStream } = require('fs')
// const { promisify } = require('util')
// const { setTimeout } = require('timers/promises')
// const sleep = promisify(setTimeout)

// const arr = []
// for (let i = 0; i < 1025; i++) {
//   arr.push(i)
// }

// // const rs = new Readable({
// //   objectMode: true,
// //   read(n) {
// //     for (let i = 0; i < arr.length; i++) {
// //       this.push(arr[i])
// //     }
// //     this.push(null)
// //   },
// // })

// // rs.on('data', console.log)

// rsa = Readable.from(arr)
// rsa.on('data', console.log)

// function* fun() {
//   for (let i = 0; i < 15; i++) {
//     yield i
//   }
// }

// const rsad = Readable.from(fun())
// rsad.on('data', console.log)
// function* generator() {
//   for (let i = 0; i < 10; i++) {
//     yield i
//   }
// }
// // async function run() {
// //   const rs = Readable.from(generator())

// //   for await (let ls of rs) {
// //     await sleep(10000)
// //     await console.log(ls)
// //   }
// // }
// // run()

// async function run() {
//   const rs = Readable.from('./big.txt')
//   rs.setEncoding('')

//   for await (let ls of rs) {
//     await sleep(10000)
//     await console.log(ls)
//   }
// }
// run()

const fun = (a) => (b) => (c) => (d) => a + b + c + d
function fun(a) {
  return function (b) {
    return function (c) {
      a + b + c
    }
  }
}
// console.log(fun(10)(20)(30)(40))
