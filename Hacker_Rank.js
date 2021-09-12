
const puppeteer = require("puppeteer");
const emailpassObj = require("../secrets");
const { answers } = require("./tempCodeFile.js");
// const emailpassObj = require("./emailpassObj");
let browserStartPuppeteer = puppeteer.launch({
    headless: false,
    // slowMo:1000,
    defaultViewport:null,
    args:["--start-manimized","--disabled-notifications"]
});
let browser,page;
browserStartPuppeteer.then(function(browserObj){
    console.log("browser opened");
    browser = browserObj;
    let browserTabOpenPromise = browserObj.newPage();
    return browserTabOpenPromise;
}).then(function(Newtab){
    page = Newtab;
        console.log("New tab opened");
        let gPageOpenPromise = page.goto("https://www.hackerrank.com/dashboard");
        return gPageOpenPromise;
}).then(function(){
    console.log("wait for element to be visible");
    let waitForElementPromise = waitAndclick(".login.pull-right.btn.btn-dark.btn-default.mmT", page);
    return waitForElementPromise;
 
   }).then(function(){
    // console.log("Google home page opened");
   let waitForTypingPromise =  page.type("input[id='input-1']",emailpassObj.email,{delay:50});
   return waitForTypingPromise;
}).then(function () {
    let passwordWillBeEnteredPromise = page.type("input[id='input-2']", emailpassObj.password,{delay:50});
    return passwordWillBeEnteredPromise;
}).then(function(){
    // console.log("wait for element to be visible");
    let loginPromise = page.click("button[type = 'submit']", {delay:100});
    return loginPromise;

}).then(function(){
    // console.log("wait for element to be visible");
    let algorithmPromise = waitAndclick(" a[data-analytics='SelectTopic']", page);
    return algorithmPromise;

}).then(function(){
    // console.log("wait for element to be visible");
    let clickWarmupPromise = waitAndclick("input[value='warmup']", page);
    return clickWarmupPromise;

}).then(function(){
    // console.log("wait for element to be visible");
    let clickSolvePromise =page.$$(".ui-btn.ui-btn-normal.primary-cta.ui-btn-line-primary.ui-btn-styled",{ delay: 100 });    return clickSolvePromise;

}).then(function(questionArr){
    console.log("number of questions",questionArr.length);
    let qWillBeSolvePromise = questionSolver(page,questionArr[0],answers[0])
    return qWillBeSolvePromise;

}).then(function(){
    console.log("question is solved");
})

   function waitAndclick(selector,cPage){
    return new Promise(function(resolve,reject){
let waitForModalPromise = cPage.waitForSelector(selector, {visivble:true});
waitForModalPromise.then(function(){
    let clickModal = cPage.click(selector, {delay:100})
    return clickModal;
}).then(function(){
    resolve();
}).catch(function(err){
    reject(err);
})
}
)
}



function questionSolver(page, question, answer) {
    return new Promise(function (resolve, reject) {
        let qWillBeCLickedPromise = question.click();
        qWillBeCLickedPromise
            //click
            // code type 
            // ctrl A+ ctrl x
            // click on editor 
            // ctrl A+ctrl v
            //  reached to editor
            .then(function () {
                // focus 
                let waitFOrEditorToBeInFocus =
                    waitAndclick(".monaco-editor.no-user-select.vs", page);
                return waitFOrEditorToBeInFocus;
            })
            // click
            .then(function () {
                return waitAndclick(".checkbox-input", page);
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
                    waitAndclick(".monaco-editor.no-user-select.vs", page);
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
