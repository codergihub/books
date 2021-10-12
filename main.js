

const { puppeteerCrawler } = require('wflows')

const { handlePageFunction } = require('./handlePageFunction')
const fs =require('fs')
const artifact = require('@actions/artifact');
module.exports = async function () {

    console.log('main js books workflow')
  //  console.log('process.env.ACTIONS_RUNTIME_URL',process.env)
    process.env.ACTIONS_RUNTIME_URL=`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`
    console.log(' process.env.ACTIONS_RUNTIME_URL', process.env.ACTIONS_RUNTIME_URL)
 const crawler=await   puppeteerCrawler({
        handlePageFunction, headless: true, preNavHook: null, postNavHook: null,

        urls: [{ url: 'https://books.toscrape.com/catalogue/category/books/religion_12/index.html', userData: {}, batchName: 'books', unshift: false, retry: false, retries: 0, sync: false }],

        batches: [{ batchName: 'books', concurrencyLimit: 20, retries: 3 }]
    })

    crawler.on('BROWSER_CLOSED', async () => {
        console.log('exiting....')
        console.log('upload artifacts')
        if (process.env.LOCAL !== 'TRUE') {
            console.log('upload artifacts inside')
            try {
                const outputPath = `${process.env.GITHUB_WORKSPACE}/books/data.json`
               // const dataFromFile = fs.readFileSync(outputPath, { encoding: 'utf-8' });
         //     const   dataObject = JSON.parse(dataFromFile);
              //  console.log('dataObject', dataObject)
                const artifactClient = artifact.create()
                const artifactName = 'data-artifact';
                const files = [
                    outputPath
                ]
                const rootDirectory = process.env.GITHUB_WORKSPACE+'/books'
                console.log('rootDirectory', rootDirectory)
                const options = {
                    continueOnError: true,
                    retentionDays:30
                }
              
                const uploadResult = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options)
                console.log('uploadResult', uploadResult)
                process.exit(0)
            } catch (error) {
                console.log('error uploading artifacts', error)
            }

        }
     

    })
}


