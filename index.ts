

const fs = require('fs')
const merge = require( 'easy-pdf-merge')



/**
 * Start with a file
 *   - Find all the children
 *   - create an array of all the files names
 *   - merge and output to the output folder
 *
 *   Loop through all elements
 *
 *    Find prefix
 *      if prefix exists, add the whole string to map array - sorted by the page number
 *
 *      <string, {
 *          prefix: string,
 *          // sorted by page number
 *          children: string[]
 *      }>
 *
 *      if doesnt exist, add to map
 *
 *
 */
async function combinePDFs() {

  const inputDir = './pdfs'
  const pdfDirArr: string[] = fs.readdirSync(inputDir);
  const pdfDirSet = new Set(pdfDirArr)
  const groupingMap = new Map<string, Map<number, string>>()

  // Group all files into their date prefixes.
  // This will result in prefixes grouped into a map of keys by array index
  pdfDirArr.forEach((fileName: string) => {
    const prefix = fileName.split('-')[0]
    const pageNumber = fileName.split('-')[1].split('.')[0];

    const existingPrefix = groupingMap.get(prefix)
    if (existingPrefix) {
      existingPrefix.set(parseInt(pageNumber), fileName)
    } else {
      const childMap = new Map<number, string>();
      childMap.set(parseInt(pageNumber), fileName)
      groupingMap.set(prefix, childMap)
    }
  })


  const prefixes = Array.from(groupingMap.keys())

  await Promise.all(prefixes.map(async (prefix: string) => {
    /*
      * 1. Get the map of children
      * 2. Maintain an array of files
      *   If parent - output pdf and reset the array
      *   If child, add to array
      * 3. Stop when there is no results
     */

    const children = groupingMap.get(prefix)
    const currentConcatArray: string[] = [];

    if (children) {
      const numberOfChildren = Array.from(children.keys()).length;
      for (let i = 1; i <= numberOfChildren; i++) {
        const child = children.get(i)
        if (child) {
          // Is Parent if the string ends in "-c.pdf"
          const isChild= child.endsWith('-c.pdf')
          if (isChild) {
            // add to array if child
            currentConcatArray.push(child)
          } else {
            if (currentConcatArray.length > 0) {
              // if new parent is found, output the current array to a pdf
              // and reset the array, and the push the parent
              if (currentConcatArray.length > 1) {
                const pdfsToMerge = [...currentConcatArray.map((fileName: string) => `${inputDir}/${fileName}`)]
                merge(pdfsToMerge, `./output_pdfs/${currentConcatArray[0]}`, function (err: Error) {
                  if (err) {
                    console.log(err)
                  }
                })
              } else {
                fs.copyFileSync(`${inputDir}/${currentConcatArray[0]}`, `./output_pdfs/${currentConcatArray[0]}`)
              }
            }

            currentConcatArray.length = 0;
            currentConcatArray.push(child)
          }
        }
      }
      // handle last parent here
      // Should refacrtor into a function
      if (currentConcatArray.length > 0) {
        // if new parent is found, output the current array to a pdf
        // and reset the array, and the push the parent
        if (currentConcatArray.length > 1) {
          const pdfsToMerge = [...currentConcatArray.map((fileName: string) => `${inputDir}/${fileName}`)]
          merge(pdfsToMerge, `./output_pdfs/${currentConcatArray[0]}`, function (err: Error) {
            if (err) {
              console.log(err)
            }
          })
        } else {
          fs.copyFileSync(`${inputDir}/${currentConcatArray[0]}`, `./output_pdfs/${currentConcatArray[0]}`)
        }
      }
    }

  }));
}

combinePDFs()

