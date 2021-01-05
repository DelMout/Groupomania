<template>
    <div id="sign"> 
        <h1>Merci de renseigner le formulaire ci-dessous</h1>
        <h2>Ton prénom : {{ prenom }}</h2>
        <p>Prénom : <input type="text" v-model="prenom"/></p>
        <p>Nom : <input type="text" v-model="nom"/></p>
        <p>Email : <input type="text" v-model="email"/></p>
        <p>Service : <input type="text" v-model="service"/></p>
    </div>
</template>

<script>
export default {
	name: "Signup",
	data() {
		return {
			prenom: this.$store.state.savePrenom,
		}
	}
}
//  const sign = new Vue({
//           el: '#sign',
//           data: {
//             prenom:'Jean',
//             // nom:'Martin',
//             // email:'nom@groupomania.fr',
//             // description:'',
//             // service:'Informatique',
// }
//  })
</script>