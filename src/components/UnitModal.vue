<template>
    <div v-if="visible" class="modal">
        <div class="modal-content">
            <span class="close" @click="close">&times;</span>
            <h2>{{ unit.id ? 'Edit' : 'Add' }} Unit</h2>
            <form @submit.prevent="submit">
                <div>
                    <label for="name">Name</label>
                    <input type="text" v-model="localUnit.name" id="name" required />
                </div>
                <div>
                    <label for="description">Description</label>
                    <textarea v-model="localUnit.description" id="description" required></textarea>
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
                <button type="submit">{{ unit.id ? 'Save' : 'Add' }} Unit</button>
            </form>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            unit: {
                type: Object,
                default: () => ({
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
                    }
                })
            }
        },
        data() {
            return {
                visible: false,
                localUnit: this.getInitialUnit(),
            };
        },
        watch: {
            unit: {
                immediate: true,
                handler(newVal) {
                    this.localUnit = { ...this.getInitialUnit(), ...newVal };
                },
            },
        },
        methods: {
            getInitialUnit() {
                return {
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
                    }
                };
            },
            open() {
                this.visible = true;
            },
            close() {
                this.visible = false;
                this.$emit('close');
            },
            submit() {
                this.$emit('save', this.localUnit);
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