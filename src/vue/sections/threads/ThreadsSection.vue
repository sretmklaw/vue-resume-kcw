<template>
    <SectionTemplate :section-data="props.sectionData">
        <!-- Threads Grid -->
        <div class="row g-4 g-lg-5">
            <div v-for="subcategory in props.sectionData['content']['subcategories']" class="col-12 thread-container">
                <!-- Threads Scrollpath -->
                <svg id="threadSvg">
                    <path id="threadScrollpath" d="M 0 0 V 0" />
                    <circle id="threadCursor" cx="0" cy="0" />
                </svg>
                <Thread id="threadScrollContainer" :items="props.sectionData['content']['items'][subcategory['id']]"
                        :link-label="subcategory['locales']['buttonLabel']"/>
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import Thread from "./Thread.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

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

#threadSvg {
    margin: 20px 0px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: calc(var(--image-size)/2 - var(--line-width)/2);
    height: 100%;
    overflow: visible;
}

#threadScrollpath {
    position: fixed;
    fill: none;
    height: 100%;
    stroke-width: var(--line-width);
    stroke-linecap: round;
    top: 0;
    bottom: 0;
    stroke: $light-4;
}

#threadCursor {
    fill: $light-4;
    stroke: $light-3;
    stroke-width: calc(var(--line-width)*1.6);
    r: calc(1rem * var(--scale));
}

</style>