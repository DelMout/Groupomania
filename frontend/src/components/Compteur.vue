<template>
   <div>
        <h1>Mon super compteur</h1>
         <p @click="increment">Tu as cliqué {{ total }} fois.</p>
         <p>Total from Vuex est : {{ totalGeneral }}.</p>
         <p>Double du Total from Vuex est : {{ double }}.</p>
    </div>
</template>

<script>
export default {
    name:'Compteur',
    data(){
        return{
            total:0
        }
    },
    methods:{
        increment(){
            this.total+=1;
            this.$store.commit('setTotalFromVuex',this.totalGeneral+=1)
        }
    },
    computed:{
        totalGeneral(){
            return this.$store.state.totalFromVuex;
        },
        double(){
            return this.$store.getters.doubleDuTotal;
        }
    }
}
</script>

<style scoped>

</style>
