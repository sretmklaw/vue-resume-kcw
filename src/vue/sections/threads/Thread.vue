<template>
    <!-- Timeline -->
    <ul id="threadScrollContainer" class="thread scroll-container">

        <!-- Threads Scrollpath -->
        <svg id="threadSvg">
            <path id="threadScrollpath" d="M 0 0 V 0" />
            <circle id="threadCursor" cx="0" cy="0" />
        </svg>

        <!-- Item -->
        <li v-for="(item, index) in orderedItems" class="thread-item fade-element thread-fade-element" :class="{ 'visible' : index === 0 }">

            <!-- Logo Wrapper for Large Icons -->
            <div v-if="item['date']" class="timeline-item-logo-sm" :class="{'fa fa-stack thread-icon':!(item['place'] && item['place']['logoUrl'])}">
                <img v-if="item['place'] && item['place']['logoUrl']"
                            :src="item['place']['logoUrl']"
                            :alt="item['place']['logoImg']"
                            class="timeline-item-img img-fluid rounded-circle"/>
                <!-- Fallback, use font awesome icon... -->
                <i v-else  class="timeline-item-fa-icon"
                            :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-clock'"/>
            </div>

            <!-- Content -->
            <div v-if="item['date']" class="thread-item-content">
                <!-- Title -->
                <h6 class="thread-item-title text-5 fw-bold pt-1 mb-1"> {{ item['title'] }}</h6>
                <h6 class="timeline-item-subtitle text-light-6 text-3">
                    <i class="me-2 ms-2" :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-building'"/>
                    <span>{{item['place'] ? item['place']['name'] : ''}}</span>
                </h6>
                <!-- Tags -->
                <Tags :items="_getTagsForItem(item)" class="mt-1 mb-2 mt-lg-2"/>

                <!-- Description -->
                <p v-html="item['description']" class="thread-item-description text-3 text-normal mb-1 mb-md-2"/>

                <!-- Item -->
                <a v-if="item['place']['certUrl']" class="gallery-item" :href="item['href']" target="_blank">
                    <!-- Logo -->
                    <div class="gallery-thumb-wrapper">
                        <ImageView :src="item['place']['certUrl']"
                                :alt="item['place']['name']"
                                class="gallery-thumb"
                                data-toggle="modal" 
                                data-target="GalleryModal"/>

                        <div class="gallery-thumb-overlay">
                            <div class="gallery-thumb-overlay-content eq-h6">
                                <div><i class="fas fa-eye fa-2x"></i></div>
                                <div>{{ item['buttonLabel'] }}<i class="fa-solid fa-arrow-up-right-dots ms-1"/></div>
                            </div>
                        </div>
                    </div>
                </a>
            </div>

            <!-- Logo Wrapper for Small Icons -->
            <div v-if="item['period']" class="timeline-item-logo" :class="{'timeline-item-logo-bg-primary':!(item['place'] && item['place']['logoUrl'])}">
                <img v-if="item['place'] && item['place']['logoUrl']"
                            :src="item['place']['logoUrl']"
                            :alt="item['place']['logoImg']"
                            class="timeline-item-img img-fluid rounded-circle"/>
                <!-- Fallback, use font awesome icon... -->
                <i v-else  class="timeline-item-fa-icon"
                            :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-clock'"/>
            </div>

            <!-- Item Content -->
            <div v-if="item['period']" class="timeline-item-content">
                <!-- Item Header -->
                <div class="timeline-item-content-header">
                    <!-- Title + Institution Flex Column -->
                    <div class="flex-column-title">
                        <h4 class="timeline-item-title fw-bold" v-html="item['title']"/>
                        <h6 class="timeline-item-subtitle text-light-6 text-3">
                            <i class="me-2 ms-2" :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-building'"/>
                            <span>{{item['place'] ? item['place']['name'] : ''}}</span>
                        </h6>
                        <Tags :items="_formatItemDate(item)" class="mt-1 me-1"/>
                    </div>
                </div>

                <!-- Item Body -->
                <div class="timeline-item-content-body mt-3">
                    <p class="text-3 text-normal mb-2 mb-md-3 mb-lg-4" v-html="item['description']"/>
                    <Tags :item-class="'bg-primary'" :items="item['tags']"/>
                </div>
            </div>
        </li>
    </ul>
</template>

<script setup>
import {computed, ref} from "vue"
import {useUtils} from "../../../composables/utils.js"
import Tags from "../../widgets/Tags.vue"
import ImageView from "../../widgets/ImageView.vue"

/**
 * @property {Object[]} items
 * @property {String} linkLabel
 */
const props = defineProps({
    items: Array,
    linkLabel: String
})

const utils = useUtils()

/**
 * @type {ComputedRef<Array>}
 */
const orderedItems = computed(() => {
    return utils.reverseArray(props.items)
})

/**
 * @param {Object} item
 * @return {[{faIcon: string, label: String},{faIcon: (String|string), label: *}]}
 * @private
 */
const _getTagsForItem = (item) => {
    const place = item['place']

    return [
        {
            faIcon: 'fa fa-calendar-check',
            label: utils.localizeDate(item['date'])
        }
    ]
}

/**
 * @param {Object} item
 * @return {[{faIcon: string, label: string}]}
 * @private
 */
 const _formatItemDate = (item) => {
    const period = item['period']
    const from = utils.localizeDate(period[0])
    const to = (period[1] === "Present") ? "Present" : utils.localizeDate(period[1])

    return [{
        faIcon: 'fa fa-calendar-check',
        label: from + ' <span class="me-1 ms-1">➔</span> ' + to
    }]
}
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

    .thread-item {
        min-height: calc(5rem * var(--scale));
        margin-bottom: calc(2.5rem * var(--scale));

        .thread-item-content {
            margin-left: calc(var(--image-size) + calc(var(--image-size)/5));
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
        width: var(--image-size);
        height: var(--image-size);

        &-bg-primary {
            background-color: lighten($primary, 20%);
        }
    }

    .timeline-item-logo-sm {
        left: calc((var(--image-size)/2 - var(--line-width)/2) - calc(var(--scale)* 2rem));
        width: calc(var(--scale)* 4rem);
        height: calc(var(--scale)* 4rem);
    }

    .timeline-item-fa-icon {
        color: $white;
        font-size: calc(var(--image-size)/2.5);
    }

    .timeline-item-tail {
        left: calc(var(--image-size)/4);
        min-height: calc(var(--image-size)/2);

        .timeline-item-logo {
            width: calc(var(--image-size)/2);
            height: calc(var(--image-size)/2);
            background-color: $light-4;
        }
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

    .gallery-item {
        flex-direction: column;
        position: relative;
    }

    .gallery-thumb-wrapper {
        position: relative;
        cursor: pointer;
        height: var(--cert-size);
        width: calc(var(--cert-size)*1.5);
        overflow: hidden;
        margin: 1rem 0;
        border-style: outset;
    }

    .gallery-thumb {
        width: 100%;
        height: 100%;
    }

    .gallery-thumb-overlay {
        position: absolute;
        top: 0;
        opacity: 0;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 100%;
        height: 100%;

        background: fade-out(lighten($primary, 5%), 0.1);
        transition: all ease-in-out 0.25s;

        &-content {
            color: $white;
            text-align: center;
        }
    }

    .gallery-item:hover {
        .gallery-title {
            color: lighten($primary, 10%);
            transition: color ease-in-out 0.3s;
        }

        .gallery-thumb-overlay {
            opacity: 1;
        }
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