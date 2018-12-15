<template>
  <div class="container">
    <br/>
    <div class="jumbotron">
      <h1 class="display-3"><About msg="This is the about page"/></h1>
      <p class="lead">This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p>
      <hr class="my-4">
      <p>It uses utility classes for typography and spacing to space content out within the larger container.</p>
      <p class="lead">
        <a class="btn btn-primary btn-lg" href="#" role="button">Learn more</a>
      </p>
    </div>
  </div>
</template>

<script>
import About from '@/components/About.vue'

export default {
  name: 'about',
  components: {
    About
  }
}
</script>
