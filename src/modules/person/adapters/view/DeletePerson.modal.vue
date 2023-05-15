<template>
    <div>
        <b-modal id="modal-4"  centered hide-footer hide-header title="BootstrapVue">
            {{personSelected}}
            <div class="text-center">
                <h3>Eliminar Persona</h3>
                <h5>Seguro de Eliminar al usuario?</h5>
                <img src="" >
            </div>
            <div class="text-center">
                <button class="btn btn-secondary mr-2" @click="$bvModal.hide('modal-4')">Cerrar</button>
                <button class="btn btn-primary" @click="deleteP()">Aceptar</button>
            </div>
        </b-modal>
    </div>
</template>


<script lang='ts' >
import Vue from 'vue';
import { PersonController } from '../people.controller';

export default Vue.extend({
    name: 'DeletePersonModal',
    props:{
        personSelected:{
            type: Object,
            required: true
        }
    },
    methods: {
        async deleteP() {
            const controller = new PersonController();
            const response = await controller.deletePerson(this.personSelected.id);

            this.$bvModal.hide("modal-4");
            this.$emit("findAll");
        }
    }
})


</script>