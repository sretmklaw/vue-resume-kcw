<template>
    <!-- Thread -->
    <ul class="thread">
        <!-- Item -->
        <li v-for="item in orderedItems" class="thread-item">

            <!-- Logo Wrapper -->
            <div v-if="item['date']" class="timeline-item-logo-sm" :class="{'fa fa-stack thread-icon':!(item['place'] && item['place']['logoUrl'])}">
                <!-- If item has an image... -->
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
                <h6 class="thread-item-title text-5 fw-bold pt-1 mb-1"> {{ item['locales']['title'] }}</h6>

                <!-- Tags -->
                <Tags :items="_getTagsForItem(item)" class="mt-1 mb-2 mt-lg-2"/>

                <!-- Description -->
                <p v-html="item['locales']['description']" class="thread-item-description text-3 text-normal mb-1 mb-md-2"/>

                <!-- Item -->
                <div v-if="item['place']['certUrl']" class="gallery-item" @click="showModal(item['id'])">
                    <!-- Logo -->
                    <div class="gallery-thumb-wrapper">
                        <ImageView :src="item['place']['certUrl']"
                                :alt="item['place']['locales']['name']"
                                class="gallery-thumb"
                                data-toggle="modal" 
                                data-target="GalleryModal"/>

                        <div class="gallery-thumb-overlay">
                            <div class="gallery-thumb-overlay-content eq-h6">
                                <div><i class="fas fa-eye fa-2x"></i></div>
                                <div>{{ item['locales']['buttonLabel'] }}<i class="fa-solid fa-arrow-up-right-dots ms-1"/></div>
                            </div>
                        </div>
                    </div>
                    
                    <GalleryModal ref="modal" :modalId="item['id']" />
                </div>
            </div>

            <!-- Logo Wrapper -->
            <div v-if="item['period']" class="timeline-item-logo" :class="{'timeline-item-logo-bg-primary':!(item['place'] && item['place']['logoUrl'])}">
                <!-- If item has an image... -->
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
                        <h4 class="timeline-item-title fw-bold" v-html="item['locales']['title']"/>
                        <h6 class="timeline-item-subtitle text-light-6 text-3">
                            <i class="me-2 ms-2" :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-building'"/>
                            <span>{{item['place'] ? item['place']['locales']['name'] : ''}}</span>
                        </h6>
                    </div>

                    <div class="flex-column-date">
                        <Tags :items="_formatItemDate(item)" class="mt-1 me-1"/>
                    </div>
                </div>

                <!-- Item Body -->
                <div class="timeline-item-content-body mt-3">
                    <p class="text-3 text-normal mb-2 mb-md-3 mb-lg-4" v-html="item['locales']['description']"/>
                    <Tags :item-class="'bg-primary'" :items="item['locales']['tags']"/>
                </div>
            </div>
        </li>

        <!-- Trailing Item -->
        <li class="thread-item thread-item-end">
            <!-- Circle -->
            <span class="fa fa-stack thread-icon thread-icon-small">
                <i class="fa fa-circle fa-stack-1x"/>
            </span>
        </li>
    </ul>
</template>

<script setup>
import {computed, ref} from "vue"
import {useUtils} from "../../../composables/utils.js"
import {useLanguage} from "../../../composables/language.js"
import Tags from "../../widgets/Tags.vue"
import ImageView from "../../widgets/ImageView.vue"
import GalleryModal from "../gallery/GalleryModal.vue"

/**
 * @property {Object[]} items
 * @property {String} linkLabel
 */
const props = defineProps({
    items: Array,
    linkLabel: String
})

const language = useLanguage()
const utils = useUtils()
const selectedProject = ref(null)
const modal = ref(null)

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
            label: utils.localizeDate(item['date'], language.getSelectedLanguage()['id'])
        },
        {
            faIcon: place['faIcon'] ? place['faIcon'] : 'fa fa-building',
            label: place['locales'] ? place['locales']['name'] : place
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
    const from = utils.localizeDate(period[0], language.getSelectedLanguage()['id'])
    const to = (period[1] === "Present") ? "Present" : utils.localizeDate(period[1], language.getSelectedLanguage()['id'])

    return [{
        faIcon: 'fa fa-calendar-check',
        label: from + ' <span class="me-1 ms-1">➔</span> ' + to
    }]
}

const emit = defineEmits(['open'])

function showModal(id) {
    document.querySelector('div[modalid='+id+']').display;
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
    @include media-breakpoint-down(md) {--scale:0.9;}
    @include media-breakpoint-down(sm) {--scale:0.8;}

    position: relative;
    padding: 0;
    list-style: none;
    margin-left: calc(var(--scale)*-5px);

    @include media-breakpoint-down(md) {
        --image-size:75px;
        --vertical-spacing:60px;
    }

    @include media-breakpoint-down(sm) {
        --image-size:50px;
        --image-border-size:5px;
        --vertical-spacing:40px;
        --content-padding-top:0.6rem;
    }

    position: relative;
    padding: 0;
    list-style: none;

    &:before {
        position: absolute;
        top: 0;
        bottom: 0;
        left: calc(var(--image-size)/2 - var(--line-width)/2);
        width: var(--line-width);
        content: "";
        background-color: $light-4;
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

    .thread-icon-small {
        left: calc(var(--image-size)/2 - var(--line-width)*3);

        width: calc(var(--scale)* 1.5rem);
        height: calc(var(--scale)* 1.5rem);

        border: calc(var(--line-width)*1.6) solid $light-3;
        font-size: calc(0.5rem * var(--scale));
        color: transparent;
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

    .gallery-title {
        border: none;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        color: $dark;

        margin: calc(var(--cert-size)/12) 0 0;
        font-size: calc(var(--cert-size)/8.2);
        @include media-breakpoint-down(lg) {
            margin: calc(var(--cert-size)/12) 0 0;
            font-size: calc(var(--cert-size)/6.4);
        }
    }

    .gallery-category {
        margin: 0;
        padding: 0;

        font-size: calc(var(--cert-size)/10.5);
        @include media-breakpoint-down(lg) {
            font-size: calc(var(--cert-size)/7.8);
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
}
</style>