<template>
    <div>
        <Topnav />
        <div class="mx-5 mt-5">
            <div class="d-flex align-items-center">
                <h1>Gestión de personal</h1>
                <button v-b-modal.modal-1 class="btn btn-success ml-auto">Añadir</button>
                <button v-b-modal.modal-5 class="btn btn-danger ml-auto">Exportar PDF</button>
                <button v-b-modal.modal-3 class="btn btn-success ml-auto">Ingresar Excel</button>
            </div>
            <hr>
            <b-table striped hover :items="people" :fields="fields" id="peoplegetall" >
                <template #cell(actions)="data">
                    <button class="btn btn-warning" @click="findPerson(data.item.id)" v-b-modal.modal-2>Editar</button>
                    <button class="btn btn-danger mx-2" @click="findPerson(data.item.id)" v-b-modal.modal-4>Eliminar</button>
                </template>
            </b-table>
        </div>
        <AddModal @findAll="findAll"/>
        <UpdateModal :personSelected="person" @findAll="findAll"/>
        <DeleteModal :personSelected="person" @findAll="findAll" />
        <CreatePdfModal @findAll="findAll" />
        <ImportExcelModal @findAll="findAll" />
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Topnav from '../../../../components/Top-Nav.vue';
import AddModal from './AddPerson.modal.vue';
import UpdateModal from './UpdatePerson.modal.vue';
import DeleteModal from './DeletePerson.modal.vue';
import CreatePdfModal from './CreatePdf.modal.vue';
import ImportExcelModal from './ImportExcel.modal.vue';
import { PersonController } from '../people.controller';
import { Person } from '../../entities/person';

export default Vue.extend({
    name: 'PeopleView',
    components: {
        Topnav, AddModal, UpdateModal,DeleteModal,CreatePdfModal,ImportExcelModal
    },
    data() {
        return {
            fields: [
                {key: 'name', label: 'Nombre', sortable: true,},
                {key: 'surname',label: 'Apellido M',sortable: true},
                {key: 'lastname',label:'Apellido P',sortable: true},
                {key: 'actions', label: 'Acciones'}
            ],
            people: [] as Person[],
            person: {} as Person
        }
    },
    methods: {
        async findAll() {
            const controller = new PersonController();
            const response = await controller.findAllPeople();
            this.people = response.entities!;
        },
        async findPerson(payload: number) {
            const controller = new PersonController();
            const response = await controller.findPerson(payload);
            this.person = response.entity!;
        }
    },
    mounted () {
        this.findAll();
    } 
});
</script>