<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <div>
                <router-link to="/inscription" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>
            <form @submit.prevent="updateInscription" class="p-4 shadow-sm rounded">
                <h2 class="text-center mb-4">Modifier l'inscription</h2>

                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="studentId" class="form-label">Étudiant</label>
                        <select v-model="studentId" class="form-control" required>
                            <option v-for="student in students" :key="student.id" :value="student.id">
                                {{ student.full_name }}
                            </option>
                        </select>
                        <small v-if="errors.full_name" class="text-danger">{{ errors.full_name }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="moduleId" class="form-label">Module</label>
                        <select v-model="moduleId" class="form-control" required>
                            <option v-for="module in modules" :key="module.id" :value="module.id">
                                {{ module.name }}
                            </option>
                        </select>
                        <small v-if="errors.name" class="text-danger">{{ errors.name }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="amount" class="form-label">Montant</label>
                        <input type="number" v-model="amount" class="form-control" required />
                        <small v-if="errors.amount" class="text-danger">{{ errors.amount }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="registration_date" class="form-label">Date d'inscription</label>
                        <input type="date" v-model="registration_date" class="form-control" required />
                        <small v-if="errors.registration_date" class="text-danger">{{ errors.registration_date
                            }}</small>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="start_date" class="form-label">Date de début</label>
                        <input type="date" v-model="start_date" class="form-control" required />
                        <small v-if="errors.start_date" class="text-danger">{{ errors.start_date }}</small>
                    </div>

                </div>

                <button type="submit" class="btn w-100 py-2">Mettre à jour l'inscription</button>
            </form>
        </div>
    </div>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRegistrationStore } from '@/stores/inscriptionStore';
import { useModuleStore } from '@/stores/moduleStore';
import { useApprenantStore } from '@/stores/apprenantStore';
import { useToast } from 'vue-toastification';
import { useRouter, useRoute } from "vue-router";

const toast = useToast();
const router = useRouter();
const route = useRoute();
const registrationStore = useRegistrationStore();
const moduleStore = useModuleStore();
const apprenantStore = useApprenantStore();

const registration_date = ref('');
const start_date = ref('');
const amount = ref(0);
const studentId = ref(null);
const moduleId = ref(null);
const errors = ref({});

const students = ref([]);
const modules = ref([]);
const registrationId = ref(null);

onMounted(async () => {
    try {
        await apprenantStore.loadApprenantData();
        students.value = apprenantStore.apprenants;
        await moduleStore.loadModuleData();
        modules.value = moduleStore.modules;

        registrationId.value = route.params.id;

        const registration = await registrationStore.loadRegistrationById(registrationId.value);
        console.log(registration);

        if (registration) {
            studentId.value = registration.studentId;
            moduleId.value = registration.moduleId;
            amount.value = parseFloat(registration.amount);
            registration_date.value = registration.registration_date.slice(0, 10);
            start_date.value = registration.start_date.slice(0, 10);
        }
    } catch (error) {
        toast.error("Erreur lors du chargement des données.");
        console.error("Erreur de chargement:", error);
    }
});


watch(moduleId, (newModuleId) => {
    const selectedModule = modules.value.find(module => module.id === newModuleId);
    if (selectedModule) {
        amount.value = selectedModule.price;
    }
});

const updateInscription = async () => {
    errors.value = {};
    try {
        await registrationStore.updateRegistration(registrationId.value, {
            registration_date: registration_date.value,
            start_date: start_date.value,
            amount: parseFloat(amount.value),
            studentId: studentId.value,
            moduleId: moduleId.value,
        });
        toast.success('Inscription mise à jour avec succès !');
        router.push("/inscription");
    } catch (error) {
        if (error.response && error.response.data && error.response.data.errors) {
            error.response.data.errors.forEach(err => {
                errors.value[err.path] = err.msg;
            });
        } else {
            toast.error('Une erreur est survenue lors de la mise à jour de l\'inscription.');
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
