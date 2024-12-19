<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <div class="">
                <router-link to="/modules" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>
            <form @submit.prevent="updateModule" class="p-4 shadow-sm rounded">
                <h2 class="text-center mb-4">Modifier un module</h2>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="name" class="form-label">Nom du module</label>
                        <input type="text" v-model="form.name" class="form-control"
                            placeholder="Entrez le nom du module" required />
                        <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="duration" class="form-label">Durée</label>
                        <input type="text" v-model="form.duration" class="form-control"
                            placeholder="Entrez la durée du module" required />
                        <small v-if="errors.duration" class="text-danger">{{ errors.duration }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="price" class="form-label">Prix</label>
                        <input type="number" v-model="form.price" class="form-control"
                            placeholder="Entrez le prix du module" required />
                        <small v-if="errors.price" class="text-danger">{{ errors.price }}</small>
                    </div>
                </div>

                <button type="submit" class="btn w-100 py-2">Modifier le module</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useModuleStore } from '@/stores/moduleStore';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const form = ref({});

const errors = ref({});

const moduleStore = useModuleStore();

onMounted(async () => {
    const moduleId = route.params.id;
    form.value = await moduleStore.loadModuleById(moduleId);
    console.log(form.value);
});

const updateModule = async () => {
    errors.value = {};
    try {
        const moduleId = route.params.id;
        await moduleStore.updateModule(moduleId, {
            name: form.value.name,
            duration: parseInt(form.value.duration),
            price: parseFloat(form.value.price)
        });
        toast.success('Module modifié avec succès !');
        router.push("/modules");
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                errors.value[err.path] = err.msg;
            });
        } else {
            toast.error('Une erreur est survenue lors de la modification du module.');
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
