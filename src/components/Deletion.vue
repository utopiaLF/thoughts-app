<template>
    <div v-if="deletionAlert" class="deleteAlert">
        <div>
            <p>Delete "{{ deleteThought }}" ?</p>

            <span>
                <button @click="$emit('cancelDeletion')">Cancel</button>
                <button @click="$emit('deleteThought')">Delete</button>
            </span>
        </div>
    </div>
</template>

<script>
export default {
    props: ['deletionAlert', 'deleteThought'],
    emits: ['cancelDeletion', 'deleteThought']
}
</script>