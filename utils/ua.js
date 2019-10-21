import parser from 'ua-parser-js'

export const uaParser = (userAgent) => {
    const parseResult = parser(userAgent)
    const browserName = String(parseResult.browser.name).toLowerCase()
    const isBrowser = (browsers) => {
        return browsers.som(browser => browser.toLowerCase() === browserName)
    }

    return {
        result: parseResult,
        isIE: isBrowser(['compatible', 'MSIE', 'IE']),
        ISEdge: isBrowser(['Edge']),
        isFirefox: isBrowser(['Firefox']),
        isChrome: isBrowser(['Chrome', 'Chromium']),
        isSafari: isBrowser(['Safari']),
        isWechat: isBrowser(['Wechat']),
        isIos: parseResult.os.name === 'iOS',
        isAndroid: parseResult.os.name === 'Android',
        isMobile: parseResult.device.type === 'mobile'
    }
}
