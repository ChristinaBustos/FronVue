<template>
     <div>
        <b-modal id="modal-3" hide-footer hide-header centered>
            <div class="row">
                <div class="col-md-12">
                    <header class="text-center">
                        <h3>Importar archivo</h3>
                    </header>
                    <main class="mt-4">
                        <input type="file" ref="file" class="form-control" id="file" accept=".xlsx" @change="handleFileUpload()" >
                        <div class="row" v-if="excelData.length > 0">
                            <div class="col-md-12">
                                <section class="mt-4 card">
                                    <b-table 
                                        striped hover 
                                        :fields="selectedColums" 
                                        :items="excelData" 
                                        :per-page="5" 
                                        :current-page="currentPage"
                                        >
                                    </b-table>
                                    <b-pagination
                                        v-model="currentPage"
                                        :total-rows="excelData.length"
                                        :per-page="5"
                                        aria-controls="my-table"
                                    ></b-pagination>  
                                </section>
                                <section class="mt-4 text-end">
                                    <button class="btn btn-success m-1" @click="savePeople" >Guardar</button>
                                </section>
                            </div>
                        </div>
                    </main>
                    <footer class="text-star mt-4">
                        <button class="btn btn-danger m-1" @click="close">Cancelar</button>
                    </footer>
                </div>
            </div>
        </b-modal> 
    </div>
</template>

<script lang="ts" >
    import Vue from 'vue'
    import readXlsxFile from 'read-excel-file'
    import { PersonController } from '../people.controller';
    import { SavePersonDto } from '../dto/save-person';

    export default Vue.extend({
        name:'ImportExcelModal',
        data() {
            return {
                excelData: [] as any[],
                selectedColums:['Nombre','Apellido1','Apellido2'],
                currentPage:1
            }
        },
        methods:{
            nextPage(){
                this.currentPage++
            },
            close() {
                this.excelData = [],
                this.$bvModal.hide('modal-3')
            },
            async savePeople(){
                const peopleController = new PersonController()

                for(let index = 0; index < this.excelData.length; index ++){
                    const element = this.excelData[index];

                    const person:SavePersonDto = {
                        name: element.Nombre,
                        surname: element.Apellido1,
                        lastname: element.Apellido2
                    }

                    await peopleController.save(person)

                }
                this.close()
                this.$emit("findall")
            },
            handleFileUpload(){
                const file = (this.$refs.file as HTMLInputElement).files![0];

                readXlsxFile(file).then((rows)=>{
                    const header = rows[0]
                    const body = rows.slice(1)

                    const selectedColumns = this.selectedColums.map((colum)=> header.indexOf(colum))
                    const jsonData = body.map((item)=>{
                        const data : any = {}
                        var i = 0
                        selectedColumns.forEach((index)=>{
                            data[this.selectedColums[i]] = item[index]
                            i++
                        })
                        return data
                    })
                    console.table(jsonData)
                    this.excelData = jsonData
                })

            }
        }
    })

</script>