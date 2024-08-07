<template>
    <div v-if="visible" class="modal">
        <div class="modal-content">
            <span class="close" @click="close">&times;</span>
            <h2>{{ localUnit.id ? 'Edit' : 'Add' }} Unit</h2>
            <form @submit.prevent="submit">
                <div>
                    <label for="name">Name</label>
                    <input type="text" v-model="localUnit.name" id="name" required maxlength="100" />
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea v-model="localUnit.description" id="description" maxlength="500"></textarea>
                </div>
                <div>
                    <label for="street">Street</label>
                    <input type="text" v-model="localUnit.address.street" id="street" required />
                </div>
                <div>
                    <label for="number">Number</label>
                    <input type="text" v-model="localUnit.address.number" id="number" required />
                </div>
                <div>
                    <label for="district">District</label>
                    <input type="text" v-model="localUnit.address.district" id="district" required />
                </div>
                <div>
                    <label for="complement">Complement</label>
                    <input type="text" v-model="localUnit.address.complement" id="complement" />
                </div>
                <div>
                    <label for="zipcode">Zipcode</label>
                    <input type="text" v-model="localUnit.address.zipcode" id="zipcode" required />
                </div>
                <div>
                    <label for="city">City</label>
                    <input type="text" v-model="localUnit.address.city" id="city" required />
                </div>
                <div>
                    <label for="state">State</label>
                    <input type="text" v-model="localUnit.address.state" id="state" required />
                </div>
                <div>
                    <label for="picture">Picture</label>
                    <input type="file" @change="handleFileUpload" id="picture" />
                </div>
                <button type="submit">{{ localUnit.id ? 'Save' : 'Add' }} Unit</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            unit: {
                type: Object,
                default: null,
            },
        },
        data() {
            return {
                visible: false,
                localUnit: this.getInitialUnit(),
                file: null,
            };
        },
        watch: {
            unit: {
                immediate: true,
                handler(newVal) {
                    this.localUnit = newVal ? { ...this.getInitialUnit(), ...newVal } : this.getInitialUnit();
                },
            },
        },
        methods: {
            getInitialUnit() {
                return {
                    id: null,
                    name: '',
                    description: '',
                    address: {
                        street: '',
                        number: '',
                        district: '',
                        complement: '',
                        zipcode: '',
                        city: '',
                        state: ''
                    },
                    picture: null
                };
            },
            open() {
                this.visible = true;
            },
            close() {
                this.visible = false;
                this.$emit('close');
            },
            handleFileUpload(event) {
                this.file = event.target.files[0];
            },
            submit() {
                const formData = new FormData();
                formData.append('name', this.localUnit.name);
                formData.append('description', this.localUnit.description);
                formData.append('address.street', this.localUnit.address.street);
                formData.append('address.number', this.localUnit.address.number);
                formData.append('address.district', this.localUnit.address.district);
                formData.append('address.complement', this.localUnit.address.complement);
                formData.append('address.zipcode', this.localUnit.address.zipcode);
                formData.append('address.city', this.localUnit.address.city);
                formData.append('address.state', this.localUnit.address.state);
                if (this.file) {
                    formData.append('picture', this.file);
                }

                this.$emit('save', formData);
                this.close();
            },
        },
    };
</script>

<style scoped>
    .modal {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 500px;
        position: relative;
    }

    .close {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
        font-size: 24px;
    }
</style>