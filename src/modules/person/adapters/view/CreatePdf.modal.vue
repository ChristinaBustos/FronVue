<template>
  <div>
    <b-modal id="modal-5" centered hide-footer hide-header title="BootstrapVue">
      <div class="text-center" >
        <h3>Generar PDF</h3>
        <h5>Seguro de Generar el PDF?</h5>
        <img src="" />
      </div>
      <div class="text-center">
        <button
          class="btn btn-secondary mr-2"
          @click="$bvModal.hide('modal-5')"
        >
          Cancelar
        </button>
        <button class="btn btn-primary" @click="createPDF()">Crear</button>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import { PersonController } from "../people.controller";
import { Template, BLANK_PDF,generate  } from '@pdfme/generator';


export default Vue.extend({
  name: "CreatePdfModal",
  methods: {
    async createPDF() {
      console.log('Generando PDF');
      // import { Template, BLANK_PDF } from '@pdfme/ui'; <- Template types and BLANK_PDF can also be imported from @pdfme/ui.
      const template: Template = {
        basePdf: BLANK_PDF,
        schemas: [
          {
            a: {
              type: "text",
              position: { x: 0, y: 0 },
              width: 10,
              height: 10,
            },
            b: {
              type: "text",
              position: { x: 10, y: 10 },
              width: 10,
              height: 10,
            },
            c: {
              type: "text",
              position: { x: 20, y: 20 },
              width: 10,
              height: 10,
            },
          },
        ],
      };
      const inputs = [{ a: 'Holaa', b: 'b1', c: 'c1' }];
      const domContainer = document.getElementById('peoplegetall');
      const pdf = await generate({ template,inputs });
      const blob = new Blob([pdf.buffer], { type: "application/pdf" });
      window.open(URL.createObjectURL(blob));
    },  
  },
});
</script>
