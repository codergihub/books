

const { puppeteerCrawler } = require('wflows')

const { handlePageFunction } = require('./handlePageFunction')
const os = require('os');


    console.log('main js books workflow')

    // process.env.ACTIONS_RUNTIME_URL=`${process.env.GITHUB_SERVER_URL}/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`

    const crawler = await puppeteerCrawler({
        handlePageFunction, headless: true, preNavHook: null, postNavHook: null,

        urls: [{ url: 'https://books.toscrape.com/catalogue/category/books/religion_12/index.html', userData: {}, batchName: 'books', unshift: false, retry: false, retries: 0, sync: false }],

        batches: [{ batchName: 'books', concurrencyLimit: 20, retries: 3 }]
    })

    crawler.on('BROWSER_CLOSED', async () => {
        console.log('exiting....')
        console.log('upload artifacts')
        console.log('hostname', os.hostname())
        console.log('os.networkInterfaces()',os.networkInterfaces())

    })



