<template>
    <!-- Website Section -->
    <section v-show="isVisible" :id="props.sectionData['id']" :class="classList">
        <!-- Section Container -->
        <div class="section-container" v-if="props.sectionData.content">
            <h1 class="section-title mb-1 mb-lg-2 fw-bold text-uppercase" v-html="sectionTitle"/>
            <!-- Description -->
            <p v-if="props.sectionData.content['description']" class="lead text-muted">
                {{props.sectionData.content['description']}}
            </p>
            <!-- Section Content -->
            <div class="section-content">
                <slot/>
            </div>
        </div>
    </section>
</template>

<script setup>
import {computed} from "vue"
import {useNavigation} from "../../../composables/navigation.js"
import {useData} from "../../../composables/data.js"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()
const navigation = useNavigation()

/**
 * @type {ComputedRef<Boolean>}
 */
const isVisible = computed(() => {
    return props.sectionData && navigation.isSectionVisible(props.sectionData['id'])
})

/**
 * @type {ComputedRef<string>}
 */
const classList = computed(() => {
    let classList = 'section'

    if(navigation.isAllAtOnceMode()) {
        classList += ' section-with-division'
    }

    if(props.sectionData['cover']) {
        classList += ' section-cover'
    }
    
    return classList
})

/**
 * @type {ComputedRef<String>}
 */
const sectionTitle = computed(() => {
    if (props.sectionData.cover) {
        return props.sectionData.content['title']
    } if(navigation.isAllAtOnceMode()) {
        return props.sectionData.content['title']
    } else {
        return data.getString(props.sectionData['id'])
    }
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.section {
    --max-height:clamp(130px, 22.5vh, 170px);

    position: relative;
    display: flex;
    min-height: 100vh;

    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        min-height: calc(100vh - 170px);
        .section-container {
            margin-top: calc(33vh - var(--max-height));
        }
    }

    @include media-breakpoint-up($navigation-sidebar-breakpoint) {
        .section-container {
            margin-top: 33vh;
            margin-left: 0;
            margin-right: 0;
        }
    }

    .section-container {

        @include generate-dynamic-styles-with-hash((
            xxxl:   (padding: clamp(5rem, 5vw, 10rem) clamp(5rem, 5vw, 10rem) clamp(6rem, 5vw, 10rem)),
            xxl:    (padding: 4rem 4rem 6rem),
            lg:     (padding: 2rem 2rem),
            md:     (padding: 1.5rem 1.5rem),
            sm:     (padding: 1.5rem 1.2rem 3rem)
        ));

        width: min(100%, $max-content-width);

        @include media-breakpoint-down($navigation-sidebar-breakpoint) {
            margin-bottom: $nav-tabs-height;
        }
    }
}



.section-header {
    @include generate-dynamic-styles-with-hash((
        xxxl: (margin-bottom:3rem),
        xxl: (margin-bottom:2.5rem),
        xl: (margin-bottom:2rem),
        lg: (margin-bottom:1.5rem),
    ))
}
</style>