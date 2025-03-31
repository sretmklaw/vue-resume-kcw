<template>
    <SectionTemplate :section-data="props.sectionData">
        <ul id="contactGrid">
            <li class="fade-element">
                <!-- Contact Items -->
                <ContactOptions
                    :items="props.sectionData['content']['items']"
                    :display-as-list="false"/>

                <!-- SubHeading -->
                <SubHeading 
                    :title="props.sectionData['content']['subtitle']"
                    :description="props.sectionData['content']['subtitleDescription']"
                    class="mt-4" />

                <!-- Link Grid -->
                <div class="resume">
                    <PopupIcons :items="props.sectionData['content']['popupIcons']" @open="_onProjectOpened"/>
                </div>
            </li>
        </ul>

    </SectionTemplate>

    <ContactModal ref="contactModal" :project="selectedProject" />
</template>

<script setup>
import {ref} from "vue"
import SectionTemplate from "../_templates/SectionTemplate.vue"
import SubHeading from "../_templates/SubHeading.vue"
import ContactOptions from "./ContactOptions.vue"
import PopupIcons from "../../widgets/PopupIcons.vue"
import ContactModal from "./ContactModal.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const selectedProject = ref(null)
const contactModal = ref(null)

/**
 * @param {Object} project
 * @private
 */
 const _onProjectOpened = (project) => {
    selectedProject.value = project
    contactModal.value.display()
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.resume {
    --scale:1;
    @include media-breakpoint-down(md) {
        --scale:0.9;
    }
    @include media-breakpoint-down(sm) {
        --scale:0.8;
    }
    max-width: 350px;
    width: 100%;
}

ul {
    padding-left: 0px;
}

li {
    list-style: none;
}
</style>