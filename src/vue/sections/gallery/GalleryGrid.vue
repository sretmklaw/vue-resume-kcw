<template>
    <div class="gallery-grid row">
        <!-- Grid Column -->
        <div v-for="item in props.items"
             v-show="item.visible"
             class="gallery-grid-col col-6 col-xl-4 text-center"
             :class="{'gallery-grid-col-appear': item.visible && !isAnimating}">

            <!-- Item -->
            <div class="gallery-item" @click="_onItemClicked(item)">
                <!-- Logo -->
                <div class="gallery-thumb-wrapper">
                    <ImageView :src="item.data['logoUrl']"
                               :alt="item.data['name']"
                               class="gallery-thumb"/>

                    <div class="gallery-thumb-overlay">
                        <div class="gallery-thumb-overlay-content eq-h6">
                            <i class="fas fa-eye fa-2x"></i>
                        </div>
                    </div>
                </div>

                <!-- Project Info -->
                <div class="gallery-description-wrapper">
                    <button class="gallery-title">{{ item.data['title'] }}</button>
                    <p class="gallery-category text-muted">{{ item.data['subtitle'] }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {ref, watch} from "vue"
import ImageView from "../../widgets/ImageView.vue"

/**
 * @property {Object[]} items
 * @property {String} selectedCategoryId
 */
const props = defineProps({
    items: Array,
    selectedCategoryId: String
})

const emit = defineEmits(['open'])

/**
 * @const
 * @type {number}
 */
const ANIMATION_DURATION = 0.3

/** @type {Boolean||{value:Boolean}} **/
const isAnimating = ref(false)

/** @type {Number} **/
let timeout = null

/**
 * @param {Object} item
 * @private
 */
const _onItemClicked = (item) => {
    emit('open', item.data)
}

/**
 * @private
 */
watch(() => props.selectedCategoryId, () => {
    isAnimating.value = false
    clearTimeout(timeout)

    timeout = setTimeout(() => {
        isAnimating.value = true
    }, ANIMATION_DURATION*1000)
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.gallery-grid {
    --logo-size: min(clamp(280px, 40vh, 340px), clamp(160px, 21vw, 340px));
    @include media-breakpoint-down(lg) {
        --logo-size: min(clamp(160px, 40vh, 220px), clamp(150px, 34vw, 220px));
    }

    min-height: calc(var(--logo-size) * 2);

    .gallery-item {
        display: inline-flex;
        flex-direction: column;
        position: relative;
        margin-top: calc(var(--logo-size)/10);
    }

    .gallery-thumb-wrapper {
        position: relative;
        margin: 0 auto;
        cursor: pointer;
        height: var(--logo-size);
        width: var(--logo-size);
        overflow: hidden;
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
        }
    }

    .gallery-title {
        border: none;
        padding: 0;
        font-weight: bold;
        background-color: transparent;
        color: $dark;

        margin: calc(var(--logo-size)/12) 0 0;
        font-size: calc(var(--logo-size)/14);
        @include media-breakpoint-down(lg) {
            margin: calc(var(--logo-size)/12) 0 0;
            font-size: calc(var(--logo-size)/10);
        }
    }

    .gallery-category {
        margin: 0;
        padding: 0;

        font-size: calc(var(--logo-size)/18);
        @include media-breakpoint-down(lg) {
            font-size: calc(var(--logo-size)/12);
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

.gallery-grid-col-appear {
    animation: appear 0.3s ease-out forwards;
}

@keyframes appear {
    from {
        opacity:0;
        transform: scale(0.3) translateY(-20%);
    }
    to {
        opacity:1
    }
}
</style>