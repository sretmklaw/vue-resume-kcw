import {useConstants} from "./constants.js"

const constants = useConstants()

/**
 * @type {Ref<any>|null}
 * @private
 */
let _feedbackView = null

export function useLayout() {
    /**
     * @param {String} breakpoint
     * @return {boolean}
     */
    const isBootstrapBreakpoint = (breakpoint) => {
        return window.innerWidth >= constants.BOOTSTRAP_BREAKPOINTS[breakpoint]
    }

    /**
     * @return {string}
     */
    const getBootstrapBreakpoint = () => {
        const windowWidth = window.innerWidth
        let windowBreakpoint = ''

        for (const breakpoint in constants.BOOTSTRAP_BREAKPOINTS) {
            if (windowWidth >= constants.BOOTSTRAP_BREAKPOINTS[breakpoint]) {
                windowBreakpoint = breakpoint
            }
        }

        return windowBreakpoint
    }

    /**
     * @param {Ref<any>|null} feedbackView
     */
    const setFeedbackView = (feedbackView) => {
        _feedbackView = feedbackView
    }

    /**
     * @return {*}
     */
    const getFeedbackView = () => {
        if(_feedbackView) {
            return _feedbackView.value
        }

        return null
    }

    /**
     * @param {Boolean} enabled
     */
    const setPageScrollingEnabled = (enabled) => {
        const root = document.getElementsByTagName( 'html' )[0]
        if(!enabled) {
            document.body.className = constants.HTML_CLASSES.bodyNoScroll
            root.className += ' ' + constants.HTML_CLASSES.bodyNoScroll
        }
        else {
            document.body.className = constants.HTML_CLASSES.bodyScroll
            root.className = ''
        }
    }

    /**
     * @param {HTMLElement} element
     * @return {boolean}
     */
    const isElementOutsideBounds = (element) => {
        const rect = element.getBoundingClientRect()

        return (
            rect.bottom < 0 ||
            rect.right < 0 ||
            rect.left > window.innerWidth ||
            rect.top > window.innerHeight
        )
    }

    /**
     * @return {{loaded: number, total: number}}
     */
    const getImageCount = () => {
        const imageElements = document.querySelectorAll('.' + constants.HTML_CLASSES.imageViewImage)
        let totalImages = 0

        const loadedImages = Array.from(imageElements).reduce((count, image) => {
            if(!image.classList.contains(constants.HTML_CLASSES.imageViewImageIgnoredOnCount)) {
                totalImages++
                if (image.getAttribute('loadStatus') !== constants.LoadStatus.LOADING)
                    return count + 1
            }
            return count
        }, 0)

        return {loaded: loadedImages, total: totalImages }
    }

    /**
     * @return {{}}
     */
    const getStylePreferencesForPlugins = () => {
        const preferences = {}
        preferences.colors = {
            primary: getComputedStyle(document.documentElement).getPropertyValue('--bs-primary'),
            dark: getComputedStyle(document.documentElement).getPropertyValue('--bs-dark')
        }

        preferences.colors.random = constants.RANDOM_COLOR_ARRAY.slice()
        return preferences
    }

    /**
     * @param {Number} scrollY
     * @param {Boolean} withTimeout
     */
    const instantScrollTo = (scrollY, withTimeout) => {
        _applyAfterTimeout(() => {
            window.scrollTo({
                top: scrollY ?? 0,
                left: 0,
                behavior: 'instant'
            })
        }, 10)
    }

    /**
     * @param {Number} scrollY
     * @param {Boolean} withTimeout
     */
    const smoothScrollTo = (scrollY, withTimeout) => {
        _applyAfterTimeout(() => {
            window.scrollTo({
                top: scrollY ?? 0,
                left: 0,
                behavior: 'smooth'
            })
        }, 100)
    }

    /**
     * @param {String} elementId
     * @param {Boolean} withTimeout
     */
    const instantScrollToElement = (elementId, withTimeout) => {
        const target = document.getElementById(elementId)
        if(!target) {
            return
        }

        _applyAfterTimeout(() => {
            target.scrollIntoView({
                behavior: 'instant',
                block: 'start'
            })
        }, 10)
    }

    /**
     * @param {String} elementId
     * @param {Boolean} withTimeout
     */
    const smoothScrollToElement = (elementId, withTimeout) => {
        const target = document.getElementById(elementId)
        if(!target) {
            return
        }

        _applyAfterTimeout(() => {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            })
        }, 100)
    }

    /**
     * @param {Function} closure
     * @param {Number} timeout
     * @private
     */
    const _applyAfterTimeout = (closure, timeout) => {
        if(timeout) {
            setTimeout(closure, timeout)
        }
        else {
            closure()
        }
    }

    const handleScroll = (fadeElements) => {
        for (const fadeElement of fadeElements) {
            var elementTop, elementBottom = 0;
            const viewportHeight = window.innerHeight;
            if (fadeElement.getBoundingClientRect()) {
                elementTop = fadeElement.getBoundingClientRect().top;
                elementBottom = fadeElement.getBoundingClientRect().bottom;
            }
            if (elementTop < viewportHeight/2 && elementBottom > 0) {
                fadeElement.classList.add("visible");
            } else if (elementBottom > viewportHeight/2) {
                fadeElement.classList.remove("visible");
            }
        }
    }
    
    const positionCursor = (threadScrollContainer, scrollpath, cursor) => {
        if (threadScrollContainer && scrollpath && cursor) {

            const newVerticalHeight = threadScrollContainer.clientHeight;
            scrollpath.setAttribute("d", "M 0 0 V " + newVerticalHeight);
            scrollpath.setAttribute("stroke-dasharray", newVerticalHeight);
            scrollpath.setAttribute("stroke-dashoffset", newVerticalHeight);
    
            const length = scrollpath.getTotalLength();
            scrollpath.style.strokeDasharray = length;
            scrollpath.style.strokeDashoffset = length;
            //FIXME
            const scrollpercent = (document.body.scrollTop + document.documentElement.scrollTop) 
                / (document.documentElement.scrollHeight - document.documentElement.clientHeight);
            const draw = length * scrollpercent;
            scrollpath.style.strokeDashoffset = length - draw;
    
            const scrollY = window.scrollY || window.pageYOffset;
            const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
            const pathLen = scrollpath.getTotalLength();
            const dist = pathLen * scrollY / maxScrollY;
            const pos = scrollpath.getPointAtLength(dist);
            if (dist + 1 <= pathLen) {
                var posAhead = scrollpath.getPointAtLength(dist + 1);
                var angle = Math.atan2(posAhead.y - pos.y, posAhead.x - pos.x);
            } else {
                var posBehind = scrollpath.getPointAtLength(dist - 1);
                var angle = Math.atan2(pos.y - posBehind.y, pos.x - posBehind.x);
            }
            cursor.setAttribute("transform", "translate(" + pos.x + "," + pos.y + ") rotate(" + 180 * angle / Math.PI + ")");
        }
    }

    return {
        isBootstrapBreakpoint,
        getBootstrapBreakpoint,
        setFeedbackView,
        getFeedbackView,
        getImageCount,
        getStylePreferencesForPlugins,
        isElementOutsideBounds,
        setPageScrollingEnabled,
        instantScrollTo,
        smoothScrollTo,
        instantScrollToElement,
        smoothScrollToElement,
        handleScroll,
        positionCursor
    }
}