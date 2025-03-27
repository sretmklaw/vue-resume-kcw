<template>
    <SectionTemplate :section-data="props.sectionData">
        <div class="row g-4 g-lg-5">
            <div class="col-12 timeline-container">
                <!-- Timeline Grid -->
                <ul id="introTimelineGrid" class="thread scroll-container">
                    <!-- Timeline Scrollpath -->
                    <svg id="introSvg">
                        <path id="introScrollpath" d="M 0 0 V 0" />
                        <circle id="introCursor" cx="0" cy="0" />
                    </svg>

                    <div class="buffer"></div>

                    <!-- Items -->
                    <li v-for="item in props.sectionData['content']['items']" class="thread-item fade-element">

                        <!-- Logo Wrapper for Large Icons -->
                        <div class="timeline-item-logo" :class="{'fa fa-stack thread-icon':!(item['place'] && item['place']['logoUrl'])}">
                            <img v-if="item['place'] && item['place']['logoUrl']"
                                        :src="item['place']['logoUrl']"
                                        :alt="item['place']['name']"
                                        class="timeline-item-img img-fluid rounded-circle"/>
                        </div>

                        <!-- Content -->
                        <div class="thread-item-content">
                            <!-- Description -->
                            <p v-html="item['description']" class="thread-item-description text-3 text-muted mb-1 mb-md-2"/>
                        </div>

                        <div class="buffer"></div>

                    </li>
                </ul>
            </div>
        </div>
    </SectionTemplate>
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"

const props = defineProps({
    sectionData: Object
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

    #introSvg {
        margin-left: calc(((var(--image-size)*1.5)/2));
        position: absolute;
        bottom: 0;
        height: 100%;
        overflow: visible;
    }

    #introScrollpath {
        position: fixed;
        fill: none;
        height: 100%;
        stroke-width: var(--line-width);
        stroke-linecap: round;
        top: 0;
        bottom: 0;
        stroke: $light-4;
    }

    #introCursor {
        fill: $light-4;
        stroke: $light-3;
        stroke-width: calc(var(--line-width)*1.6);
        r: calc(1rem * var(--scale));
    }

    .buffer {
        min-height: var(--vertical-spacing);
    }

    .thread-item {
        min-height: calc(5rem * var(--scale));

        .thread-item-content {
            margin-left: calc(var(--image-size)*1.75);
        }

        .thread-item-description {
            font-size: calc(1.5rem * var(--scale));
        }
    }

    .thread-item-end {
        margin-bottom: 0;
        min-height: calc(1rem * var(--scale));
    }

    .thread-icon {
        display: inline-flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        left: calc(var(--image-size)/2 - var(--line-width)*4);

        width: calc(var(--scale)*2rem);
        height: calc(var(--scale)*2rem);

        border-radius: 100%;
        font-size: calc(1rem * var(--scale));
        color: $light-1;
        background-color: $light-3;
    }

    .timeline-item {
        position: relative;
        min-height: var(--image-size);

        &:not(:last-child) {
            min-height: var(--image-size);
            margin-bottom: var(--vertical-spacing);
        }
    }

    .timeline-item-logo, .timeline-item-logo-sm {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        position: absolute;
        border: var(--image-border-size) solid $light-3;
        border-radius: 100%;
        background-color: $light-4;
    }

    .timeline-item-logo {
        left: 0;
        width: calc(var(--image-size)*1.5);
        height: calc(var(--image-size)*1.5);

        &-bg-primary {
            background-color: lighten($primary, 20%);
        }
    }

    .timeline-item-fa-icon {
        color: $white;
        font-size: calc(var(--image-size)/2.5);
    }

    .timeline-item-content {
        margin-left: calc(var(--image-size) + calc(var(--image-size)/5));
    }

    .timeline-item-content-header {
        display: flex;
        padding-top: var(--content-padding-top);

        .flex-column-texts {
            padding-right: 2rem;
        }

        .flex-column-date {
            margin-left: auto;
        }

        @include media-breakpoint-down(lg) {
            display: block;
            .flex-column-texts {
                padding-right: 0;
            }
        }
    }
}
</style>
