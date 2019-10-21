// 转换语言格式
export default (i18nConfig) => {
    const productData = {}
    const languages = i18nConfig.languages.map(lang => lang.code)
    const languageData = i18nConfig.data

    const buildProductData = (parentLangs, currentLangs, prevKey, targetLang) => {
        for (const item in currentLangs) {
            if (item === targetLang) {
                parentLangs[prevKey] = currentLangs[item]
            } else if (typeof currentLangs[item] === 'object') {
                buildProductData(currentLangs, currentLangs[item], item, targetLang)
            }
        }
    }

    languages.forEach((lang) => {
        productData[lang] = JSON.parse(JSON.stringify(languageData))
        buildProductData(null, productData[lang], null, lang)
    })
    return productData
}
