<template>
    <transition name="modal">
        <div v-if="isVisible" class="unit-modal">
            <div class="modal-content">
                <h2>{{ unit ? unit.name : 'Unit Details' }}</h2>
                <form>
                    <div class="form-section">
                        <h3>Unit Details</h3>
                        <label>Name:</label>
                        <input v-model="unit.name" disabled />

                        <label>Street:</label>
                        <input v-model="unit.address.street" disabled />

                        <label>Number:</label>
                        <input v-model="unit.address.number" disabled />

                        <label>District:</label>
                        <input v-model="unit.address.district" disabled />

                        <label>City:</label>
                        <input v-model="unit.address.city" disabled />

                        <label>State:</label>
                        <input v-model="unit.address.state" disabled />

                        <label>Zipcode:</label>
                        <input v-model="unit.address.zipcode" disabled />

                        <label>Description:</label>
                        <textarea v-model="unit.description" disabled></textarea>
                    </div>
                    <div class="form-section">
                        <h3>Profile Picture</h3>
                        <div class="profile-picture">
                            <img :src="unit.picture || defaultImage" alt="Profile Picture" />
                            <button type="button" @click="selectImage">Select image</button>
                        </div>
                    </div>
                    <div class="form-actions">
                        <button type="button" @click="close">Close</button>
                    </div>
                </form>
            </div>
        </div>
    </transition>
</template>

<script>
    export default {
        props: {
            unit: Object,
        },
        data() {
            return {
                isVisible: false,
                defaultImage: 'https://via.placeholder.com/400',
            };
        },
        methods: {
            open() {
                this.isVisible = true;
            },
            close() {
                this.isVisible = false;
                this.$emit('close');
            },
            selectImage() {
                // Implement image selection logic here
            },
        },
    };
</script>

<style scoped>
    .unit-modal {
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
        border-radius: 10px;
        width: 600px;
    }

    .form-section {
        margin-bottom: 20px;
    }

    .form-section h3 {
        margin-bottom: 10px;
    }

    label {
        display: block;
        margin-bottom: 5px;
    }

    input,
    textarea {
        width: 100%;
        padding: 8px;
        margin-bottom: 10px;
    }

    .profile-picture {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .profile-picture img {
        width: 100px;
        height: 100px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .form-actions {
        display: flex;
        justify-content: flex-end;
    }

    .form-actions button {
        padding: 10px 20px;
        margin-left: 10px;
    }
</style>