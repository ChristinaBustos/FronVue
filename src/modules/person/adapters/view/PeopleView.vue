<template>
    <div>
        <Topnav />
        <div class="mx-5 mt-5">
            <div class="text-center">
                <h1>Gestión de Usuarios</h1>
                <button v-b-modal.modal-1 class="btn btn-secondary ml-auto mx-2">Añadir</button>
                <button class="btn btn-danger m-1" @click="generatePdf">Exportar PDF</button>
                <button  class="btn btn-info ml-auto mx-2" @click="generateExcel" >Exportar Excel</button>
                <button v-b-modal.modal-3 class="btn btn-success ml-auto mx-2">Ingresar Excel</button>
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
        <ImportExcelModal @findAll="findAll" />
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import Topnav from '../../../../components/Top-Nav.vue';
import AddModal from './AddPerson.modal.vue';
import UpdateModal from './UpdatePerson.modal.vue';
import DeleteModal from './DeletePerson.modal.vue';
import ImportExcelModal from './ImportExcel.modal.vue';
import { PersonController } from '../people.controller';
import { Person } from '../../entities/person';
import * as XLSX from 'xlsx';
import pdfMake from 'pdfmake/build/pdfmake.js';
import pdfFonts from 'pdfmake/build/vfs_fonts.js';
import { SavePersonDto } from '../dto/save-person';
pdfMake.vfs = pdfFonts.pdfMake.vfs;


export default Vue.extend({
    name: 'PeopleView',
    components: {
        Topnav, AddModal, UpdateModal,DeleteModal,ImportExcelModal
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
            person: {} as Person,
            document: null as any
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
        },
        generatePdf() {
            this.document = {
                content: [
                    {
                        style: "tableExample",
                        table: {
                            widths: [
                                '*', '*', '*', '*'
                            ],
                            body: [["Nombre", "Apellido Materno", "Apellido Paterno"]],
                        },
                    },
                ],
                styles: {
                    tableExample: {
                        margin: [0, 5, 0, 15],
                    }
                }
            }
            for (let index = 0; index < this.people.length; index++) {
                const element = this.people[index];

                const person: SavePersonDto = {
                    name: element.name,
                    surname: element.surname,
                    lastname: element.lastname,
                }
                this.document.content[0].table.body.push([
                    { text: `${person.name}` },
                    { text: `${person.surname}` },
                    { text: `${person.lastname}` },
                ]);
            }
            console.table(this.document)

            pdfMake.createPdf(this.document).download(`Reporte_${(new Date()).toString().replace(' ', '-')}`)
            this.document = null
        },
        generateExcel() {
            const aoa = [] as any
            this.people.map((person) => {
                aoa.push([`${person.name}`, `${person.surname}`, `${person.lastname}`])
            })
            const worksheet = XLSX.utils.aoa_to_sheet(aoa);
            XLSX.utils.sheet_add_aoa(worksheet, [["Nombre", "Apellido 1", "Apellido 2"]], { origin: "A1" });
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Libro1");
            const excelBuffer = XLSX.write(workbook, {
                type: "buffer",
                bookType: "xlsx",
            });
            const blob = new Blob([excelBuffer], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            });

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Reporte_${(new Date()).toString().replace(' ','-')}.xlsx`;
            link.click();

            URL.revokeObjectURL(url)
        }
    },
    mounted() {
        this.findAll();
    }
});
</script>