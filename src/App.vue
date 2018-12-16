<template>
  <div id="app">
    <div class="container">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
      <a class="navbar-brand" href="#">pidstat</a>
      <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor03">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link class="nav-link" to="/">PID List</router-link>
          </li>
          <li class="nav-item">
            <router-link class="nav-link" to="/about">About</router-link>
          </li>
        </ul>

        <!-- will need vuex to expose lastUpdated via global state -->
        <div class="lastUpdatedTitle">Last Updated: </div><div class="lastUpdatedDateTime">This doesn't work yet</div>

        <!-- will need vuex to expose search via global state -->
        <form class="form-inline my-2 my-lg-0">
          <input class="form-control mr-sm-2" type="text" placeholder="This doesn't work yet">
        </form>
      </div>
    </nav>
    <router-view/>
    </div>
  </div>
</template>

<style>
  .lastUpdatedTitle {
    font-size: 10px;
    font-weight: bold;
    margin-right: 5px;
  }

  .lastUpdatedDateTime {
    font-size: 10px;
    margin-right: 5px;
  }
</style>
