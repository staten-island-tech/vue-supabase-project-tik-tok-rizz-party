<!-- be login/signup with a variable to allow changes or maybe can be split into two pages with the path site.url/auth/(signup || login) -->
<!-- be login/signup with a variable to allow changes or maybe can be split into two pages with the-->

<template>
    <div style="background-image: url('../../public/purple\ spike\ thingy.png');">
        <form action="v-model" method="post">
            <label for="username">usr</label>
            <input type="text" id="usr" name="username">
            <label for="password">pass</label>
            <input type="text" id="pass" name="password">
            <input type="submit" value="">
        </form>

    </div>
</template>

<script>
export default {
    setup () {
        return {}
    }
}
</script>

<style lang="scss" scoped>

</style>
