<template>
    <!-- Timeline Grid -->
    <ul class="thread scroll-container">

        <!-- Timeline Scrollpath -->
        <svg id="threadSvg">
            <path id="threadScrollpath" d="M 0 0 V 0" />
            <circle id="threadCursor" cx="0" cy="0" />
        </svg>

        <!-- Item -->
        <TimelineItem :items="items" :linkLabel="linkLabel" />
    </ul>
</template>

<script setup>
import TimelineItem from "./TimelineItem.vue"

/**
 * @property {Object[]} items
 * @property {String} linkLabel
 */
const props = defineProps({
    items: Array,
    linkLabel: String
})

</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul.thread {
    --cert-size:150px;
    --image-size:100px;
    --image-border-size:7px;
    --vertical-spacing:80px;
    --content-padding-top:1rem;
    --scale:1;
    --line-width:calc(var(--scale)*4px);

    position: relative;
    padding: 0;
    list-style: none;
    margin-left: calc(var(--scale)*-5px);

    @include media-breakpoint-down(md) {
        --scale:0.9;
        --image-size:75px;
        --vertical-spacing:60px;
    }

    @include media-breakpoint-down(sm) {
        --scale:0.8;
        --image-size:50px;
        --image-border-size:5px;
        --vertical-spacing:40px;
        --content-padding-top:0.6rem;
    }

    #threadSvg {
        margin-left: calc((var(--image-size)/2 - var(--line-width)));
        position: absolute;
        top: calc((var(--image-size)/2));
        bottom: 0;
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

}
</style>