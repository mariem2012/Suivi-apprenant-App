<template>
    <div class="form-container d-flex align-items-center">
        <div class="form-content">
            <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
                background-color="rgba(255, 255, 255, 0.8)" />
            <div class="">
                <router-link to="/payment" class="btn btn-secondary">
                    <i class="fas fa-arrow-left"></i>
                </router-link>
            </div>

            <form @submit.prevent="onSubmit" class="p-3 shadow-sm rounded">
                <h2 class="text-center mb-4">Ajouter un paiement</h2>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="app">Apprenant</label>
                        <select class="form-select" v-model="studentId" @change="fetchStudents" required>
                            <option disabled value="">Sélectionnez un apprenant</option>
                            <option v-for="student in store.students" :key="student.id" :value="student.id">
                                {{ student.full_name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="mod">Inscriptions</label>
                        <select class="form-select" v-model="form.registrationId" @change="getAmount" required>
                            <option disabled value="">Sélectionnez l'inscription'</option>
                            <option v-for="register in store.registrations" :key="register.id" :value="register.id">
                                {{ register.module_name }}
                            </option>
                        </select>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="dateDebut">Date de Paiement</label>
                        <input type="date" id="dateDebut" class="form-control" v-model="form.payment_date" required />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="dateFin">Mode de Paiement</label>
                        <input class="form-control" type="text" id="dateFin" v-model="form.payment_mode" required />
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="montant">Montant</label>
                        <input class="form-control" type="number" step="0.01" id="montant" v-model="form.amount"
                            required placeholder="Entrez le montant" />
                    </div>
                    <div class="row">
                        <div class="col-md-6 mb-3">
                            <label for="name">Nom du payeur</label>
                            <input class="form-control" type="text" id="name" v-model="form.payer" required />
                        </div>
                        <div class="col-md-6 mb-3">
                            <label for="paid">Numéro de téléphone</label>
                            <input class="form-control" type="tel" id="paid" v-model="form.payer_number" required />
                        </div>
                    </div>
                </div>
                <button type="submit" class="btn w-100 py-2">Ajouter</button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import { usePaymentStore } from '@/stores/paymentStore';
import { useToast } from 'vue-toastification';
import { useRouter } from 'vue-router';

const store = usePaymentStore()
const toast = useToast();
const router = useRouter();

const form = store.paymentForm
const erreur = ref([])

const studentId = ref(null)
const fetchStudents = async () => {
    store.getStudentRegistrations(studentId.value)
}

const getAmount = async () => {
    store.getAmount(form.registrationId)
}

const isLoading = ref(false);

const onSubmit = async () => {
    isLoading.value = true;
    try {
        const resp = await store.create();
        router.push('/payment').then(() => toast.success(`${resp}`));
    } catch (error) {
        erreur.value = error
    } finally {
        isLoading.value = false;
    }
};

onMounted(async () => {
    store.getStudents();
})
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