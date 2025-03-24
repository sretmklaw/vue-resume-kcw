<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="row g-4 g-lg-5">
            <div v-for="subcategory in props.sectionData['content']['subcategories']" class="col-12 timeline-container">
                <TimelineGrid id="expTimelineGrid" :items="props.sectionData['content']['items'][subcategory['id']]"
                        :link-label="subcategory['buttonLabel']"/>
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import TimelineGrid from "./TimelineGrid.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.timeline-container {

    --cert-size:150px;
    --image-size:100px;
    --image-border-size:7px;
    --vertical-spacing:80px;
    --content-padding-top:1rem;
    --margin-top:2rem;
    --scale:1;
    --line-width:calc(var(--scale)*4px);

    @include media-breakpoint-up(xxxl) {
        --margin-top:clamp(5rem, 5vw, 10rem);
    }

    @include media-breakpoint-up(xxl) {
        &:not(:last-child) {
            padding-right:2.5rem;
        }
        --margin-top:4rem;
    }
    
    @include media-breakpoint-down(md) {
        --scale:0.9;
        --image-size:75px;
        --vertical-spacing:60px;
        --margin-top:1.5rem;
    }

    @include media-breakpoint-down(sm) {
        --scale:0.8;
        --image-size:50px;
        --image-border-size:5px;
        --vertical-spacing:40px;
        --content-padding-top:0.6rem;
        --margin-top:1.5rem;
    }
}

</style>