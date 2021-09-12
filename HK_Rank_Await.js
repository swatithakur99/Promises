  
'use strict';
const loginLink = "https://www.hackerrank.com/auth/login";
const emailpassObj = require("../secrets");
const puppeteer = require("puppeteer")
const { answers } = require("./tempCodeFile.js");
let browserStartPromise = puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ["--start-maximized", "--disable-notifications"]
});
let page, browser;
(async function fn() {
    try {
        let browserObj = await browserStartPromise;
        console.log("Browser opened");
        browser = browserObj
        // new tab 
       let newTab = await browserObj.newPage();
         page = newTab;
       await newTab.goto(loginLink);
        await page.type("input[id='input-1']", emailpassObj.email, { delay: 50 });
        await page.type("input[type='password']", emailpassObj.password, { delay: 50 });
        await page.click('button[data-analytics="LoginPassword"]', { delay: 100 });
        await waitAndClick("a[data-analytics='SelectTopic']", page);
        await waitAndClick("input[value='warmup']", page);
        await page.waitFor(3000);
        let questionsArr = await page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled"
            , { delay: 100 });
        
            await questionSolver(page, questionsArr[0], answers[0]);
        
    } catch (err) {
        console.log(err);
    }

})()

function waitAndClick(selector, cPage) {
    return new Promise(function (resolve, reject) {
        let waitForModalPromise = cPage.waitForSelector(selector, { visible: true });
        waitForModalPromise
            .then(function () {
                let clickModal =
                    cPage.click(selector, { delay: 100 });
                return clickModal;
            }).then(function () {
                resolve();
            }).catch(function (err) {
                reject(err)
            })
    }
    )
}

function questionSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let qWillBeCLickedPromise = question.click();
        qWillBeCLickedPromise
            //click -> code type -> ctrl A+ ctrl x -> click on editor -> ctrl A+ctrl v -> reached to editor
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            // click
            .then(function () {
                return waitAndClick(".checkbox-input", page);
            }).then(function () {
                return page.waitForSelector("textarea.custominput", { visible: true });
            })
            .then(function () {
                return page.type("textarea.custominput", answer, { delay: 10 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                return page.keyboard.press("X", { delay: 100 });
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            })
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndClick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            .then(function () {
                let ctrlIsPressedP = page.keyboard.down("Control");
                return ctrlIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("A", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let AIsPressedP = page.keyboard.press("V", { delay: 100 });
                return AIsPressedP;
            }).then(function () {
                let ctrlIsPressedP = page.keyboard.up("Control");
                return ctrlIsPressedP;
            }).then(function () {
                return page.click(".hr-monaco__run-code", { delay: 50 });
            })
            .then(function () {
                resolve();
            }).catch(function (err) {
                console.log(err)
                reject(err);
            })
    })
}