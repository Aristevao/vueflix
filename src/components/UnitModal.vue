<template>
    <div class="modal-overlay" v-if="isVisible" @click.self="close">
        <div class="modal">
            <div class="modal-header">
                <h2>{{ unit.name }}</h2>
                <button @click="close" class="close-button">×</button>
            </div>
            <div class="modal-body">
                <div class="unit-info">
                    <img :src="unit.picture || defaultImage" class="unit-image" />
                    <p>{{ unit.description }}</p>
                    <button @click="toggleAddress" class="toggle-address-button">
                        {{ showAddress ? 'Hide Address' : 'Show Address' }}
                    </button>
                    <div v-if="showAddress" class="address-info">
                        <p><strong>Street:</strong> {{ unit.address.street }}</p>
                        <p><strong>Number:</strong> {{ unit.address.number }}</p>
                        <p><strong>District:</strong> {{ unit.address.district }}</p>
                        <p><strong>Complement:</strong> {{ unit.address.complement }}</p>
                        <p><strong>Zipcode:</strong> {{ unit.address.zipcode }}</p>
                        <p><strong>City:</strong> {{ unit.address.city }}</p>
                        <p><strong>State:</strong> {{ unit.address.state }}</p>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button @click="close" class="cancel-button">Close</button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            unit: {
                type: Object,
                required: true,
            },
        },
        data() {
            return {
                isVisible: false,
                showAddress: false,
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
            toggleAddress() {
                this.showAddress = !this.showAddress;
            },
        },
    };
</script>

<style scoped>
    .modal-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .modal {
        background: white;
        border-radius: 10px;
        overflow: hidden;
        width: 500px;
        max-width: 100%;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
    }

    .modal-header {
        padding: 15px;
        border-bottom: 1px solid #ddd;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .modal-header h2 {
        margin: 0;
    }

    .close-button {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
    }

    .modal-body {
        padding: 15px;
    }

    .unit-info {
        text-align: center;
    }

    .unit-image {
        max-width: 25%;
        height: auto;
        border-radius: 17px;
    }

    .toggle-address-button {
        margin-top: 10px;
        background-color: #007bff;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
    }

    .toggle-address-button:hover {
        background-color: #0056b3;
    }

    .address-info {
        margin-top: 15px;
        text-align: left;
    }

    .modal-footer {
        padding: 15px;
        border-top: 1px solid #ddd;
        display: flex;
        justify-content: flex-end;
    }

    .cancel-button {
        background-color: #6c757d;
        color: white;
        border: none;
        padding: 10px 15px;
        border-radius: 5px;
        cursor: pointer;
    }

    .cancel-button:hover {
        background-color: #5a6268;
    }
</style>