<template>
    <!-- Link List -->
    <div class="links">
        <div v-for="item in props.items" class="link text-1">
            <a v-if="item['place'] && item['place']['previewUrl']" class="gallery-item" @click="_onItemClicked(item)">
                <!-- Logo -->
                <div class="gallery-thumb-wrapper">
                    <ImageView :src="item['place']['previewUrl']"
                            :alt="item['place']['name']"
                            class="gallery-thumb"/>

                    <div class="gallery-thumb-overlay">
                        <div class="gallery-thumb-overlay-content eq-h6">
                            <div><i class="fas fa-eye fa-2x"></i></div>
                            <div>{{ item['buttonLabel'] }}<i class="fa-solid fa-arrow-up-right-dots ms-1"/></div>
                        </div>
                    </div>
                </div>
                <div class="link-item-logo-sm">
                    <img v-if="item['place'] && item['place']['logoUrl']"
                                :src="item['place']['logoUrl']"
                                :alt="item['place']['logoImg']"
                                class="link-item-img img-fluid rounded-circle"/>
                </div>
            </a>
        </div>
    </div>
</template>

<script setup>
import ImageView from "./ImageView.vue"
import {useNavigation} from "/src/composables/navigation.js"

const navigation = useNavigation()

const props = defineProps({
    items: Array
})

const emit = defineEmits(['open'])

const _onItemClicked = (item) => {
    emit('open', item)
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.link {
    &:not(:last-child) {
        margin-right: 0.3rem;
    }
    display: inline-block;
}

.gallery-item {
    flex-wrap: wrap;
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
    display: inline-block;
    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        display: none;
    }
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

.link-item-logo-sm {
    margin-top: 0.5rem !important;
    justify-content: center;
    align-items: center;
    border: var(--image-border-size) solid $light-3;
    border-radius: 100%;
    background-color: $light-4;
    width: calc(var(--scale)* 4rem);
    height: calc(var(--scale)* 4rem);
    display: none;
    @include media-breakpoint-down($navigation-sidebar-breakpoint) {
        display: inline-block;
    }
}
</style>