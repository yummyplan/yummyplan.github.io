<template>
  <div>
    <h1 class="text-3xl">
      {{ $t(`${translationKey}.title`) }}
    </h1>

    <p class="mb-4">
      {{ $t(`${translationKey}.introduction`) }}
    </p>

    <f-button class="mb-4 create-new-button" @click="createNew">
      <font-awesome-icon :icon="['fas', 'plus']" class="mr-4" />
      {{ $t(`${translationKey}.edit.new`) }}
    </f-button>

    <slot name="searchableList" :editFunction="edit" />

    <f-modal v-if="editingEntity" ref="editModal">
      <div class="flex my-4">
        <h2 class="text-xl flex-1">
          {{ $t(`${translationKey}.edit.modalTitle`) }}
        </h2>

        <div class="flex-0">
          <f-button @click="deleteEntity(editingEntity)">
            <font-awesome-icon :icon="['fas', 'trash']" class="mr-4" />
            {{ $t(`${translationKey}.edit.delete`) }}
          </f-button>
        </div>
      </div>

      <slot name="editModalForm" :editingEntity="editingEntity" />

      <f-button class="w-full mb-2" @click="$refs.editModal.hide()">
        <font-awesome-icon :icon="['fas', 'check']" class="mr-4" />
        {{ $t(`${translationKey}.edit.save`) }}
      </f-button>
    </f-modal>
  </div>
</template>

<script lang="ts">
import { Vue, Component, Provide, Prop } from 'vue-property-decorator'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import FButton from '~/components/FButton.vue'
import FModal from '~/components/Modal/FModal.vue'
import { FModalInterface } from '~/types/modalInterface'

@Component({
  components: { FButton, FModal, FontAwesomeIcon }
})
export default class EditPage<T> extends Vue {
  $refs!: {
    editModal: FModalInterface
  }

  @Prop() readonly createNewEntityFunction!: () => void
  @Prop() readonly deleteEntityFunction!: (entity: T) => void
  @Prop() readonly items!: T[]
  @Prop() readonly translationKey!: string

  @Provide() editingEntity: T | null = null

  /**
   * Created and edit a new entity
   */
  createNew (): void {
    this.createNewEntityFunction()

    this.$nextTick(() => {
      this.editingEntity = this.items[this.items.length - 1]
      this.$nextTick(() => { // Wait until the modal has rendered
        this.$refs.editModal.show()
      })
    })
  }

  /**
   * Marks an entity as being edited and shows the modal
   */
  edit (entity: T): void {
    this.editingEntity = entity
    this.$nextTick(() => {
      this.$refs.editModal.show()
    })
  }

  /**
   * Deletes a single entity and closes the modal
   * @param entity
   */
  deleteEntity (entity: T): void {
    this.$refs.editModal.hide()
    this.deleteEntityFunction(entity)
  }
}
</script>
