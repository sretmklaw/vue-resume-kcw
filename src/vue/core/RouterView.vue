<template>
    <component v-for="section in data.getSections()"
               :is="_getSectionComponentByName(section['component'])"
               :section-data="section"/>
</template>

<script setup>
import {useData} from "../../composables/data.js"

import DefaultSection from "../sections/_templates/SectionTemplate.vue"
import ContactSection from "../sections/contact/ContactSection.vue"
import IntroSection from "../sections/threads/IntroSection.vue"
import CreationsSection from "../sections/creations/CreationsSection.vue"
import InfoSection from "../sections/info/InfoSection.vue"
import ExperienceSection from "../sections/threads/ExperienceSection.vue"

const data = useData()

/**
 * @type {Object}
 */
const SECTION_VUE_COMPONENTS = {DefaultSection, ContactSection, IntroSection, CreationsSection, InfoSection, ExperienceSection}

/**
 * @param {String} componentName
 * @return {*}
 * @private
 */
const _getSectionComponentByName = (componentName) => {
    if(SECTION_VUE_COMPONENTS[componentName])
        return SECTION_VUE_COMPONENTS[componentName]

    console.warn("Couldn't find component with name: " + componentName + ". All section components must be registered on RouterView.vue.")
    return DefaultSection
}
</script>

<style lang="scss" scoped>
</style>