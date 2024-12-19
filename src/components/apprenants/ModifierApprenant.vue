<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <div class="">
                <router-link to="/apprenants" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>
            <form @submit.prevent="updateApprenant" class="p-4 shadow-sm rounded">
                <h2 class="text-center mb-4">Modifier un apprenant</h2>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="nom" class="form-label">Nom</label>
                        <input type="text" v-model="form.full_name" class="form-control" placeholder="Entrez le nom"
                            required />
                        <small v-if="errors.full_name" class="text-danger">{{ errors.full_name }}</small>
                    </div>

                    <div class="col-md-6 mb-3">
                        <label for="email" class="form-label">Email</label>
                        <input type="email" v-model="form.email" class="form-control" placeholder="Entrez l'email"
                            required />
                        <small v-if="errors.email" class="text-danger">{{ errors.email }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="tuteur" class="form-label">Tuteur/Tutrice</label>
                        <input type="text" v-model="form.tutor" class="form-control" placeholder="Entrez le tuteur"
                            required />
                        <small v-if="errors.tutor" class="text-danger">{{ errors.tutor }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="telephone" class="form-label">Téléphone</label>
                        <input type="text" v-model="form.phone_number" class="form-control"
                            placeholder="Entrez le numéro de téléphone" required />
                        <small v-if="errors.phone_number" class="text-danger">{{ errors.phone_number }}</small>
                    </div>
                </div>

                <div class="row">

                    <div class="col-md-6 mb-3">
                        <label for="adresse" class="form-label">Adresse</label>
                        <input type="text" v-model="form.address" class="form-control" placeholder="Entrez l'adresse"
                            required />
                        <small v-if="errors.address" class="text-danger">{{ errors.address }}</small>
                    </div>

                </div>

                <button type="submit" class="btn w-100 py-2">Modifier l'apprenant</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useApprenantStore } from '@/stores/apprenantStore';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const form = ref({})


const full_name = ref('');
const phone_number = ref('');
const email = ref('');
const address = ref('');
const tutor = ref('');
const errors = ref({});


const apprenantStore = useApprenantStore();


onMounted(async () => {
    const apprenantId = route.params.id;
    form.value = await apprenantStore.loadApprenantById(apprenantId)
});

const updateApprenant = async () => {
    errors.value = {};
    try {
        const apprenantId = route.params.id;
        await apprenantStore.updateApprenant(apprenantId, {
            full_name: form.value.full_name,
            email: form.value.email,
            phone_number: form.value.phone_number,
            address: form.value.address,
            tutor: form.value.tutor
        });
        toast.success('Apprenant modifié avec succès !');
        router.push("/apprenants");
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                errors.value[err.path] = err.msg;
            });
        } else {
            toast.error('Une erreur est survenue lors de la modification.');
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
