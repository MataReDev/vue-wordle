<template>
    <div id="name" style="text-align: center">
        <h1 style="color:gold">Username to play</h1><br>
        <input id="username" type="text" name="username" v-model="input.surname" placeholder="Username" /><br><br>
        <button type="button" class="btn_name" v-on:click="login()">PLAY</button>
    </div>
</template>


<script>

export default {
    name: 'name',
    data() {
        return {
            input: {
            }
        }
    },
    methods: {
        login() {
            var input = document.getElementById("username").value;
            localStorage.setItem('username', input)
            this.$router.push({ path: "/game" })
        }
    }
}
</script>

<style scoped>
#name {
    width: 500px;
    margin: auto;
    margin-top: 200px;
    padding: 20px;
}
input[type=text] {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    font-size:18px;
    box-sizing: border-box;
    background-color: white;
    -webkit-transition: background-color 500ms linear;
    -ms-transition: background-color 500ms linear;
    transition: background-color 500ms linear;
    border-radius:10px;  
}
input[type=text]:focus {
    width: 100%;
    padding: 12px 20px;
    margin: 8px 0;
    box-sizing: border-box;
    background-color: gold;
    -webkit-transition: background-color 500ms linear;
    -ms-transition: background-color 500ms linear;
    transition: background-color 500ms linear;
}
.btn_name{
    font-weight:bold;
    background-color: gold;
    width: 25%;
    padding: 12px 20px;
    margin: 8px 0;
    border-radius:10px;
    letter-spacing: 1px
}
.btn_name:active{
    background-color: #d4a435;
}
</style>