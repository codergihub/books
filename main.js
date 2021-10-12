

const { puppeteerCrawler } = require('wflows')

const { handlePageFunction } = require('./handlePageFunction')


module.exports = function () {

    console.log('main js books workflow')
    process.on('exit', async () => {

        console.log('upload artifacts')
        if (process.env.LOCAL !== 'TRUE') {
            console.log('upload artifacts inside')
            try {
                const outputPath = `${process.cwd()}/data.json`
                console.log('outputPath', outputPath)
                const artifactClient = artifact.create()
                const artifactName = 'data-artifact';
                const files = [
                    outputPath
                ]
                const rootDirectory = process.cwd()
                console.log('rootDirectory', rootDirectory)
                const options = {
                    continueOnError: false
                }

                const uploadResult = await artifactClient.uploadArtifact(artifactName, files, rootDirectory, options)
                console.log('uploadResult', uploadResult)
            } catch (error) {
                console.log('error uploading artifacts', error)
            }

        }
    })
    puppeteerCrawler({
        handlePageFunction, headless: true, preNavHook: null, postNavHook: null,

        urls: [{ url: 'https://books.toscrape.com/catalogue/category/books/religion_12/index.html', userData: {}, batchName: 'books', unshift: false, retry: false, retries: 0, sync: false }],

        batches: [{ batchName: 'books', concurrencyLimit: 20, retries: 3 }]
    })
}


