<template>
    <SectionTemplate :section-data="props.sectionData">
        <ul id="creationsGrid" class="gallery-section-row row g-0">
            <li class="fade-element">
                <!-- Filter -->
                <div class="col-12">
                    <FilterTabs :items="tabItems" @selected="_onFilterTabSelected"/>
                </div>

                <!-- Grid -->
                <div class="col-12">
                    <CreationsGrid :items="filteredResults"
                                :selected-category-id="selectedCategoryId"
                                @open="_onProjectOpened"/>
                </div>
            </li>
        </ul>
    </SectionTemplate>

    <CreationsModal ref="creationsModal" :project="selectedProject" />
</template>

<script setup>
import SectionTemplate from "../_templates/SectionTemplate.vue"
import {computed, ref} from "vue"
import {useData} from "../../../composables/data.js"
import FilterTabs from "../../widgets/FilterTabs.vue"
import CreationsGrid from "./CreationsGrid.vue"
import CreationsModal from "./CreationsModal.vue"

/**
 * @property {Object} sectionData
 */
const props = defineProps({
    sectionData: Object
})

const data = useData()

const selectedCategoryId = ref(null)
const selectedProject = ref(null)
const creationsModal = ref(null)

/**
 * @type {ComputedRef<Array>}
 */
const tabItems = computed(() => {
    const items = []

    const subcategories = props.sectionData['content']['subcategories']
    for(let i in subcategories) {
        const subcategory = subcategories[i]

        items.push({
            id: subcategory['id'],
            label: subcategory['title']
        })
    }

    return items
})

/**
 * @type {ComputedRef<Array>}
 */
const filteredResults = computed(() => {
    const filteredItems = []

    const itemsByCategory = props.sectionData['content']['items']
    const selectedCategoryIdValue = selectedCategoryId.value

    for (const subcategory of props.sectionData['content']['subcategories']) {
        const subcategoryId = subcategory['id']
        const subcategoryItems = itemsByCategory[subcategoryId]

        for (const itemData of subcategoryItems) {
            const isVisible = !selectedCategoryIdValue || selectedCategoryIdValue === subcategoryId

            filteredItems.push({
                data: itemData,
                subcategory: subcategory,
                visible: isVisible
            })
        }
    }

    return filteredItems
})

/**
 * @param {String} categoryId
 * @private
 */
const _onFilterTabSelected = (categoryId) => {
    selectedCategoryId.value = categoryId
}

/**
 * @param {Object} project
 * @private
 */
const _onProjectOpened = (project) => {
    selectedProject.value = project
    creationsModal.value.display()
}
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

ul {
    padding-left: 0px;
}

li {
    list-style: none;
}
</style>