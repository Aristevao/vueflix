<template>
    <div class="modal-overlay" v-if="isVisible" @click.self="close">
        <div class="modal">
            <div class="modal-header">
                <h2>Edit Unit</h2>
                <button @click="close" class="close-button">×</button>
            </div>
            <div class="modal-body">
                <div class="unit-info">
                    <img :src="unit.picture || defaultImage" class="unit-image" />
                    <input type="text" v-model="editedUnit.name" placeholder="Unit Name" />
                    <textarea v-model="editedUnit.description" placeholder="Description"></textarea>
                    <button @click="toggleAddress" class="toggle-address-button">
                        {{ showAddress ? 'Hide Address' : 'Show Address' }}
                    </button>
                    <div v-if="showAddress" class="address-info">
                        <input type="text" v-model="editedUnit.address.street" placeholder="Street" />
                        <input type="text" v-model="editedUnit.address.number" placeholder="Number" />
                        <input type="text" v-model="editedUnit.address.district" placeholder="District" />
                        <input type="text" v-model="editedUnit.address.complement" placeholder="Complement" />
                        <input type="text" v-model="editedUnit.address.zipcode" placeholder="Zipcode" />
                        <input type="text" v-model="editedUnit.address.city" placeholder="City" />
                        <input type="text" v-model="editedUnit.address.state" placeholder="State" />
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="submit" @click="saveChanges" class="save-button">Save</button>
                <button @click="close" class="cancel-button">Cancel</button>
            </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        props: {
            unit: {
                type: Object,
                default: () => ({
                    picture: '',
                    name: '',
                    description: '',
                    address: {
                        street: '',
                        number: '',
                        district: '',
                        complement: '',
                        zipcode: '',
                        city: '',
                        state: '',
                    },
                }),
                required: true,
            },
        },
        data() {
            return {
                isVisible: false,
                showAddress: false,
                editedUnit: {},
                defaultImage: 'https://via.placeholder.com/400',
                fazendas: [],  // Initialize fazendas here or receive it via props
                selectedUnit: null, // Initialize selectedUnit here or receive it via props
            };
        },
        watch: {
            unit: {
                immediate: true,
                handler(newVal) {
                    this.editedUnit = { ...newVal };
                },
            },
        },
        methods: {
            open() {
                // this.editedUnit = { ...this.unit }; // Make a copy of the unit to edit
                this.isVisible = true;
            },
            close() {
                this.isVisible = false;
                this.$emit('close');
            },
            toggleAddress() {
                this.showAddress = !this.showAddress;
            },
            saveChanges() {
                const formData = new FormData();
                formData.append('name', this.editedUnit.name);
                formData.append('description', this.editedUnit.description);
                formData.append('address.street', this.editedUnit.address.street);
                formData.append('address.number', this.editedUnit.address.number);
                formData.append('address.district', this.editedUnit.address.district);
                formData.append('address.complement', this.editedUnit.address.complement);
                formData.append('address.zipcode', this.editedUnit.address.zipcode);
                formData.append('address.city', this.editedUnit.address.city);
                formData.append('address.state', this.editedUnit.address.state);

                axios.put(`http://localhost:8080/api/digital-pec/unit/${this.editedUnit.id}`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
                    .then(response => {
                        const index = this.fazendas.findIndex(fazenda => fazenda.id === this.editedUnit.id);
                        if (index !== -1) {
                            this.$set(this.fazendas, index, this.editedUnit);
                        }
                        this.selectedUnit = null;
                    })
                    .catch(error => {
                        console.error('Error saving unit:', error);
                    });
                this.close();
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
