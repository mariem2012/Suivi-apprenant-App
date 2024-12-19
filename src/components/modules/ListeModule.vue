<template>
    <div class="management">
        <loading :active.sync="isLoading" :can-cancel="false" color="#1abc9c"
            background-color="rgba(255, 255, 255, 0.8)" />

        <div class="top-bar">
            <h2>Liste des modules</h2>
            <router-link class="btn btn-success module" to="/module/ajouter">
                <i class="fas fa-plus-circle"></i> Ajouter un module
            </router-link>
        </div>

        <table class="tableau">
            <thead>
                <tr>
                    <th>Nom</th>
                    <th>Durée</th>
                    <th>Prix</th>
                    <th class="text-center">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="module in modules" :key="module.id">
                    <td>{{ module.name }}</td>
                    <td>{{ module.duration }}</td>
                    <td>{{ module.price }}</td>
                    <td class="actions">
                        <button class="action-btn" @click="viewModuleDetails(module.id)">
                            <i class="fas fa-eye"></i>
                        </button>

                        <router-link :to="`/module/modifier/${module.id}`" class="action-btn">
                            <i class="fas fa-edit"></i>
                        </router-link>
                        <button class="action-btn" @click="confirmRemoveModule(module.id)">
                            <i class="fas fa-trash"></i>
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>

        <div v-if="isModalVisible" class="modal" @click="closeModal">
            <div class="modal-content" @click.stop>
                <span class="close" @click="closeModal">&times;</span>
                <h3>Détails du module</h3>
                <div v-if="selectedModule">
                    <div class="mb-3">
                        <label for="module_name" class="form-label">Nom</label>
                        <input type="text" id="module_name" v-model="selectedModule.name" class="form-control"
                            readonly />
                    </div>
                    <div class="mb-3">
                        <label for="module_duration" class="form-label">Durée</label>
                        <input type="text" id="module_duration" v-model="selectedModule.duration" class="form-control"
                            readonly />
                    </div>
                    <div class="mb-3">
                        <label for="module_price" class="form-label">Prix</label>
                        <input type="text" id="module_price" v-model="selectedModule.price" class="form-control"
                            readonly />
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
import { useModuleStore } from '@/stores/moduleStore';
import { useToast } from 'vue-toastification';
import Swal from 'sweetalert2';

const moduleStore = useModuleStore();
const toast = useToast();
const modules = ref([]);
const isLoading = ref(false);
const isModalVisible = ref(false);
const selectedModule = ref(null);

onMounted(async () => {
    isLoading.value = true;
    try {
        await moduleStore.loadModuleData();
        modules.value = moduleStore.modules;
    } catch (error) {
        console.error("Erreur lors du chargement des modules:", error);
        toast.error("Une erreur est survenue lors du chargement des modules.");
    } finally {
        isLoading.value = false;
    }
});

const viewModuleDetails = async (id) => {
    isLoading.value = true;
    try {
        selectedModule.value = await moduleStore.loadModuleById(id);
        isModalVisible.value = true;
    } catch (error) {
        console.error("Erreur lors du chargement des détails du module :", error);
        toast.error("Une erreur est survenue lors du chargement des détails du module.");
    } finally {
        isLoading.value = false;
    }
};

const closeModal = () => {
    isModalVisible.value = false;
};

const confirmRemoveModule = async (id) => {
    const result = await Swal.fire({
        title: 'Êtes-vous sûr ?',
        text: 'Voulez-vous vraiment supprimer ce module ?',
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
            await moduleStore.removeModule(id);
            toast.success('Module supprimé avec succès !');
            await moduleStore.loadModuleData();
            modules.value = moduleStore.modules;
        } catch (error) {
            console.error("Erreur lors de la suppression du module:", error.message);
            toast.error('Une erreur est survenue lors de la suppression.');
        } finally {
            isLoading.value = false;
        }
    }
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
    padding: 20px;
    border-radius: 8px;
    width: 400px;
    max-width: 90%;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
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
    font-size: 24px;
    cursor: pointer;
    color: #999;
    transition: color 0.3s;
}

.close:hover {
    color: #333;
}

.mb-3 {
    margin-bottom: 15px;
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
    width: 100%;
    padding: 10px;
    font-size: 16px;
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
</style>
