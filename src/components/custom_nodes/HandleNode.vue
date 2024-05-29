<script setup>
import { ref } from "vue";
import Icon from "./../Icon.vue";

const showButtons = ref(true);
</script>

<template>
  <div
    class="child-node"
    @mouseenter="showButtons = true"
    @mouseleave="showButtons = false"
  >
    <div class="node">
      <p class="node-content">Hover</p>

      <div class="line-container" v-if="showButtons">
        <div class="line-one">
          <button class="btn-add">
            <Icon name="circle" class="circle" />
          </button>
        </div>
        <div class="line-two">
          <button class="btn-add">
            <Icon
              name="multiple"
              class="multiple"
              @click="console.log('hello')"
            />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.child-node {
  padding: 10px;
}

.node {
  position: relative;

  width: fit-content;
  background-color: #ddd;
  border: none;
  border-radius: 10px;
  font-size: 24px;
}

.node-content {
  padding: 10px 50px;
}

.line-container {
  position: absolute;
  bottom: 0;
  left: 50%;

  transform: translate(-50%, 50%);

  display: flex;
  z-index: -1;
}

.btn-add {
  cursor: pointer;
}

.line-one {
  height: 54px;
  width: 36px;
  border-bottom-right-radius: 100px;
  border: 4px solid #000;
  border-top: 0;
  border-left: 0;

  position: relative;
}

.circle {
  height: 24px;

  position: absolute;
  bottom: 0;

  transform: translate(-50%, 50%);
}

.line-two {
  height: 54px;
  width: 36px;
  border-bottom-left-radius: 110px;
  border: 4px solid #000;
  border-top: 0;
  border-right: 0;

  background-color: transparent;
  position: relative;
}

.multiple {
  height: 36px;
  position: absolute;
  bottom: 0;

  transform: translate(50%, 65%) rotate(75deg);
}
</style>
