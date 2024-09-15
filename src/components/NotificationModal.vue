<template>
    <div class="modal" v-if="notification">
        <div class="modal-content">
            <span class="close" @click="$emit('close')">&times;</span>
            <h2>{{ notification.title }}</h2>
            <p>{{ notification.message }}</p>
            <p><strong>Date:</strong> {{ formatDate(notification.createdAt) }}</p>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            notification: Object
        },
        methods: {
            formatDate(date) {
                return new Date(date).toLocaleString('pt-BR', { timeZone: 'UTC', hour12: false })
            }
        }
    }
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background: white;
        padding: 20px;
        border-radius: 5px;
        width: 80%;
        max-width: 600px;
        position: relative;
        font-family: sans-serif;
    }

    .close {
        position: absolute;
        top: 5px;
        right: 10px;
        font-size: 24px;
        cursor: pointer;
    }
</style>