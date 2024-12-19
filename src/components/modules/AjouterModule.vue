<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <div class="">
                <router-link to="/modules" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>
            <form @submit.prevent="addModule" class="p-4 shadow-sm rounded">
                <h2 class="text-center mb-4">Ajouter un module</h2>

                <div class="row">
                    <div class="mb-3">
                        <label for="name" class="form-label">Nom du module</label>
                        <input type="text" v-model="name" class="form-control" placeholder="Entrez le nom du module"
                            required />
                        <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="duration" class="form-label">Durée</label>
                        <input type="number" v-model="duration" class="form-control"
                            placeholder="Entrez la durée du module" required />
                        <small v-if="errors.duration" class="text-danger">{{ errors.duration }}</small>
                    </div>
                    <div class="mb-3">
                        <label for="price" class="form-label">Prix</label>
                        <input type="number" v-model="price" class="form-control" placeholder="Entrez le prix du module"
                            required />
                        <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
                    </div>
                </div>

                <button type="submit" class="btn w-100 py-2">Ajouter</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useModuleStore } from '@/stores/moduleStore';
import { useToast } from 'vue-toastification';
import { useRouter } from "vue-router";

const toast = useToast();
const router = useRouter();

const name = ref('');
const duration = ref('');
const price = ref('');
const errors = ref({});

const moduleStore = useModuleStore();

const addModule = async () => {
    errors.value = {};
    try {

        await moduleStore.addModule({
            name: name.value,
            duration: parseInt(duration.value),
            price: parseFloat(price.value)
        });
        toast.success('Module ajouté avec succès !');
        router.push("/modules");
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                errors.value[err.path] = err.msg;
            });
        } else {
            toast.error('Une erreur est survenue lors de l\'ajout du module.');
        }
    }
};
</script>

<style scoped>
.form-container {
    max-width: 800px;
    margin: 20px auto;
    padding: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.form-content {
    flex: 1;
    background-color: #f9f9f9;
}

.form-control {
    padding: 10px 15px;
    border-radius: 5px;
    border: 1px solid #ced4da;
    transition: border-color 0.3s ease;
}

.form-control:focus {
    border-color: #007bff;
    box-shadow: none;
}

.btn {
    background-color: #1abc9c;
    color: white;
    font-size: 16px;
    font-weight: 600;
}

.btn:hover {
    background-color: #1abc9c;
}

h2 {
    color: #343a40;
    font-weight: bold;
}

.shadow-sm {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.bg-white {
    background-color: white;
}

.rounded {
    border-radius: 8px;
}
</style>
