import {reactive} from "vue"
import {useUtils} from "./utils.js"
import {useConstants} from "./constants.js"

const constants = useConstants()
const utils = useUtils()

/**
 * @type {Object}
 * @private
 */
let _jsonData = reactive({
    sections: [],
    categories: [],
    places: null,
    profile: null,
    settings: null,
    strings: null
})

let _progressData = reactive({
    loadedFiles: 0,
    totalFiles: 5
})

let _localizedData = reactive({id:null, entries:null})
let _localizationsCache = {}

export function useData() {
    /**
     * Fetch only essential stuff for booting up the app.
     * @return {Promise<void>}
     */
    const fetchEssentials = async () => {
        const jSections = await _loadJson(constants.BASE_PATH + '/data/sections.json')
        const jSettings = await _loadJson(constants.BASE_PATH + '/data/settings.json')
        const jStrings = await _loadJson(constants.BASE_PATH + '/data/strings.json')

        _jsonData.sections = jSections['sections']
        _jsonData.categories = jSections['categories']
        _jsonData.settings = jSettings
        _jsonData.strings = jStrings

        _progressData.loadedFiles = 3
        _progressData.totalFiles += _jsonData.sections.length
    }

    /**
     * @return {Promise<void>}
     */
    const fetchAll = async () => {
        const jPlaces = await _loadJson(constants.BASE_PATH + '/data/info/places.json')
        const jProfile = await _loadJson(constants.BASE_PATH + '/data/info/profile.json')

        _jsonData.places = jPlaces
        _jsonData.profile = jProfile
        _progressData.loadedFiles = 5

        await _loadSections()
        Object.values(_jsonData).forEach(_evaluateObject)

        _localizationsCache = {}
        _localizedData.entries = null

    }

    /**
     * @return {Array}
     */
    const getSections = () => {
        _updateLocalization()
        return _localizedData.entries.sections
    }

    /**
     * @return {Array}
     */
    const getCategories = () => {
        _updateLocalization()
        return _localizedData.entries.categories
    }

    /**
     * @param {String} categoryId
     * @return {Array}
     */
    const getCategorySections = (categoryId) => {
        return getSections().filter(section => section['categoryId'] === categoryId)
    }

    /**
     * @return {Object}
     */
    const getProfile = () => {
        _updateLocalization()
        return _localizedData.entries.profile
    }

    /**
     * @return {Object}
     */
    const getSettings = () => {
        return _jsonData.settings
    }

    /**
     * @param {String} string
     * @return {String}
     */
    const getString = (string) => {
        _updateLocalization()
        return _localizedData.entries.strings[string]
    }

    /**
     * @return {number}
     */
    const getLoadProgress = () => {
        const percentage = 100 * _progressData.loadedFiles / _progressData.totalFiles
        return utils.clamp(Math.round(percentage), 0, 100)
    }

    /**
     * @return {boolean}
     */
    const isReady = () => {
        return getLoadProgress() === 100
    }

    /**
     * @param path
     * @return {Object}
     * @private
     */
    const _loadJson = async (path) => {
        const request = await fetch(path)
        return request.json()
    }

    /**
     * @return {Promise<void>}
     * @private
     */
    const _loadSections = async () => {
        for (const section of _jsonData.sections) {
            const sectionId = section['id']
            const sectionCategoryId = section['categoryId']
            const sectionCategory = _findObjectWithId(_jsonData.categories, sectionCategoryId)
            const jsonPath = section['jsonPath']

            if(!sectionCategory) {
                throw new Error(`The section with id "${sectionId}" has an invalid categoryId "${sectionCategoryId}". There's no such category.`)
            }

            sectionCategory['sectionIds'] = sectionCategory['sectionIds'] || []
            sectionCategory['sectionIds'].push(sectionId)

            if(utils.isStringAJSONUrl(jsonPath)) {
                section['content'] = await _loadJson(jsonPath)
            }
            else {
                section['content'] = {}
            }

            _progressData.loadedFiles++
        }

        /** Delete empty categories, if there's any... **/
        for (let i = _jsonData.categories.length - 1; i >= 0; i--) {
            const categorySectionIds = _jsonData.categories[i]['sectionIds']
            if (!categorySectionIds || categorySectionIds.length === 0) {
                _jsonData.categories.splice(i, 1)
            }
        }
    }

    /**
     * @param {Array} collection
     * @param {String} objectId
     * @return {*|null}
     * @private
     */
    const _findObjectWithId = (collection, objectId) => {
        return collection.find(item => item['id'] === objectId) || null
    }

    /**
     * @param {Object} object
     * @return {Object}
     * @private
     */
    const _evaluateObject = (object) => {
        if(typeof object === 'string') {
            return _parseStringField(object)
        }

        else if(typeof object === 'object') {
            for(let i in object) {
                object[i] = _evaluateObject(object[i])
            }
        }

        return object
    }

    /**
     * @param {String} fieldValue
     * @returns {String|*}
     * @private
     */
    const _parseStringField = (fieldValue) => {
        /** String follows the pattern @link{...} - must create a reference to an object from another json file **/
        if(/@link{([^}]*)}/g.test(fieldValue)) {
            return _resolveCrossJsonReference(fieldValue)
        }

        return fieldValue
    }

    /**
     * @param {String} evalString
     * @returns {String}
     * @private
     */
    const _resolveCrossJsonReference = (evalString) => {
        const match = evalString.match(/@link{([^}]*)}/)
        if (!match) {
            throw new Error("Invalid cross json-reference: " + evalString)
        }

        const expression = match[1]
        const [targetId, ...fields] = expression.split('.')
        const targetObject = _jsonData[targetId] || _findObjectWithId(_jsonData.sections, targetId)?.content

        if (!targetObject) {
            throw new Error("Can't resolve cross json-reference. Target JSON doesn't exist: " + evalString)
        }

        let resolvedObject = targetObject

        for (const field of fields) {
            if (typeof resolvedObject === 'object') {
                resolvedObject = resolvedObject[field]
            }
            else {
                resolvedObject = null
            }

            if (!resolvedObject) {
                throw new Error("Can't resolve cross json-reference. Target property doesn't exist on specified JSON: " + evalString)
            }
        }

        return resolvedObject
    }

    const _updateLocalization = () => {
        if(!_localizationsCache[0]) {
            _localizationsCache[0] = _cacheLocalization(_jsonData, 0)
        }
        _localizedData.entries = _localizationsCache[0]
    }

    const _cacheLocalization = (object, id) => {
        const localizedFields = {}
        if(typeof object === 'string' || typeof object === 'number' || typeof object === 'boolean')
            return object

        for(const [key, value] of Object.entries(object)) {
            if(Array.isArray(value)) {
                localizedFields[key] = value.map(valueItem => _cacheLocalization(valueItem, id))
            }
            else if(key.includes('locales')) {
                localizedFields[key] = _getLocalizedEntries(value, id)
            }
            else if(value !== null && value !== undefined) {
                localizedFields[key] = _cacheLocalization(value, id)
            }
            else {
                localizedFields[key] = value
            }
        }

        return localizedFields
    }

    /**
     * @param {Object} localesHash
     * @param {String} languageId
     * @private
     */
    const _getLocalizedEntries = (localesHash, id) => {
        const localizedEntries = {}

        for(let string in localesHash[id]) {
            let translation = localesHash[id]?.[string]
            if(!translation)
                translation = localesHash[id][string]

            localizedEntries[string] = translation
        }
        return localizedEntries
    }

    return {
        fetchEssentials,
        fetchAll,
        getLoadProgress,
        getSections,
        getCategories,
        getCategorySections,
        getProfile,
        getSettings,
        getString
    }
}