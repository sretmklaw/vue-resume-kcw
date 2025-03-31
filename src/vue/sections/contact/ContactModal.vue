<template>
    <!-- Bootstrap Modal -->
    <div class="modal modal-xl fade" :id="UNIQUE_ID" tabindex="-1">
        <div class="modal-dialog modal-dialog-centered">
            <!-- Modal Content -->
            <div class="modal-content">
                <!-- Close Button -->
                <button class="close-button" data-bs-dismiss="modal">
                    <i class="fa fa-close"></i>
                </button>

                <!-- Body -->
                <div v-if="props.project" class="modal-body py-4 py-lg-4">
                    <!-- Content Row -->
                    <div class="row text-center text-lg-start p-2 p-md-4">
                        <!-- Image Column -->
                        <div class="col-12 col-lg-4 pe-0 pe-lg-4">
                            <ImageView  :src="props.project['statusUrl']"
                                        :alt="props.project['title']"
                                        :spinner-enabled="true"
                                        class="logo img-fluid my-auto my-lg-0 mb-3"/>
                        </div>

                        <!-- Texts Column -->
                        <div class="col-12 col-lg-8">
                            <!-- Title -->
                            <h1 class="fw-bold mb-3" v-html="props.project['title']"/>

                            <!-- SubHeading -->
                            <SubHeading 
                                :title="props.project['subtitle']"
                                :description="props.project['subtitleDescription']"
                                class="mt-4" />

                            <!-- Salary Range -->
                            <div class="info-row row gx-4 gx-xl-5">
                                <div class="text-4 col-12 subcategory-col">
                                    <InfoItem :item="props.project['salaryRange']"
                                        :highlighted-header="true"
                                        :small-description="false"
                                        :description-with-progress-bar="true"
                                        :icon-color-style="'solid'"
                                        class="info-item"/>
                                </div>
                            </div>

                            <!-- About SubSection -->
                            <div class="modal-subsection">
                                <!-- Title -->
                                <h5 class="d-none d-lg-inline-block fw-bold">
                                    <i class="fa fa-file me-2"/>
                                    <span class="ms-1">Disclaimer</span>
                                </h5>

                                <!-- Content -->
                                <p v-html="props.project['description']" class="text-3 text-light-7"/>
                            </div>

                            <!-- Links SubSection -->
                            <div class="modal-subsection">

                                <!-- Content -->
                                <p v-html="props.project['whereToFindDescription']" class="text-3 text-light-7"/>

                                <!-- Social Links -->
                                <SocialLinks :items="props.project['links']"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted} from "vue"
import SubHeading from "../_templates/SubHeading.vue"
import Modal from "../../../../node_modules/bootstrap/js/src/modal.js"
import ImageView from "../../widgets/ImageView.vue"
import SocialLinks from "../../widgets/SocialLinks.vue"
import InfoItem from "../info/partials/InfoItem.vue"

/**
 * @property {Object} project
 */
const props = defineProps({
    project: Object
})

/**
 * @const
 * @type {string}
 */
const UNIQUE_ID = 'contactModal'

/**
 * @type {Modal|null}
 */
let bsModal = null

/**
 * @public
 */
const display = () => {
    if(!bsModal) {
        return
    }

    bsModal.show()
}

/**
 * @private
 */
onMounted(() => {
    const elModal = document.getElementById(UNIQUE_ID)
    if(elModal) {
        bsModal = new Modal(elModal, {})
    }
})

defineExpose({
    display
})
</script>

<style lang="scss" scoped>
@import "/src/scss/_theming.scss";

.modal-content {
    background-color: $light-1;
}

.close-button {
    position: absolute;
    right: 20px;
    top: 10px;

    z-index: 99;
    padding: 0;
    margin: 0;
    font-size: 1.7rem;

    background-color: transparent;
    border-color: transparent;
    color:$light-4;

    &:hover {
        color: $primary;
    }
}

.modal-subsection {
    @include generate-dynamic-styles-with-hash((
        xxxl: (margin-top: 35px),
        lg:   (margin-top: 30px),
        sm:   (margin-top: 25px)
    ))
}

.logo {
    @include generate-dynamic-styles-with-hash((
        xxxl: (max-width: 100%),
        lg:   (max-width: max(150px, min(20vw, 100%)), margin-bottom: 80px),
        sm:   (max-width: max(130px, 30vw))
    ));

    margin: auto;
    width: 100%;
    aspect-ratio: 1/1;
}

.subcategory-col {
    &:not(:last-child) {
        @include generate-dynamic-styles-with-hash((
            xxxl: (margin-bottom: 2.75rem),
            xl:   (margin-bottom: 1.5rem)
        ));
    }
}

.info-row {
    overflow-x:hidden;
}
</style>