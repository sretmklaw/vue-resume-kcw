<template>
    <SectionTemplate :section-data="props.sectionData">
        <!-- Cover Grid -->
        <div class="row g-4 g-lg-5">
            <div v-for="subcategory in props.sectionData['content']['subcategories']" class="col-12 thread-container">
                <!-- Cover Scrollpath -->
                <svg id="coverSvg">
                    <path id="coverScrollpath" d="M 0 0 V 0" />
                    <circle id="coverCursor" cx="0" cy="0" />
                </svg>
                <!-- Timeline 
                <ul id="coverScrollContainer" class="thread scroll-container">
                     Item 
                    <li v-for="(item, index) in orderedItems" class="thread-item fade-element cover-fade-element" :class="{ 'visible' : index === 0 }">
                        <Thread :items="props.sectionData['content']['items'][subcategory['id']]"
                                :link-label="subcategory['locales']['buttonLabel']"/>
                    </li>
                </ul>-->
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed} from "vue"
import {useData} from "../../../composables/data.js"
import {useNavigation} from "../../../composables/navigation.js"
import Thread from "../threads/Thread.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()
const navigation = useNavigation()

/**
 * @type {ComputedRef<String>}
 */
const coverTitle = computed(() => {
    if(navigation.isAllAtOnceMode()) {
        return props.sectionData.content['locales']['welcome']
    }
    else {
        return props.sectionData.content['locales']['welcomeShort']
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.cover-title {
    margin-bottom: 1rem;
    text-transform: uppercase;
    font-weight: bold;
}

.info-list {
    @include generate-dynamic-styles-with-hash((
        xxxl: (margin-bottom: 2.5rem),
        lg: (margin-bottom: 2rem),
        md: (margin-bottom: 1.2rem)
    ))
}

.thread-container {
    @include media-breakpoint-up(xxl) {
        &:not(:last-child) {
            padding-right:2.5rem;
        }
    }
    --cert-size:150px;
    --image-size:100px;
    --image-border-size:7px;
    --vertical-spacing:80px;
    --content-padding-top:1rem;
    --scale:1;
    --line-width:calc(var(--scale)*4px);
}

#coverSvg {
    margin-left: calc((var(--image-size)/2 - var(--line-width)));
    margin-top: calc(var(--bs-gutter-y) + var(--margin-top));
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    overflow: visible;
}

#coverScrollpath {
    position: fixed;
    fill: none;
    height: 100%;
    stroke-width: var(--line-width);
    stroke-linecap: round;
    top: 0;
    bottom: 0;
    stroke: $light-4;
}

#coverdCursor {
    fill: $light-4;
    stroke: $light-3;
    stroke-width: calc(var(--line-width)*1.6);
    r: calc(1rem * var(--scale));
}

</style>
