<template>
    <div class="management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des Paiements</h2>
            <router-link class="btn btn-success create" to="/payment/new">
                <i class="fas fa-plus-circle"></i> Ajouter un paiement
            </router-link>
        </div>

        <table class="tableau">
            <thead>
                <tr>
                    <th>Date de Paiement</th>
                    <th>Montant Payé</th>
                    <th>Montant Restant</th>
                    <th>Payeur</th>
                    <th>Numéro Télephone</th>
                    <th>Apprenant</th>
                    <th>Module</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="payment in store.payments" :key="payment.id">
                    <td>{{ formatDate(payment.payment_date) }}</td>
                    <td>{{ payment.amount }}</td>
                    <td>{{ payment.paid_amount }}</td>
                    <td>{{ payment.payer }}</td>
                    <td>{{ payment.payer_number }}</td>
                    <td>{{ payment.student_name }}</td>
                    <td>{{ payment.module_name }}</td>
                    <td class="actions">
                        <button class="action-btn" @click="showModal(payment.id)">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="action-btn" @click="destroy(payment.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isModalVisible" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <span class="close" @click="closeModal">&times;</span>
                <h3>Détails du Paiement</h3>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Apprenant</label>
                        <p class="form-control">{{ selectedPayment.student_name }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Module</label>
                        <p class="form-control">{{ selectedPayment.module_name }}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Date de Paiement</label>
                        <p class="form-control">{{ formatDate(selectedPayment.payment_date)
                            }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Date d'Inscription </label>
                        <p class="form-control">{{ formatDate(selectedPayment.registration_date)
                            }}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Payeur</label>
                        <p class="form-control">{{ selectedPayment.payer
                            }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Numéro de téléphone</label>
                        <p class="form-control">{{ selectedPayment.payer_number }}</p>
                    </div>
                </div>
                <div class="row">
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Montant Payé</label>
                        <p class="form-control">{{ selectedPayment.amount }}</p>
                    </div>
                    <div class="col-md-6 mb-3">
                        <label for="app" class="form-label">Montant Restant</label>
                        <p class="form-control">{{ selectedPayment.paid_amount }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import Loading from 'vue-loading-overlay';
import 'vue-loading-overlay/dist/css/index.css';
import { usePaymentStore } from '@/stores/paymentStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const store = usePaymentStore();
const toast = useToast();
const isLoading = ref(false);
const isModalVisible = ref(false);
const selectedPayment = ref(null);

onMounted(async () => {
    isLoading.value = true;
    try {
        await store.loadDataFromApi();
    } finally {
        isLoading.value = false;
    }
});

const showModal = async (id) => {
    isLoading.value = false;
    try {
        selectedPayment.value = await store.getPaymentById(id);
        isModalVisible.value = true
    } catch (error) {
        toast.error(`${error}`);
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    isModalVisible.value = false;
};


const destroy = async (id) => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer cette inscription ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui, supprimer',
        cancelButtonText: 'Annuler'
    });
    if (result.isConfirmed) {
        isLoading.value = true;
        try {
            const resp = await store.destroy(id);
            toast.success(`${resp}`);
        } catch (error) {
            toast.error(`${error}`);
        } finally {
            isLoading.value = false;
        }
    }
};

const formatDate = (date) => {
    return new Date(date).toLocaleDateString('fr-FR');
};
</script>

<style scoped>
.management {
    margin: 0 auto;
    max-width: 1200px;
    padding: 10px;
}

.top-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 0;
    margin-top: 20px;
}

h2 {
    font-size: 28px;
    color: #4a4a4a;
    font-weight: 600;
}

.create {
    color: white;
    border-radius: 5px;
    padding: 10px 15px;
    text-decoration: none;
    display: flex;
    align-items: center;
}

.create i {
    margin-right: 8px;
}

.tableau {
    width: 100%;
    margin-top: 20px;
    border-collapse: collapse;
    background-color: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.tableau th,
.tableau td {
    padding: 15px 20px;
    text-align: left;
}

.tableau th {
    background-color: #cccccc;
    color: #000;
    font-weight: bold;
}

.tableau td {
    border-bottom: 1px solid #e3e3e3;
    color: #333;
}

.tableau tbody tr:hover {
    background-color: #f1f1f1;
}

.actions {
    text-align: center;
    display: flex;
}

.action-btn {
    background-color: transparent;
    border: none;
    margin-right: 5px;
    cursor: pointer;
}

.action-btn i {
    color: #6c757d;
    font-size: 15px;
}

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
    z-index: 1000;
    transition: opacity 0.3s ease-in-out;
}

.modal-content {
    background-color: white;
    padding: 30px;
    border-radius: 10px;
    width: 500px;
    max-width: 90%;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
}

.modal-content h3 {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
    font-weight: bold;
    text-align: center;
}

.close {
    position: absolute;
    top: 10px;
    right: 10px;
    font-size: 28px;
    cursor: pointer;
    color: #999;
    transition: color 0.3s;
}

.close:hover {
    color: #333;
}

.form-label {
    font-size: 16px;
    color: #555;
    font-weight: 500;
    margin-bottom: 5px;
}

.form-control {
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #f9f9f9;
    transition: border-color 0.3s;
}

.form-control:focus {
    border-color: #1abc9c;
    outline: none;
}

.form-control[readonly] {
    background-color: #e9ecef;
    cursor: not-allowed;
}

.modal-content p {
    font-size: 16px;
    color: #333;
    margin-bottom: 10px;
}

.modal-content p strong {
    color: #1abc9c;
}
</style>