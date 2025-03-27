<template>
    <!-- Item -->
    <div>
        <li v-for="item in orderedItems" class="thread-item fade-element">

            <!-- Logo Wrapper -->
            <div class="timeline-item-logo" :class="{'timeline-item-logo-bg-primary':!(item['place'] && item['place']['logoUrl'])}">
                <img v-if="item['place'] && item['place']['logoUrl']"
                            :src="item['place']['logoUrl']"
                            :alt="item['place']['logoImg']"
                            class="timeline-item-img img-fluid rounded-circle"/>
                <!-- Fallback, use font awesome icon... -->
                <i v-else class="timeline-item-fa-icon"
                            :class="item['place']['faIcon'] ? item['place']['faIcon'] : 'fa-solid fa-clock'"/>
            </div>

            <!-- Item Content -->
            <div class="timeline-item-content">
                <!-- Item Header -->
                <div class="timeline-item-content-header">
                    <!-- Title -->
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
                    <Links :items="item['links']"/>
                </div>
            </div>
        </li>
    </div>
</template>

<script setup>
import {computed, ref} from "vue"
import {useUtils} from "../../../composables/utils.js"
import Tags from "../../widgets/Tags.vue"
import Links from "../../widgets/Links.vue"

/**
 * @property {Object[]} items
 */
const props = defineProps({
    items: Array
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
}
</style>